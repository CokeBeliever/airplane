import { _decorator, Component, Node } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

const OUTOFBOUNCE = 50;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property
    public enemySpeed = 0;

    public enemyType = Constant.EnemyType.TYPE1;
    
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const movePos = pos.z + this.enemySpeed;
        this.node.setPosition(pos.x, pos.y, movePos);

        if (movePos > OUTOFBOUNCE) {
            this.node.destroy();
        }
    }

    show(speed: number) {
        this.enemySpeed = speed;
    }
}


