import Phaser from 'phaser';

export default class Beam extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, startingPosition, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], 'beam');

    // beam의 속도, 지속시간을 적당히 설정해줍니다.
    this.SPEED = 100;
    this.DURATION = 1500;

    scene.add.existing(this);
    // 충돌이나 업데이트를 관리할 수 있게 합니다.
    scene.physics.world.enableBody(this);
    // 동적 공격 그룹에 beam을 추가합니다.
    scene.m_weaponDynamic.add(this);
    // beam을 쏘는 소리를 재생합니다.
    scene.m_beamSound.play();

    // 데미지, 크기, depth를 설정합니다.
    this.m_damage = damage;
    this.scale = scale;
    this.setDepth(30);
    // velocity, angle을 설정합니다.
    this.setVelocity();
    this.setAngle();

    // DURATION 이후 제거
    scene.time.addEvent({
      delay: this.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  setVelocity() {
    if (!this.scene.m_closest) {
      this.setVelocityY(-250);
      return;
    }
    const _x = this.scene.m_closest.x - this.x;
    const _y = this.scene.m_closest.y - this.y;
    const _r = Math.sqrt(_x * _x + _y * _y) / 2;
    // 단위벡터 * 스피드
    this.body.velocity.x = (_x / _r) * this.SPEED;
    this.body.velocity.y = (_y / _r) * this.SPEED;
  }

  setAngle() {
    // 라이캣과 몹 사이의 각도입니다.
    const angleToMob = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.m_closest.x,
      this.scene.m_closest.y
    );

    // beam 이미지의 각도를 설정해주는 부분입니다.
    // 다음 문을 각각 주석해제한 뒤 beam의 모습을 확인해보세요.
    // this.rotation = angleToMob;
    // this.rotation = angleToMob + Math.PI;
    this.rotation = angleToMob + Math.PI / 2 + Math.PI / 4;

    // angular velocity는 회전 속도를 의미하는데
    // beam이 회전하지는 않으므로 0으로 설정해줍니다.
    this.body.setAngularVelocity(0);
  }

  // beam의 damage를 설정하는 메소드입니다.
  setDamage(damage) {
    this.m_damage = damage;
  }
}
