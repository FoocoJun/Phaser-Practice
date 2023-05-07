import Phaser from 'phaser';
import Player from '../characters/Player';
import Mob from '../characters/Mob';
import { setBackground } from '../utils/backgroundManager';
import Config from '../Config';
import { addMobEvent, removeOldestMobEvent } from '../utils/mobManager';
import { addAttackEvent } from '../utils/attackManager';
import TopBar from '../ui/TopBar';
import ExpBar from '../ui/ExpBar';
import { pause } from '../utils/pauseManager';
import { createTime } from '../utils/time';

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super('playGame');
  }

  create() {
    // 사용할 sound들을 추가해놓는 부분입니다.
    // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이고,
    // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것입니다.
    this.sound.pauseOnBlur = false;
    this.m_beamSound = this.sound.add('audio_beam');
    this.m_scratchSound = this.sound.add('audio_scratch');
    this.m_hitMobSound = this.sound.add('audio_hitMob');
    this.m_growlSound = this.sound.add('audio_growl');
    this.m_explosionSound = this.sound.add('audio_explosion');
    this.m_expUpSound = this.sound.add('audio_expUp');
    this.m_hurtSound = this.sound.add('audio_hurt');
    this.m_nextLevelSound = this.sound.add('audio_nextLevel');
    this.m_gameOverSound = this.sound.add('audio_gameOver');
    this.m_gameClearSound = this.sound.add('audio_gameClear');
    this.m_pauseInSound = this.sound.add('audio_pauseIn');
    this.m_pauseOutSound = this.sound.add('audio_pauseOut');

    // player를 m_player라는 멤버 변수로 추가합니다.
    this.m_player = new Player(this);
    this.cameras.main.startFollow(this.m_player);

    // PlayingScene의 background를 설정합니다.
    setBackground(this, 'background1');

    this.m_cursorKeys = this.input.keyboard.createCursorKeys();

    this.m_mobs = this.physics.add.group();
    this.m_mobs.add(new Mob(this, 0, 0, 'mob1', 'mob1_anim', 10));
    this.m_mobEvents = [];

    // scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
    addMobEvent(this, 1000, 'mob1', 'mob1_anim', 10, 0.9);

    this.m_weaponDynamic = this.add.group();
    this.m_weaponStatic = this.add.group();
    this.m_attackEvents = {};
    // scene, attackType, attackDamage, attackScale, repeatGap
    addAttackEvent(this, 'claw', 10, 2.3, 1500);

    // collisions
    // Player와 mob이 부딪혔을 경우 player에 데미지 10을 줍니다.
    // (Player.js에서 hitByMob 함수 확인)
    this.physics.add.overlap(
      this.m_player,
      this.m_mobs,
      (player, mob) => this.m_player.hitByMob(mob.m_damage),
      null,
      this
    );

    // mob이 dynamic 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
    // (Mob.js에서 hitByDynamic 함수 확인)
    this.physics.add.overlap(
      this.m_weaponDynamic,
      this.m_mobs,
      (weapon, mob) => {
        mob.hitByDynamic(weapon, weapon.m_damage);
      },
      null,
      this
    );

    // mob이 static 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
    // (Mob.js에서 hitByStatic 함수 확인)
    this.physics.add.overlap(
      this.m_weaponStatic,
      this.m_mobs,
      (weapon, mob) => {
        mob.hitByStatic(weapon.m_damage);
      },
      null,
      this
    );

    // item
    this.m_expUps = this.physics.add.group();
    this.physics.add.overlap(
      this.m_player,
      this.m_expUps,
      (player, expUp) => {
        player.pickExpUp(expUp);
      },
      null,
      this
    );

    // topBar, expBar를 PlayingScene에 추가해줍니다.
    this.m_topBar = new TopBar(this, this.m_player.m_level);
    this.m_expBar = new ExpBar(
      this,
      this.m_player.m_exp,
      this.m_player.m_maxExp
    );

    // event handler
    // ESC 키를 누르면 "pause" 유형으로 일시정지 시킵니다.
    this.input.keyboard.on(
      'keydown-ESC',
      () => {
        pause(this, 'pause');
      },
      this
    );

    // time
    createTime(this);
  }

  update() {
    this.movePlayerManager(this.m_player);

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.width / 2;

    const closest = this.physics.closest(
      this.m_player,
      this.m_mobs.getChildren()
    );
    this.m_closest = closest;
  }

  movePlayerManager(m_player) {
    const PLAYER_SPEED = 1;
    let vector = [0, 0];

    if (
      this.m_cursorKeys.left.isDown ||
      this.m_cursorKeys.right.isDown ||
      this.m_cursorKeys.up.isDown ||
      this.m_cursorKeys.down.isDown
    ) {
      if (!m_player.m_moving) {
        m_player.play('player_anim');
      }
      m_player.m_moving = true;
    } else {
      if (m_player.m_moving) {
        m_player.play('player_idle');
      }
      m_player.m_moving = false;
    }

    if (this.m_cursorKeys.left.isDown && this.m_cursorKeys.right.isDown) {
      m_player.m_moving = false;
    } else if (this.m_cursorKeys.left.isDown) {
      vector[0] += -1;
    } else if (this.m_cursorKeys.right.isDown) {
      vector[0] += 1;
    }
    if (this.m_cursorKeys.up.isDown && this.m_cursorKeys.down.isDown) {
      m_player.m_moving = false;
    } else if (this.m_cursorKeys.up.isDown) {
      vector[1] += -1;
    } else if (this.m_cursorKeys.down.isDown) {
      vector[1] += 1;
    }

    m_player.move(vector);
    // static 공격들은 player가 이동하면 그대로 따라오도록 해줍니다.
    this.m_weaponStatic.children.each((weapon) => {
      weapon.move(vector, m_player.m_speed);
    }, this);
  }

  handleChangeGameDifficultyByLevel(level) {
    switch (level) {
      case 2:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, 'mob2', 'mob2_anim', 20, 0.8);
        break;
      case 3:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, 'mob3', 'mob3_anim', 30, 0.7);
        setBackground(this, 'background3');
        break;
      case 4:
        removeOldestMobEvent(this);
        addMobEvent(this, 1000, 'mob4', 'mob4_anim', 40, 0.7);
        break;
      case 7:
        // 보스몹은 레벨 7에 등장시킵니다.
        addMob(this, 'lion', 'lion_anim', 200, 0);
        setBackground(this, 'background2');
        break;
    }
  }
}
