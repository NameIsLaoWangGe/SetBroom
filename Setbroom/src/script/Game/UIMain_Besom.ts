import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Besom extends Laya.Script3D {
    /**挂载当前脚本的节点*/
    private self: Laya.MeshSprite3D;
    /**当前节点的transform组件*/
    private transform: Laya.Transform3D;
    /**当前节点的初始位置*/
    private firstPosX: number;
    private firstPosY: number;
    private firstPosZ: number;

    /**当前节点的初始方向*/
    private firstRotX: number;
    private firstRotY: number;
    private firstRotZ: number;

    /**当前场景*/
    private selfScene: Laya.Scene3D;

    /**扫把的初始位置*/
    private FPos: Laya.Vector3 = new Laya.Vector3();

    /**当前节点的刚体组件*/
    private selfRig: Laya.Rigidbody3D;

    /**碰撞组件*/
    private selfCol: Laya.PhysicsCollider;
    /**当前移动的手*/
    private targetHand: Laya.MeshSprite3D;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.MeshSprite3D;
        this.self['UIMain_Besom'] = this;
        this.selfScene = this.self.scene;
        this.transform = this.self.transform as Laya.Transform3D;

        this.firstPosX = this.transform.localPositionX;
        this.firstPosY = this.transform.localPositionY;
        this.firstPosZ = this.transform.localPositionZ;

        this.firstRotZ = this.transform.localRotationEulerZ;
        this.firstRotY = this.transform.localRotationEulerY;
        this.firstRotX = this.transform.localRotationEulerX;

        this.transform.localRotationEulerZ = 0;
        this.FPos = this.self.transform.localPosition;
    }

    /**初始化扫把的位置，每次开始游戏或者重新开始的时候初始化*/
    initProperty(): void {
        this.self.transform.localPositionX = this.firstPosX;
        this.self.transform.localPositionY = this.firstPosY;
        this.self.transform.localPositionZ = this.firstPosZ;
        let e = this.self.transform.localRotationEuler;
        e.x = this.firstRotX;
        e.y = this.firstRotY;
        e.z = this.firstRotZ;
        this.self.transform.localRotationEuler = e;

        lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
        lwg.Global._besomRotate = lwg.Enum.BesomMoveType.static;

        this.downAccelerated = 0;
        this.timeAdd = 0;
        this.rotateAcc_01 = 0;
        this.rotateAcc_02 = 0;
        this.upAccelerated = 0;

    }

    /**
     *刚体属性 
     */
    rigParameters(): void {
        this.selfRig.detectCollisions = true;
        this.selfRig.friction = 100;
        this.selfRig.restitution = 0.1;
        this.selfRig.gravity = (new Laya.Vector3(0, 0, 0));
        this.selfRig.angularVelocity = new Laya.Vector3(0, 0, 0);
        this.selfRig.mass = 10;
    }

    onCollisionEnter(other): void {
        console.log(other);
    }

    /**扫把的9种状态分别对应的9种运动规则*/
    /**静止*/
    move_Static(): void {
        this.self.transform.position = this.FPos;
    }

    /**连接静止*/
    move_ConnectStatic(): void {
        // 跟随
        this.besomNormalFollow();
    }

    /**扫把向下加速度变化值*/
    private upAccelerated: number;
    /**颠起向上移动*/
    move_Up(): void {
        if (this.upAccelerated < 0) {
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
        }
        this.self.transform.localPositionY += this.upAccelerated;
        this.upAccelerated -= 0.007;
        this.rotateAcc_01 = 0;
        // this.upStateControl();
    }

    /**扫把向下加速度变化值*/
    private downAccelerated: number = 0;
    /**向下移动*/
    move_Down(): void {
        this.self.transform.localPositionY += this.downAccelerated;
        this.downAccelerated -= 0.0003;
    }

    /**向右移动*/
    move_Left(): void {
        // 跟随
        this.besomNormalFollow();
    }

    /**向右移动*/
    move_Right(): void {
        // 跟随
        this.besomNormalFollow();

    }
    /**向右上方移动*/
    move_Right_Up(): void {

    }
    /**向右下方移动*/
    move_Right_Down(): void {

    }
    /**向右上方移动*/
    move_Left_Up(): void {

    }
    /**向右下方移动*/
    move_Left_Down(): void {

    }

    /**通用跟随移动*/
    besomNormalFollow(): void {
        this.targetHand = this.selfScene['UIMain'].targetHand;
        if (this.targetHand) {
            let position = this.targetHand.transform.position;
            this.self.transform.position = position;
        }
    }


    /**旋转增量*/
    private rotateAcc_01: number;
    /**旋转增量*/
    private rotateAcc_02: number;
    /**旋转规则*/
    rotate_leftAndRight(): void {
        if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.right) {
            this.self.transform.localRotationEulerZ += this.rotateAcc_01;
            this.timeAddControl();
        } else if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.left) {
            this.self.transform.localRotationEulerZ += this.rotateAcc_01;
            this.timeAddControl();
        } else if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.connectStatic) {
            let rotate = this.self.transform.localRotationEulerZ;
            if (rotate > 0) {
                this.rotateAcc_02 += 0.01;
            } else if (rotate <= 0) {
                this.rotateAcc_02 -= 0.01;
            }
            this.self.transform.localRotationEulerZ += this.rotateAcc_02;
        }
    }

    /**左右移动时，角度旋转时间延时*/
    private timeAdd: number;
    /**左右移动时的时间控制，手移动的时候，角度变化有个延时，延时后将变成自动下落状态*/
    timeAddControl(): void {
        this.timeAdd++;
        if (this.timeAdd > 0) {
            lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
        }
    }

    /**扫把保持左右摇摆和前后不移动*/
    activityRestrictions(): void {
        // 锁定xy方向不发生旋转
        let rote = this.transform.localRotationEuler;
        rote.x = 0;
        rote.y = 0;
        this.transform.localRotationEuler = rote;
        // z轴位置不发生变化
        this.transform.localPositionZ = this.firstPosZ;
    }

    onUpdate(): void {
        if (!lwg.Global._gameStart) {
            return;
        }
        this.activityRestrictions();
        switch (lwg.Global._besomMove) {

            case lwg.Enum.BesomMoveType.static:
                this.move_Static();
                break;

            case lwg.Enum.BesomMoveType.connectStatic:
                this.move_ConnectStatic();
                break;

            case lwg.Enum.BesomMoveType.up:
                this.move_Up();
                break;

            case lwg.Enum.BesomMoveType.left:
                this.move_Left();
                break;

            case lwg.Enum.BesomMoveType.right:
                this.move_Right();
                break;

            case lwg.Enum.BesomMoveType.down:
                this.move_Down();
                break;

            case lwg.Enum.BesomMoveType.right_up:
                this.move_Right_Up();
                break;

            case lwg.Enum.BesomMoveType.right_down:
                this.move_Right_Down();
                break;

            case lwg.Enum.BesomMoveType.left_up:
                this.move_Left_Up();
                break;

            case lwg.Enum.BesomMoveType.left_down:
                this.move_Left_Up();
                break;

            default:
                break;
        }
        // 角度变化
        this.rotate_leftAndRight();
    }

    onDisable(): void {
    }
}