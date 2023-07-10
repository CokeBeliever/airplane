import { _decorator, Component, Node, Prefab } from 'cc';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

const OUTOFBOUNCE = 50;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property(GameManager)
    public _gameManager: GameManager = null;

    @property
    public createBulletTime = 0.5;

    private _enemySpeed = 0;

    private _needBullet = false;

    private _currCreateBulletTime = 0;
    
    start() {

    }

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

    show(gameManager: GameManager, speed: number, needBullet: boolean) {
        this._gameManager = gameManager;
        this._enemySpeed = speed;
        this._needBullet = needBullet;
    }
}


