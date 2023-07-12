import { _decorator, Collider, Component, ITriggerEvent } from "cc";
import { Constant } from "../framework/Constant";
const { ccclass } = _decorator;

@ccclass("SelfPlane")
export class SelfPlane extends Component {
  /** 生命值 */
  public lifeValue = 5;

  /** 当前生命值 */
  private _currLife = this.lifeValue;

  /** 是否已死亡 */
  get isDie() {
    return this._currLife <= 0;
  }

  start() {}

  update(deltaTime: number) {}

  onEnable() {
    const collider = this.getComponent(Collider);
    collider.on("onTriggerEnter", this._onTriggerEnter, this);
  }

  onDisable() {
    const collider = this.getComponent(Collider);
    collider.off("onTriggerEnter", this._onTriggerEnter, this);
  }

  private _onTriggerEnter(event: ITriggerEvent) {
    const collisionGroup = event.otherCollider.getGroup();
    if (
      collisionGroup === Constant.CollisionType.ENEMY_PLANE ||
      collisionGroup === Constant.CollisionType.ENEMY_BULLET
    ) {
      this._currLife--;
    }
  }

  init() {
    this._currLife = this.lifeValue;
  }
}
