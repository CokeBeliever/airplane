import { _decorator, Collider, Component, ITriggerEvent, Node } from "cc";
import { Constant } from "../framework/Constant";
const { ccclass, property } = _decorator;

const OUTOFRANGE = 50;

@ccclass("Bullet")
export class Bullet extends Component {
  @property
  private _bulletSpeed = 0;

  @property
  private _isEnemyPlane = false;

  start() {}

  update(deltaTime: number) {
    const pos = this.node.position;
    const moveLength =
      pos.z + (this._isEnemyPlane ? this._bulletSpeed : -this._bulletSpeed);
    this.node.setPosition(pos.x, pos.y, moveLength);

    if (
      this._isEnemyPlane ? moveLength > OUTOFRANGE : moveLength < -OUTOFRANGE
    ) {
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

  show(speed: number, isEnemyPlane: boolean) {
    this._bulletSpeed = speed;
    this._isEnemyPlane = isEnemyPlane;
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    this.node.destroy();
  }
}
