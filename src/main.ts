import * as Phaser from 'phaser'
import { version } from "../package.json"

const config: Phaser.Types.Core.GameConfig = {
    title: "Platformer",
    type: Phaser.AUTO,
    version: version,
    render: {
        pixelArt: true,
    },
    width: 1280,
    height: 720,
    backgroundColor: 0x202020,
    scene: []
}

window.onload = () => {
    new Phaser.Game();
}