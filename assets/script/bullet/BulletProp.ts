import { _decorator, Collider, Component, ITriggerEvent, Node } from "cc";
import { GameManager } from "../framework/GameManager";
import { Constant } from "../framework/Constant";
const { ccclass, property } = _decorator;

@ccclass("BulletProp")
export class BulletProp extends Component {
  private _propSpeed = 0.3;

  private _propXSpeed = 0.3;

  @property(GameManager)
  private _gameManager: GameManager = null;

  start() {}

  update(deltaTime: number) {
    let pos = this.node.position;

    if (pos.x >= 15) {
      this._propXSpeed = -this._propSpeed;
    } else if (pos.x <= -15) {
      this._propXSpeed = this._propSpeed;
    }

    this.node.setPosition(
      pos.x + this._propXSpeed,
      pos.y,
      pos.z + this._propSpeed
    );

    pos = this.node.position;
    if (pos.z > 50) {
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

  show(gameManager: GameManager, speed: number) {
    this._gameManager = gameManager;
    this._propSpeed = speed;
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    const name = event.selfCollider.node.name;
    if (name === "bulletH") {
      this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_H);
    } else if (name === "bulletS") {
      this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_S);
    } else {
      this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M);
    }
    this.node.destroy();
  }
}
