import Phaser from 'phaser';
import Config from '../Config';

export default class TopBar extends Phaser.GameObjects.Graphics {
  constructor(scene, level) {
    super(scene);

    // TopBar의 배경색, 너비, 높이, depth를 지정해줍니다.
    // setScrollFactor(0)을 설정하면 플레이어가 이동해도 TopBar는 항상 화면 상단에 고정됩니다.
    this.fillStyle(0x28288c)
      .fillRect(0, 0, Config.width, 30)
      .setDepth(90)
      .setScrollFactor(0);

    // 잡은 몹의 수를 멤버 변수로 만들어줍니다. (초기값 0)
    this.m_mobsKilled = 0;
    // 잡은 몹의 수를 MOBS KILLED라는 문구 옆에 적습니다.
    this.m_mobsKilledLabel = scene.add
      .bitmapText(
        5,
        1,
        'pixelFont',
        `MOBS KILLED ${this.m_mobsKilled.toString().padStart(6, '0')}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    // 레벨을 멤버 변수로 만들어줍니다. (초기값 1)
    this.m_level = level;
    // 레벨을 LEVEL이라는 문구 옆에 적습니다.
    this.m_levelLabel = scene.add
      .bitmapText(
        650,
        1,
        'pixelFont',
        `LEVEL ${this.m_level.toString().padStart(3, '0')}`,
        40
      )
      .setScrollFactor(0)
      .setDepth(100);

    // 위에서 추가한 그래픽을 화면에 표시합니다.
    scene.add.existing(this);
  }

  // mobs killed의 값을 1 올리고, 화면의 텍스트를 수정하는 메서드입니다.
  // 이 함수는 몹이 한마리 죽을 때마다 실행됩니다. (Mob.js 참고)
  gainMobsKilled() {
    this.m_mobsKilled += 1;
    this.m_mobsKilledLabel.text = `MOBS KILLED ${this.m_mobsKilled
      .toString()
      .padStart(6, '0')}`;
  }

  // 레벨을 플레이어의 레벨과 동기화하는 메서드입니다.
  syncPlayerLevel(level) {
    this.m_level = level;
    this.m_levelLabel.text = `LEVEL ${this.m_level
      .toString()
      .padStart(3, '0')}`;
  }
}
