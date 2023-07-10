import { _decorator, Component, EventTouch, Game, Node } from 'cc';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property
    public planceSpeed = 1;

    @property(Node)
    public playerPlane: Node = null;

    @property(GameManager)
    public gameManager: GameManager = null;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);
    }

    update(deltaTime: number) {
        
    }

    private _touchStart(event: EventTouch) {
        this.gameManager.isShooting(true);
    }

    private _touchMove(event: EventTouch) {
        const delta = event.getDelta();
        const pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + delta.x * this.planceSpeed * 0.01, pos.y, pos.z - delta.y * this.planceSpeed * 0.01);
    }

    private _touchEnd(event: EventTouch) {
        this.gameManager.isShooting(false);
    }
}


