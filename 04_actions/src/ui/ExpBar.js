import Phaser from 'phaser';
import Config from '../Config';
import { clamp } from '../utils/math';

export default class ExpBar extends Phaser.GameObjects.Graphics {
  constructor(scene, exp, maxExp) {
    super(scene);

    // ExpBar의 높이와 테두리 두께를 지정합니다.
    this.HEIGHT = 30;
    this.BORDER = 4;

    // ExpBar을 그릴 왼쪽 위 시작점을 지정합니다.
    this.m_x = 0;
    this.m_y = 30;
    // 현재 경험치 멤버 변수입니다. (초기값 0)
    this.m_currentExp = exp;
    this.m_maxExp = maxExp;

    // ExpBar를 그려주고, depth와 scroll factor를 설정해줍니다.
    this.draw();
    this.setDepth(100);
    this.setScrollFactor(0);

    // ExpBar를 화면에 추가합니다.
    scene.add.existing(this);
  }

  // 경험치를 캐릭터의 경험치와 동기화하는 메서드입니다.
  syncPlayerExp(exp) {
    this.m_currentExp = clamp(exp, 0, this.m_maxExp);
    this.draw();
  }

  // 최대 경험치를 캐릭터의 최대 경험치와 동기화하는 메서드입니다.
  syncPlayerMaxExp(maxExp) {
    this.m_maxExp = maxExp;
    this.draw();
  }

  // ExpBar 도형을 그리는 메서드입니다.
  draw() {
    this.clear();

    // 검은색 배경을 그려서 테두리로 나타나도록 해줍니다.
    this.fillStyle(0x000000);
    this.fillRect(this.m_x, this.m_y, Config.width, this.HEIGHT);

    // 경험치 바의 흰색 배경을 그려줍니다.
    this.fillStyle(0xffffff);
    this.fillRect(
      this.m_x + this.BORDER,
      this.m_y + this.BORDER,
      Config.width - 2 * this.BORDER,
      this.HEIGHT - 2 * this.BORDER
    );

    // 경험치 바의 경험치를 푸르게 그려줍니다.
    // 푸른 부분이 전체의 (m_currentExp / m_maxExp * 100)%를 차지하도록 그려줍니다.
    this.fillStyle(0x3665d5);
    let d = Math.floor(
      ((Config.width - 2 * this.BORDER) / this.m_maxExp) * this.m_currentExp
    );
    this.fillRect(
      this.m_x + this.BORDER,
      this.m_y + this.BORDER,
      d,
      this.HEIGHT - 2 * this.BORDER
    );
  }
}
