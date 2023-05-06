import Phaser from 'phaser';
import Player from '../characters/Player';
import { setBackground } from '../utils/backgroundManager';
import Config from '../Config';
import { addMobEvent } from '../utils/mobManager';

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
    this.m_mobEvents = [];

    // scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
    addMobEvent(this, 1000, 'mob1', 'mob1_anim', 10, 0.9);
  }

  update() {
    this.movePlayerManager(this.m_player);

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.width / 2;
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
  }
}