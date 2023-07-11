import { _decorator, Collider, Component, instantiate, macro, math, Node, Prefab } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { Constant } from './Constant';
import { EnemyPlane } from '../plane/EnemyPlane';
import { BulletProp } from '../bullet/BulletProp';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    public playerPlane: Node = null;
    
    @property(Prefab)
    public bullet01: Prefab = null;

    @property(Prefab)
    public bullet02: Prefab = null;

    @property(Prefab)
    public bullet03: Prefab = null;

    @property(Prefab)
    public bullet04: Prefab = null;

    @property(Prefab)
    public bullet05: Prefab = null;

    @property
    public shootTime = 0.3;

    @property
    public bulletSpeed = 1;

    @property(Node)
    public bulletRoot: Node = null;

    @property(Prefab)
    public enemy01: Prefab = null;

    @property(Prefab)
    public enemy02: Prefab = null;

    @property(Prefab)
    public bulletPropM: Prefab = null;

    @property(Prefab)
    public bulletPropH: Prefab = null;

    @property(Prefab)
    public bulletPropS: Prefab = null;

    @property
    public bulletPropSpeed = 0.3;

    @property
    public createEnemyTime = 1;

    @property
    public enemy1Speed = 0.5;

    @property
    public enemy2Speed = 0.7;

    private _currShootTime = 0;
    private _isShooting = false;

    private _currCreateEnemyTime = 0;
    private _combintionInterval = Constant.Combination.PLAN1;

    private _bulletType = Constant.BulletPropType.BULLET_M;

    start() {
        this._init();
    }

    update(deltaTime: number) {
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

    private _init() {
        this._currShootTime = this.shootTime;
        this._changePlaneMode();
    }

    public createPlayerBulletM() {
        const bullet = instantiate(this.bullet01);
        bullet.setParent(this.bulletRoot);
        const pos = this.playerPlane.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false);
    }

    public createPlayerBulletH() {
        const pos = this.playerPlane.position;
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

    public createPlayerBulletS() {
        const pos = this.playerPlane.position;
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

    public isShooting(value: boolean) {
        this._isShooting = value;
    }

    private _changePlaneMode() {
        this.schedule(this._modeChanged, 10, macro.REPEAT_FOREVER);
    }

    private _modeChanged() {
        this._combintionInterval++;
        this.createBulletProp();
    }

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
        ]
        
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

    public addScore() {

    }

    public changeBulletType(type: number) {
        this._bulletType = type;
    }

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
}


