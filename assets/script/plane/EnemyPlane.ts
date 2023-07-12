import { _decorator, Collider, Component, ITriggerEvent, Node, Prefab } from "cc";
import { GameManager } from "../framework/GameManager";
import { Constant } from "../framework/Constant";
const { ccclass, property } = _decorator;

const OUTOFBOUNCE = 50;

@ccclass("EnemyPlane")
export class EnemyPlane extends Component {
  @property(GameManager)
  public _gameManager: GameManager = null;

  @property
  public createBulletTime = 0.5;

  private _enemySpeed = 0;

  private _needBullet = false;

  private _currCreateBulletTime = 0;

  start() {}

  update(deltaTime: number) {
    const pos = this.node.position;
    const movePos = pos.z + this._enemySpeed;
    this.node.setPosition(pos.x, pos.y, movePos);

    if (this._needBullet) {
      this._currCreateBulletTime += deltaTime;
      if (this._currCreateBulletTime > this.createBulletTime) {
        this._gameManager.createEnemyBullet(this.node);
        this._currCreateBulletTime = 0;
      }
    }

    if (movePos > OUTOFBOUNCE) {
      this.node.destroy();
    }
  }

  onEnable() {
    const collider = this.getComponent(Collider);
    collider.on("onTriggerEnter", this._onTriggerEnter, this);
  }

  onDisable() {
    const collider = this.getComponent(Collider);
    collider.off("onTriggerEnter", this._onTriggerEnter, this);
  }

  show(gameManager: GameManager, speed: number, needBullet: boolean) {
    this._gameManager = gameManager;
    this._enemySpeed = speed;
    this._needBullet = needBullet;
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    const collisionGroup = event.otherCollider.getGroup();
    if (
      collisionGroup === Constant.CollisionType.SELF_PLANE ||
      collisionGroup === Constant.CollisionType.SELF_BULLET
    ) {
        this.node.destroy();
        this._gameManager.addScore();
        this._gameManager.playAudioEffect('enemy');
    }
  }
}
