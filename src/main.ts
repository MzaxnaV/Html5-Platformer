import * as Phaser from 'phaser';
import { CFG } from './cfg';
import { LoadScene } from './scenes/LoadScene';
import { GameScene } from './scenes/GameScene';

window.onload = () => {
    new Phaser.Game({
        title: CFG.GAME.TITLE,
        type: Phaser.AUTO,
        version: CFG.GAME.VERSION,
        render: {
            pixelArt: true,
        },
        scale: {
            // mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        width: CFG.GAME.WIDTH,
        height: CFG.GAME.HEIGHT,
        backgroundColor: 0x222222,
        scene: [LoadScene, GameScene]
    });
}