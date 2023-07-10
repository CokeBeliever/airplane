import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Bullet } from '../bullet/Bullet';
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
    public bulletRoot: null = null;

    private _currShootTime = 0;
    private _isShooting = false;

    start() {
        this._init();
    }

    update(deltaTime: number) {
        this._currShootTime += deltaTime;
        if (this._isShooting && this._currShootTime > this.shootTime) {
            this.createPlayerBullet();
            this._currShootTime = 0;
        }
    }

    private _init() {
        this._currShootTime = this.shootTime;
    }

    public createPlayerBullet() {
        const bullet = instantiate(this.bullet01);
        bullet.setParent(this.bulletRoot);
        const pos = this.playerPlane.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.bulletSpeed = this.bulletSpeed;
    }

    public isShooting(value: boolean) {
        this._isShooting = value;
    }
}


