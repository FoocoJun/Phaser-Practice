import Phaser from 'phaser';
import Config from '../Config';
import { gameOver } from '../utils/restartManager';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameOverScene');
  }

  create() {
    gameOver(this);
    // 배경 색을 칠해줍니다.
    const bg = this.add.graphics();
    bg.fillStyle(0x5c6bc0);
    bg.fillRect(0, 0, Config.width, Config.height);
    // setScrollFactor는 화면이 이동해도 오브젝트의 위치가 고정되어 보이게 하는 함수입니다.
    bg.setScrollFactor(0);

    // 화면 가운데 'Game Over' 문구를 추가합니다.
    // setOrigin(0.5)를 통해 x축 방향으로 가운데 위치시킵니다.
    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 2,
        'pixelFont',
        'Game Over',
        80
      )
      .setOrigin(0.5);

    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 1.7,
        'pixelFont',
        'Press "Enter" to restart',
        40
      )
      .setOrigin(0.5);
  }
}
