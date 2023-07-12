import {
  _decorator,
  Collider,
  Component,
  instantiate,
  Label,
  macro,
  math,
  Node,
  Prefab,
} from "cc";
import { Bullet } from "../bullet/Bullet";
import { Constant } from "./Constant";
import { EnemyPlane } from "../plane/EnemyPlane";
import { BulletProp } from "../bullet/BulletProp";
import { SelfPlane } from "../plane/SelfPlane";
import { UIMain } from "../ui/UIMain";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Prefab)
  /** 预制子弹 01 */
  public bullet01: Prefab = null;

  @property(Prefab)
  /** 预制子弹 02 */
  public bullet02: Prefab = null;

  @property(Prefab)
  /** 预制子弹 03 */
  public bullet03: Prefab = null;

  @property(Prefab)
  /** 预制子弹 04 */
  public bullet04: Prefab = null;

  @property(Prefab)
  /** 预制子弹 05 */
  public bullet05: Prefab = null;

  @property
  /** 子弹射击间隔 */
  public shootTime = 0.3;

  @property
  /** 子弹速度 */
  public bulletSpeed = 1;

  @property(Prefab)
  /** 预制敌机 01 */
  public enemy01: Prefab = null;

  @property(Prefab)
  /** 预制敌机 02 */
  public enemy02: Prefab = null;

  @property
  /** 创建敌机间隔 */
  public createEnemyTime = 1;

  @property
  /** 敌机 01 速度 */
  public enemy1Speed = 0.5;

  @property
  /** 敌机 02 速度 */
  public enemy2Speed = 0.7;

  @property(Prefab)
  /** 预制子弹道具 M */
  public bulletPropM: Prefab = null;

  @property(Prefab)
  /** 预制子弹道具 H */
  public bulletPropH: Prefab = null;

  @property(Prefab)
  /** 预制子弹道具 S */
  public bulletPropS: Prefab = null;

  @property
  /** 子弹道具速度 */
  public bulletPropSpeed = 0.3;

  @property(Node)
  /** 子弹容器节点 */
  public bulletRoot: Node = null;

  @property(Label)
  /** 游戏分数 Label 节点 */
  public gameScore: Label = null;

  @property(Label)
  /** 游戏结束分数 Label 节点 */
  public gameOverScore: Label = null;

  @property(SelfPlane)
  /** 玩家飞机 */
  public playerPlane: SelfPlane = null;

  @property(UIMain)
  public uiMain: UIMain = null;

  /** 游戏状态 */
  public gameState = Constant.GameState.GAME_START;
  /** 当前子弹射击间隔时间 */
  private _currShootTime = this.shootTime;
  /** 是否子弹射击 */
  private _isShooting = false;
  /** 当前床架敌机间隔时间 */
  private _currCreateEnemyTime = 0;
  /** 敌机出现的组合方式 */
  private _combintionInterval = Constant.Combination.PLAN1;
  /** 道具类型 */
  private _bulletType = Constant.BulletPropType.BULLET_M;
  /** 分数 */
  private _score = 0;

  start() {}

  update(deltaTime: number) {
    if (this.gameState !== Constant.GameState.GAME) return;

    // 游戏结束
    if (this.playerPlane.isDie) {
      this.initGameOver();
      return;
    }

    // 发射子弹
    this._currShootTime += deltaTime;
    if (this._isShooting && this._currShootTime > this.shootTime) {
      if (this._bulletType === Constant.BulletPropType.BULLET_H) {
        this.createPlayerBulletH();
      } else if (this._bulletType === Constant.BulletPropType.BULLET_S) {
        this.createPlayerBulletS();
      } else {
        this.createPlayerBulletM();
      }
      this._currShootTime = 0;
    }

    // 敌机出现
    this._currCreateEnemyTime += deltaTime;
    if (this._combintionInterval === Constant.Combination.PLAN1) {
      if (this._currCreateEnemyTime > this.createEnemyTime) {
        this.createEnemyPlane();
        this._currCreateEnemyTime = 0;
      }
    } else if (this._combintionInterval === Constant.Combination.PLAN2) {
      if (this._currCreateEnemyTime > this.createEnemyTime * 0.9) {
        const randomCombination = math.randomRangeInt(1, 3);
        if (randomCombination === Constant.Combination.PLAN2) {
          this.createCombintion1();
        } else {
          this.createEnemyPlane();
        }
        this._currCreateEnemyTime = 0;
      }
    } else {
      if (this._currCreateEnemyTime > this.createEnemyTime * 0.9) {
        const randomCombination = math.randomRangeInt(1, 3);
        if (randomCombination === Constant.Combination.PLAN2) {
          this.createCombintion2();
        } else {
          this.createEnemyPlane();
        }
        this._currCreateEnemyTime = 0;
      }
    }
  }

  /**
   * 创建玩家飞机子弹 M
   */
  public createPlayerBulletM() {
    const bullet = instantiate(this.bullet01);
    bullet.setParent(this.bulletRoot);
    const pos = this.playerPlane.node.position;
    bullet.setPosition(pos.x, pos.y, pos.z - 7);
    const bulletComp = bullet.getComponent(Bullet);
    bulletComp.show(this.bulletSpeed, false);
  }

  /**
   * 创建玩家飞机子弹 H
   */
  public createPlayerBulletH() {
    const pos = this.playerPlane.node.position;
    // left
    const bullet1 = instantiate(this.bullet03);
    bullet1.setParent(this.bulletRoot);
    bullet1.setPosition(pos.x - 2.5, pos.y, pos.z - 7);
    const bulletComp1 = bullet1.getComponent(Bullet);
    bulletComp1.show(this.bulletSpeed, false);

    // right
    const bullet2 = instantiate(this.bullet03);
    bullet2.setParent(this.bulletRoot);
    bullet2.setPosition(pos.x + 2.5, pos.y, pos.z - 7);
    const bulletComp2 = bullet2.getComponent(Bullet);
    bulletComp2.show(this.bulletSpeed, false);
  }

  /**
   * 创建玩家飞机子弹 S
   */
  public createPlayerBulletS() {
    const pos = this.playerPlane.node.position;
    // middle
    const bullet = instantiate(this.bullet05);
    bullet.setParent(this.bulletRoot);
    bullet.setPosition(pos.x, pos.y, pos.z - 7);
    const bulletComp = bullet.getComponent(Bullet);
    bulletComp.show(this.bulletSpeed, false);

    // left
    const bullet1 = instantiate(this.bullet05);
    bullet1.setParent(this.bulletRoot);
    bullet1.setPosition(pos.x - 4, pos.y, pos.z - 7);
    const bulletComp1 = bullet1.getComponent(Bullet);
    bulletComp1.show(this.bulletSpeed, false, Constant.Direction.LEFT);

    // right
    const bullet2 = instantiate(this.bullet05);
    bullet2.setParent(this.bulletRoot);
    bullet2.setPosition(pos.x + 4, pos.y, pos.z - 7);
    const bulletComp2 = bullet2.getComponent(Bullet);
    bulletComp2.show(this.bulletSpeed, false, Constant.Direction.RIGHT);
  }

  /**
   * 创建敌机子弹
   * @param enemyPlane 敌机节点
   */
  public createEnemyBullet(enemyPlane: Node) {
    const bullet = instantiate(this.bullet01);
    bullet.setParent(this.bulletRoot);
    const pos = enemyPlane.position;
    bullet.setPosition(pos.x, pos.y, pos.z + 6);
    const bulletComp = bullet.getComponent(Bullet);
    bulletComp.show(this.bulletSpeed, true);

    const colliderComp = bullet.getComponent(Collider);
    colliderComp.setGroup(Constant.CollisionType.ENEMY_BULLET);
    colliderComp.setMask(Constant.CollisionType.SELF_PLANE);
  }

  /**
   * 修改是否子弹射击
   * @param value 是否射击
   */
  public isShooting(value: boolean) {
    this._isShooting = value;
  }

  /**
   * 模式修改
   */
  private _modeChanged() {
    this._combintionInterval++;
    this.createBulletProp();
  }

  /**
   * 创建敌机
   */
  public createEnemyPlane() {
    const enemyType = math.randomRangeInt(1, 3);
    let prefab: Prefab = null;
    let speed = 0;

    if (enemyType === Constant.EnemyType.TYPE1) {
      prefab = this.enemy01;
      speed = this.enemy1Speed;
    } else {
      prefab = this.enemy02;
      speed = this.enemy2Speed;
    }

    const enemy = instantiate(prefab);
    enemy.setParent(this.bulletRoot);
    const randomPos = math.randomRange(-25, 26);
    enemy.setPosition(randomPos, 0, -50);
    const enemyComp = enemy.getComponent(EnemyPlane);
    enemyComp.show(this, speed, true);
  }

  /**
   * 创建敌机组合 1
   */
  public createCombintion1() {
    const enemyArray = new Array<Node>(5);
    for (let i = 0; i < enemyArray.length; i++) {
      enemyArray[i] = instantiate(this.enemy01);
      const element = enemyArray[i];
      element.parent = this.bulletRoot;
      element.setPosition(-20 + i * 10, 0, -50);
      const enemyComp = element.getComponent(EnemyPlane);
      enemyComp.show(this, this.enemy1Speed, false);
    }
  }

  /**
   * 创建敌机组合 2
   */
  public createCombintion2() {
    const enemyArray = new Array<Node>(7);
    const combinationPos = [
      [-21, 0, -60],
      [-14, 0, -55],
      [-7, 0, -50],
      [0, 0, -45],
      [7, 0, -50],
      [14, 0, -55],
      [21, 0, -60],
    ];

    for (let i = 0; i < enemyArray.length; i++) {
      const pos = combinationPos[i];
      enemyArray[i] = instantiate(this.enemy02);
      const element = enemyArray[i];
      element.parent = this.bulletRoot;
      element.setPosition(pos[0], pos[1], pos[2]);
      const enemyComp = element.getComponent(EnemyPlane);
      enemyComp.show(this, this.enemy2Speed, false);
    }
  }

  /**
   * 创建道具
   */
  public createBulletProp() {
    const randomProp = math.randomRangeInt(1, 4);
    let prefab: Prefab = null;

    if (randomProp === Constant.BulletPropType.BULLET_H) {
      prefab = this.bulletPropH;
    } else if (randomProp === Constant.BulletPropType.BULLET_S) {
      prefab = this.bulletPropS;
    } else {
      prefab = this.bulletPropM;
    }

    const prop = instantiate(prefab);
    prop.setParent(this.bulletRoot);
    prop.setPosition(15, 0, -50);
    const propComp = prop.getComponent(BulletProp);
    propComp.show(this, this.bulletPropSpeed);
  }

  /**
   * 增加分数
   */
  public addScore() {
    this._score++;
    this.gameScore.string = this._score.toString();
  }

  /**
   * 修改子弹类型
   * @param type 子弹类型
   */
  public changeBulletType(type: number) {
    this._bulletType = type;
  }

  /**
   * 初始化游戏开始
   */
  public initGameStart() {
    this.gameState = Constant.GameState.GAME_START;
    this.uiMain.showGameStart();
  }

  /**
   * 初始化游戏过程
   */
  public initGame() {
    this.gameState = Constant.GameState.GAME;
    this._currShootTime = this.shootTime;
    this._isShooting = false;
    this._currCreateEnemyTime = 0;
    this._combintionInterval = Constant.Combination.PLAN1;
    this._bulletType = Constant.BulletPropType.BULLET_M;
    this._score = 0;
    this.gameScore.string = this._score.toString();
    this.playerPlane.init();
    this.schedule(this._modeChanged, 10, macro.REPEAT_FOREVER);
    this.uiMain.showGame();
  }

  /**
   * 初始化游戏结束
   */
  public initGameOver() {
    this.gameState = Constant.GameState.GAME_OVER;
    this.gameOverScore.string = this._score.toString();
    this.unschedule(this._modeChanged);
    this.uiMain.showGameOver();
    this._destoryAll();
  }

  private _destoryAll() {
    const children = this.bulletRoot.children;

    for (let i = children.length - 1; i >= 0; i--) {
      children[i].destroy();
    }
  }
}
