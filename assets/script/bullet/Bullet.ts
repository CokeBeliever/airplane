import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

const OUTOFRANGE = 50;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    private _bulletSpeed = 0;

    @property
    private _isEnemyPlane = false;
    
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const moveLength = pos.z + (this._isEnemyPlane ? this._bulletSpeed : -this._bulletSpeed);
        this.node.setPosition(pos.x, pos.y, moveLength);

        if (this._isEnemyPlane ? moveLength > OUTOFRANGE : moveLength < -OUTOFRANGE) {
            this.node.destroy();
            console.log('bullet destroy');
        }
    }

    show(speed: number, isEnemyPlane: boolean) {
        this._bulletSpeed = speed;
        this._isEnemyPlane = isEnemyPlane;
    }
}


