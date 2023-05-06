import Phaser from 'phaser';
import Config from '../Config';
import HpBar from '../ui/HpBar';
import sceneManager from '../utils/sceneManager';
import { pause } from '../utils/pauseManager';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    // 화면의 가운데에 player를 추가해줍니다.
    // scene.add.existing : scene에 오브젝트를 추가
    // scene.physics.add.existing : scene의 물리엔진에 오브젝트를 추가
    super(scene, Config.width / 2, Config.height / 2, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // scale 프로퍼티를 조절해 크기를 조절할 수 있습니다. (디폴트: 1)
    this.scale = 2;

    // depth를 조절해 어떤 오브젝트가 앞에 오고 뒤에 올지 설정할 수 있습니다.
    // CSS의 z-index와 비슷한 개념입니다. (디폴트: 0)
    this.setDepth(20);

    // 해당 오브젝트가 물리적으로 얼만큼의 면적을 차지할 지 설정하는 함수입니다.
    // 디폴트로 이미지 사이즈로 설정되는데, 그러면 추후 몹을 추가했을 때 너무 잘 부딪히는 느낌이 드므로 원본 이미지보다 약간 작게 설정해주었습니다.
    this.setBodySize(28, 32);

    this.m_moving = false;

    // 플레이어가 공격받을 수 있는지 여부를 나타내는 멤버 변수입니다.
    // 공격받은 후 쿨타임을 주기 위해 사용합니다.
    this.m_canBeAttacked = true;

    this.m_hpBar = new HpBar(scene, this, 100);

    this.m_exp = 0;
    this.m_maxExp = 50;
    this.m_level = 1;
  }

  move(vector) {
    let PLAYER_SPEED = 5;
    this.x += vector[0] * PLAYER_SPEED;
    this.y += vector[1] * PLAYER_SPEED;

    if (vector[0] === -1) {
      this.flipX = false;
    } else if (vector[0] === 1) {
      this.flipX = true;
    }
  }

  // player와 expUp이 접촉했을 때 실행되는 메소드입니다.
  pickExpUp(expUp) {
    // expUp을 비활성화하고 화면에 보이지 않게 합니다.
    expUp.disableBody(true, true);
    // expUp을 제거합니다.
    expUp.destroy();

    // 소리를 재생합니다.
    this.scene.m_expUpSound.play();

    // 경험치를 획득합니다.
    this.getExp(expUp);
  }

  // 몹과 접촉했을 경우 실행되는 함수입니다.
  hitByMob(damage) {
    // 쿨타임이었던 경우 공격받지 않습니다.
    if (!this.m_canBeAttacked) return;

    // 플레이어가 다친 소리를 재생합니다.
    this.scene.m_hurtSound.play();
    // 쿨타임을 갖습니다.
    this.getCooldown();

    this.m_hpBar.decrease(damage);

    if (this.m_hpBar.m_currentHp <= 0) {
      sceneManager.loseGame(this.scene);
    }
  }

  // 공격받은 후 1초 쿨타임을 갖게 하는 함수입니다.
  // 공격받을 수 있는지 여부와 투명도를 1초동안 조절합니다.
  getCooldown() {
    this.m_canBeAttacked = false;
    this.alpha = 0.5;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.alpha = 1;
        this.m_canBeAttacked = true;
      },
      callbackScope: this,
      loop: false,
    });
  }

  getExp(expUp) {
    this.m_exp += expUp.m_exp;
    this.scene.m_expBar.syncPlayerExp(this.m_exp);
    if (this.m_exp >= this.m_maxExp) {
      this.pauseByLevelUp();
    }
  }

  pauseByLevelUp() {
    pause(this.scene, 'levelup');
  }

  afterLevelUp() {
    this.levelUp();
  }

  levelUp() {
    this.handlePlayerLevelUp();
    this.resetPlayerExp();
    this.increasePlayerMaxExp();
  }

  handlePlayerLevelUp(amount = 1) {
    this.m_level += amount;
    this.scene.m_topBar.syncPlayerLevel(this.m_level);
  }

  resetPlayerExp(resetExp = 0) {
    this.m_exp = resetExp;
    this.scene.m_expBar.syncPlayerExp(this.m_exp);
  }

  increasePlayerMaxExp(amount = 20) {
    this.m_maxExp += amount;
    this.scene.m_expBar.syncPlayerMaxExp(this.m_maxExp);
  }
}
