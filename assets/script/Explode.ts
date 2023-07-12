import { _decorator, Component, Node } from 'cc';
import { PoolManager } from './framework/PoolManager';
const { ccclass, property } = _decorator;

const poolManager = PoolManager.instance()

@ccclass('Explode')
export class Explode extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onEnable() {
        this.scheduleOnce(this._putBack, 1);
    }

    private _putBack() {
        poolManager.putNode(this.node);
    }
}


