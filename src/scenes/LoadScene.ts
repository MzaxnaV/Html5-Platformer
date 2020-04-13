import { CFG } from '../cfg'
import { Vector } from 'matter';

class Room {
	public size = { w: CFG.WORLD.ROOM_MIN_SIZE.x, h: CFG.WORLD.ROOM_MIN_SIZE.y };
	public pos = { x: CFG.WORLD.ROOM_OFFSET, y: CFG.WORLD.ROOM_OFFSET };

	public door = { top: [-1, -1], bottom: [-1, -1], right: [-1, -1], left: [-1, -1] };

	constructor(w: integer, h: integer) { // remove this
		this.size.w = CFG.randInt(this.size.w, w - 2 * CFG.WORLD.ROOM_OFFSET);
		this.size.h = CFG.randInt(this.size.h, h - 2 * CFG.WORLD.ROOM_OFFSET);
		this.pos.x = CFG.randInt(this.pos.x, w - 2 * CFG.WORLD.ROOM_OFFSET - this.size.w);
		this.pos.y = CFG.randInt(this.pos.y, h - 2 * CFG.WORLD.ROOM_OFFSET - this.size.h);
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

		this.levelData = new Array(CFG.WORLD.HEIGHT).fill(1).map(() => new Array(CFG.WORLD.WIDTH).fill(1));
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

				// this.levelData[j*16][i*16] = 0;

				for (let x = 0; x < room.size.w; x++) {
					for (let y = 0; y < room.size.h; y++) {
						this.levelData[room.pos.y + y + j * 16][room.pos.x + x + i * 16] = 0;
					}
				}

				// generate doors
				this.levelData[room.door.top[1] + room.pos.y + j * 16][room.door.top[0] + room.pos.x + i * 16] = 0;
				this.levelData[room.door.bottom[1] + room.pos.y + j * 16][room.door.bottom[0] + room.pos.x + i * 16] = 0;
				this.levelData[room.door.left[1] + room.pos.y + j * 16][room.door.left[0] + room.pos.x + i * 16] = 0;
				this.levelData[room.door.right[1] + room.pos.y + j * 16][room.door.right[0] + room.pos.x + i * 16] = 0;

				if (i > 0 && j > 0) {
					let roomTop = this.level[j - 1][i];
					let roomLeft = this.level[j][i - 1];

					let path = this.makePath(room, roomTop, roomLeft, i * 16, j * 16);

					path.forEach(element => {
						this.levelData[element[1] + j * 16][element[0] + i * 16] = 0;
					})
				}
			}
		}
	}

	private makePath(room: Room, roomTop: Room, roomLeft: Room, offsetX: integer, offsetY: integer) {
		let path: integer[][] = [];

		// let disTop = [roomTop.door.bottom[0] - room.door.top[0], roomTop.door.bottom[1] - room.door.top[1]];
		let disTop = [room.door.top[0] + room.pos.x - roomTop.door.bottom[0] - roomTop.pos.x, room.door.top[1] + room.pos.y + 16 - roomTop.door.bottom[1] - roomTop.pos.y];

		for (let j = 0; j < disTop[1]; j++) {
			path.push([room.door.top[0] + room.pos.x, room.door.top[1] + room.pos.y - j]);
		}

		for (let i = 1; i <= Math.abs(disTop[0]); i++) {
			path.push([path[path.length - 1][0] - (Math.floor(disTop[0] / Math.abs(disTop[0]))), path[path.length - 1][1]]);
		}

		let disLeft = [room.door.left[0] + room.pos.x + 16 - roomLeft.door.right[0] - roomLeft.pos.x, room.door.left[1] + room.pos.y - roomLeft.door.right[1] - roomLeft.pos.y];

		for (let i = 0; i < disLeft[0]; i++) {
			path.push([room.door.left[0] + room.pos.x - i, room.door.left[1] + room.pos.y]);
		}

		for (let j = 0; j < Math.abs(disLeft[1]); j++) {
			path.push([path[path.length - 1][0], path[path.length - 1][1] - (Math.floor(disLeft[1]/Math.abs(disLeft[1])))]);
		}

		// path.push([roomTop.door.bottom[0] + roomTop.pos.x, roomTop.door.bottom[1] + roomTop.pos.y + 1]);

		return path;
	}

	private createDivision(x0: integer, y0: integer, x1: integer, y1: integer, levelData: integer[][], val: integer) {

		// TODO: remove this from here
		let randInt = (min: integer, max: integer) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// check if there is space to subdivide rooms
		if (!((x1 - x0) > 2 + CFG.WORLD.ROOM_MIN_SIZE.x * 2 && (y1 - y0) > 2 + CFG.WORLD.ROOM_MIN_SIZE.y * 2)) {
			return;
		}

		do {
			var x = randInt(x0 + 2, x1 - 2);
			var right = (x - x0) > CFG.WORLD.ROOM_MIN_SIZE.x;
			var left = (x1 - x) > CFG.WORLD.ROOM_MIN_SIZE.x;
		} while (!(right && left));

		do {
			var y = randInt(y0 + 2, y1 - 2);
			var top = (y - y0) > CFG.WORLD.ROOM_MIN_SIZE.y;
			var bottom = (y1 - y) > CFG.WORLD.ROOM_MIN_SIZE.y;
		} while (!(top && bottom));

		// divide vertically
		for (let i = x0; i <= x1; i++) {
			levelData[y][i] = val;
		}

		// divide horizontally
		for (let j = y0; j <= y1; j++) {
			levelData[j][x] = val;
		}

		console.log("Data", levelData);
		console.log("x", x);
		console.log("y", y);

		if (top && right) {
			this.createDivision(x0, y0, x, y, levelData, val);
		}
		if (bottom && right) {
			this.createDivision(x0, y, x, y1, levelData, val);
		}
		if (top && left) {
			this.createDivision(x, y0, x1, y, levelData, val);
		}
		if (bottom && left) {
			this.createDivision(x, y, x1, y1, levelData, val);
		}
	}

	update() {

	}

}