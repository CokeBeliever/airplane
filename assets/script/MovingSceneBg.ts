import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MovingSceneBg")
export class MovingSceneBg extends Component {
  @property(Node)
  bg01: Node = null;

  @property(Node)
  bg02: Node = null;

  private _bgSpeed = 10;
  private _bgMovingRange = 90;

  start() {
    this._init();
  }

  update(deltaTime: number) {
    this._moveBackground(deltaTime);
  }

  private _init() {
    this.bg01.setPosition(0, 0, 0);
    this.bg02.setPosition(0, 0, -this._bgMovingRange);
  }

  private _moveBackground(deltaTime: number) {
    const bgMovingSizeZ = this._bgSpeed * deltaTime;

    this._movingBg(this.bg01, bgMovingSizeZ);
    this._movingBg(this.bg02, bgMovingSizeZ);
  }

  private _movingBg(bg: Node, bgMovingSizeZ: number) {
    const bgTargetPositionZ = bg.position.z + bgMovingSizeZ;

    if (bgTargetPositionZ > this._bgMovingRange) {
      bg.setPosition(0, 0, bgTargetPositionZ - 2 * this._bgMovingRange);
    } else {
      bg.setPosition(0, 0, bgTargetPositionZ);
    }
  }
}
