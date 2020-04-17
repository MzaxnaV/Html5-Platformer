import { CFG } from '../cfg'
import { Vector } from 'matter';

class Room {
	public size = { w: CFG.WORLD.ROOM_MIN_SIZE.x, h: CFG.WORLD.ROOM_MIN_SIZE.y };
	public pos = { x: CFG.WORLD.ROOM_OFFSET, y: CFG.WORLD.ROOM_OFFSET };

	public door = { top: [-1, -1], bottom: [-1, -1], right: [-1, -1], left: [-1, -1] };

	constructor(w: integer, h: integer) { // remove this
		this.size.w = CFG.randInt(this.size.w, w - 2 * CFG.WORLD.ROOM_OFFSET);
		this.size.h = CFG.randInt(this.size.h, h - 2 * CFG.WORLD.ROOM_OFFSET);
		this.pos.x = CFG.randInt(this.pos.x, w - CFG.WORLD.ROOM_OFFSET - this.size.w);
		this.pos.y = CFG.randInt(this.pos.y, h - CFG.WORLD.ROOM_OFFSET - this.size.h);
		this.door.top = [CFG.randInt(0, this.size.w - 1), -1];
		this.door.bottom = [CFG.randInt(0, this.size.w - 1), this.size.h];
		this.door.left = [-1, CFG.randInt(0, this.size.h - 1)];
		this.door.right = [this.size.w, CFG.randInt(0, this.size.h - 1)];

	}
}

export class LoadScene extends Phaser.Scene {

	private levelData: integer[][]
	private level: Room[][]

	constructor() {
		super({
			key: CFG.SCENES.LOAD
		})

		this.levelData = new Array(CFG.WORLD.HEIGHT).fill(CFG.TILE.BLOCK).map(() => new Array(CFG.WORLD.WIDTH).fill(CFG.TILE.BLOCK));
		this.level = this.createLevel();
	}

	preload() {
		this.load.image('tiles', 'assets/drawtiles.png');
		this.load.image('player', 'assets/player.png');

		let loadingBar = this.add.graphics({
			fillStyle: {
				color: 0xffffff
			}
		})

		this.load.on("progress", (percent: number) => {
			loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 60);
			console.log(percent);
		})

		this.load.on("complete", () => {
			console.log("done");
		})
	}

	create() {
		// this.createDivision(0, 0, CFG.WORLD.WIDTH - 1, CFG.WORLD.HEIGHT - 1, this.levelData, 1);
		this.generateLevelData();
		console.log(this.level);
		// @ts-ignore
		this.scene.start(CFG.SCENES.GAME, this.levelData);
	}

	private createLevel() {

		// define sublevel,
		let sublevel = {
			size: { x: 16, y: 16 }, //remove from here
			get w() { return Math.floor(CFG.WORLD.HEIGHT / this.size.x); },
			get h() { return Math.floor(CFG.WORLD.WIDTH / this.size.y); },
		}

		let level: Room[][] = [];

		for (let i = 0; i < sublevel.w; i++) {
			level[i] = [];
			for (let j = 0; j < sublevel.h; j++) {
				level[i][j] = new Room(sublevel.size.x, sublevel.size.y);
			}
		}

		return level;
	}

	private generateLevelData() {

		for (let j = 0; j < this.level.length; j++) {
			for (let i = 0; i < this.level[j].length; i++) {
				let room: Room = this.level[j][i];

				for (let x = 0; x < room.size.w; x++) {
					for (let y = 0; y < room.size.h; y++) {
						this.levelData[room.pos.y + y + j * 16][room.pos.x + x + i * 16] = CFG.TILE.EMPTY;
					}
				}

				this.levelData[room.door.bottom[1] + room.pos.y + j * 16][room.door.bottom[0] + room.pos.x + i * 16] = CFG.TILE.EMPTY;
				this.levelData[room.door.right[1] + room.pos.y + j * 16][room.door.right[0] + room.pos.x + i * 16] = CFG.TILE.EMPTY;

				if (i > 0 && j > 0) {

					let roomTop = this.level[j - 1][i];
					let roomLeft = this.level[j][i - 1];

					let pathtop = this.makeTop(room, roomTop);

					pathtop.forEach(element => {
						this.levelData[element[1] + j * 16][element[0] + i * 16] = CFG.TILE.EMPTY;
					})

					let pathLeft = this.makeLeft(room, roomLeft);

					pathLeft.forEach(element => {
						this.levelData[element[1] + j * 16][element[0] + i * 16] = CFG.TILE.EMPTY;
					})
				}
			}
		}

		for (let i = 1; i < this.level[0].length; i++) {

			let j = this.level.length - 1;
			let room:Room = this.level[j][i];

			this.levelData[room.door.bottom[1] + room.pos.y + j * 16][room.door.bottom[0] + room.pos.x + i * 16] = CFG.TILE.BLOCK;

			let path = this.makeLeft(this.level[0][i], this.level[0][i - 1]);
			path.forEach(element => {
				this.levelData[element[1]][element[0] + i * 16] = CFG.TILE.EMPTY;
			})
		}

		for (let j = 1; j < this.level.length; j++) {

			let i = this.level[j].length - 1;
			let room:Room = this.level[j][i];

			this.levelData[room.door.right[1] + room.pos.y + j * 16][room.door.right[0] + room.pos.x + i * 16] = CFG.TILE.BLOCK;

			let path = this.makeTop(this.level[j][0], this.level[j - 1][0]);
			path.forEach(element => {
				this.levelData[element[1] + j * 16][element[0]] = CFG.TILE.EMPTY;
			})
		}

		for (let j = 1; j < this.levelData.length - 1; j++) {
			for (let i = 1; i < this.levelData[j].length - 1; i++) {

				if (this.levelData[j][i] == CFG.TILE.BLOCK){
					let combined = "";

					combined = (this.levelData[j][i-1] == CFG.TILE.EMPTY) ? combined + "L": combined;
					combined = (this.levelData[j][i+1] == CFG.TILE.EMPTY) ? combined + "R": combined;
					combined = (this.levelData[j-1][i] == CFG.TILE.EMPTY) ? combined + "T": combined;
					combined = (this.levelData[j+1][i] == CFG.TILE.EMPTY) ? combined + "B": combined;

					if (combined != "") {
						// @ts-ignore
						this.levelData[j][i] = CFG.TILE[combined];
					}
				}
			}
		}
	}

	private makeLeft(room: Room, roomLeft: Room) {
		let path: integer[][] = [];

		let disLeft = [room.door.left[0] + room.pos.x + 16 - roomLeft.door.right[0] - roomLeft.pos.x, room.door.left[1] + room.pos.y - roomLeft.door.right[1] - roomLeft.pos.y];

		for (let i = 0; i < disLeft[0]; i++) {
			path.push([room.door.left[0] + room.pos.x - i, room.door.left[1] + room.pos.y]);
		}

		for (let j = 0; j < Math.abs(disLeft[1]); j++) {
			path.push([path[path.length - 1][0], path[path.length - 1][1] - (Math.floor(disLeft[1] / Math.abs(disLeft[1])))]);
		}

		return path;
	}

	private makeTop(room: Room, roomTop: Room) {
		let path: integer[][] = [];

		let disTop = [room.door.top[0] + room.pos.x - roomTop.door.bottom[0] - roomTop.pos.x, room.door.top[1] + room.pos.y + 16 - roomTop.door.bottom[1] - roomTop.pos.y];

		for (let j = 0; j < disTop[1]; j++) {
			path.push([room.door.top[0] + room.pos.x, room.door.top[1] + room.pos.y - j]);
		}

		for (let i = 1; i <= Math.abs(disTop[0]); i++) {
			path.push([path[path.length - 1][0] - (Math.floor(disTop[0] / Math.abs(disTop[0]))), path[path.length - 1][1]]);
		}

		return path;
	}

	update() {

	}

}