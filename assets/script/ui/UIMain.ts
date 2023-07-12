import { _decorator, Component, EventTouch, Game, Node, Animation } from "cc";
import { GameManager } from "../framework/GameManager";
import { Constant } from "../framework/Constant";
const { ccclass, property } = _decorator;

@ccclass("UIMain")
export class UIMain extends Component {
  @property(Node)
  /** 玩家飞机节点 */
  public playerPlane: Node = null;

  @property
  /** 玩家飞机节点移动速度 */
  public planceSpeed = 1;

  @property(GameManager)
  /** 游戏管理实例 */
  public gameManager: GameManager = null;

  @property(Node)
  /** 游戏开始节点 */
  public gameStart: Node = null;

  @property(Node)
  /** 游戏过程节点 */
  public game: Node = null;

  @property(Node)
  /** 游戏结束节点 */
  public gameOver: Node = null;

  @property(Animation)
  /** 游戏结束动画 */
  public overAnim: Animation = null;

  start() {
    this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this._touchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);
    this.gameStart.active = true;
  }

  update(deltaTime: number) {}

  /**
   * 显示游戏开始 UI
   */
  showGameStart() {
    this.gameStart.active = true;
    this.game.active = false;
    this.gameOver.active = false;
  }

  /**
   * 显示游戏过程 UI
   */
  showGame() {
    this.gameStart.active = false;
    this.game.active = true;
    this.gameOver.active = false;
  }

  /**
   * 显示游戏结束 UI
   */
  showGameOver() {
    this.gameStart.active = false;
    this.game.active = false;
    this.gameOver.active = true;
    this.overAnim.play();
  }

  /**
   * 监听点击再来一局
   */
  reStart() {
    this.gameManager.initGame();
  }

  /**
   * 监听点击回到主页
   */
  returnMain() {
    this.gameManager.initGameStart();
  }

  /**
   * 监听触摸开始
   */
  private _touchStart(event: EventTouch) {
    if (this.gameManager.gameState === Constant.GameState.GAME) {
      this.gameManager.isShooting(true);
    } else if (this.gameManager.gameState === Constant.GameState.GAME_START) {
      this.gameManager.initGame();
    }
  }

  /**
   * 监听触摸移动
   */
  private _touchMove(event: EventTouch) {
    if (this.gameManager.gameState !== Constant.GameState.GAME) return;

    const delta = event.getDelta();
    const pos = this.playerPlane.position;
    this.playerPlane.setPosition(
      pos.x + delta.x * this.planceSpeed * 0.01,
      pos.y,
      pos.z - delta.y * this.planceSpeed * 0.01
    );
  }

  /**
   * 监听触摸移动
   */
  private _touchEnd(event: EventTouch) {
    if (this.gameManager.gameState !== Constant.GameState.GAME) return;
    
    this.gameManager.isShooting(false);
  }
}
