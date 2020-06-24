import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Gold extends Laya.Script3D {

    private self: Laya.MeshSprite3D;
    private selfCol: Laya.PhysicsCollider;
    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.MeshSprite3D;
        let selfCol = this.self.getComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        selfCol.isTrigger = true;
    }

    onCollisionEnter(other) {
        // console.log('3D碰撞必须继承Laya.Script3D！');
        // lwg.Global._taskGoldNum++;
        // this.self.removeSelf();
    }
    onTriggerStay(other) {
        console.log(other);
    }

    onDisable(): void {

    }
    onUpdate(): void {
        // 旋转动画
        this.self.transform.localRotationEulerZ += 2;
        // 碰到扫把头则消失
        let besom = lwg.Global.UIMain['UIMain'].Besom as Laya.MeshSprite3D;
        let besomHead = besom.getChildByName('head') as Laya.MeshSprite3D;
        let diffX = this.self.transform.position.x - besomHead.transform.position.x;
        let diffY = this.self.transform.position.y - besomHead.transform.position.y;
        if (Math.abs(diffX) < 0.10 && Math.abs(diffY) < 0.10) {
            lwg.Global._taskGoldNum++;
            this.self.removeSelf();
        }
    }
}