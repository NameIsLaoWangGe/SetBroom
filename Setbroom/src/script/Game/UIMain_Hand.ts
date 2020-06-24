import UIMain_Person from './UIMain_Person';
import { lwg } from '../Lwg_Template/lwg';
export default class Hand extends Laya.Script3D {
    /** 指代当前脚本挂载的节点*/
    private self: Laya.MeshSprite3D;
    /**所属场景*/
    private selfScene: Laya.Scene3D;
    /**手的刚体*/
    private selfRig: Laya.Rigidbody3D;
    /**手的碰撞容器*/
    private compoundShape: Laya.CompoundColliderShape = new Laya.CompoundColliderShape();
    /**子节点手心和初始距离*/
    private palm: Laya.MeshSprite3D;
    private palmLPx: number;
    private palmLPy: number;
    private palmLPz: number;

    /**扫把*/
    private Besom: Laya.MeshSprite3D;

    /**扫把底部相对于手心的X位置*/
    private firstOffsetX: number;

    /**扫把中心点到扫把底部的距离，也就是下半身的长度，是定值，通过在模型中测量获得*/
    private BesomHandleLen: number;

    /**扫把和手碰到的时候他们中心店之间的距离差值，扫把的中心点在上面*/
    private handDistanceX: number;
    private handDistanceY: number;

    /**初始位置，由于unity是左手坐标系，laya是右手坐标系，因此不可以直接在unity中观察坐标和角度，所以初始化的时候记录坐标和角度*/
    private firstLPx: number;
    private firstLPy: number;
    private firstLPz: number;

    /**初始角度*/
    private firstLRE: Laya.Vector3;

    /**手和肩膀的最长距离*/
    private longest: number = 0.375;
    /**手和手臂最短距离*/
    private shortest: number = 0.21;

    /**判断手的状态，true表示当前手是下垂状态*/
    private lopState: boolean;

    /**判断当前和扫把连接的是哪只手*/
    private handName: string;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.MeshSprite3D;
        this.selfScene = this.self.scene as Laya.Scene3D;
        this.Besom = this.selfScene.getChildByName('Besom') as Laya.MeshSprite3D;
        // 手心模型
        this.palm = this.self.getChildByName('palm') as Laya.MeshSprite3D;
        this.palmLPx = this.palm.transform.localPositionX;
        this.palmLPy = this.palm.transform.localPositionY;
        this.palmLPz = this.palm.transform.localPositionZ;

        this.firstLPx = this.self.transform.localPositionX;
        this.firstLPy = this.self.transform.localPositionY;
        this.firstLPz = this.self.transform.localPositionZ;

        let firstLREx = this.self.transform.localRotationEulerX;
        let firstLREy = this.self.transform.localRotationEulerY;
        let firstLREz = this.self.transform.localRotationEulerZ;
        this.firstLRE = new Laya.Vector3(firstLREx, firstLREy, firstLREz);

        this.lopState = true;

        this.self['UIMain_Hand'] = this;
    }

    /**手和手臂回到最初状态设置*/
    firstState(): void {
        //手的综合节点回到初始状态
        this.self.transform.localPositionX = this.firstLPx;
        this.self.transform.localPositionY = this.firstLPy;
        this.self.transform.localPositionZ = this.firstLPz;

        this.self.transform.localRotationEuler = this.firstLRE;

        // 手心回到初始下垂状态
        let e = this.palm.transform.localRotationEuler.clone();
        e.x = 0;
        e.y = 0;
        e.z = 0;
        this.palm.transform.localRotationEuler = e;
        this.palm.transform.localPositionX = this.palmLPx;
        this.palm.transform.localPositionY = this.palmLPy;
        this.palm.transform.localPositionZ = this.palmLPz;

        //角色的手回到初始状态
        this.selfScene['UIMain'].Person['UIMain_Person'].originalState();
        this.lopState = true;
    }

    /**
     * 碰撞时检测
     * 3D脚本必须继承Laya.Script3D,才可以触发碰撞
     * */
    onTriggerEnter(other) {
        // if (!this.BesomHandleLen) {
        //     this.BesomHandleLen = this.BesomHandLenCount();
        // }
        this.handName = this.self.name;
        this.bottomPosition();
        lwg.Global._connectState = true;
        lwg.Global._firstConnect = true;
        console.log(other);
    }
    /**计算扫把和手的向量长度*/
    BesomHandLenCount(): number {
        let BesomVec: Laya.Vector3 = this.Besom.transform.localPosition;
        let handVec: Laya.Vector3 = this.self.transform.localPosition;
        let p = new Laya.Vector3();
        // 向量相减后计算长度
        Laya.Vector3.subtract(BesomVec, handVec, p);
        let lenp = Laya.Vector3.scalarLength(p);
        return lenp;
    }

    /**扫把底座和手的距离计算*/
    BesomPedestalHandLenCount(): number {
        let BesomPedestal = this.Besom.getChildByName('pedestal') as Laya.MeshSprite3D;
        let BesomPedestalVec: Laya.Vector3 = BesomPedestal.transform.position;
        let handVec: Laya.Vector3 = this.self.transform.position;
        // 向量相减后计算长度
        let p = new Laya.Vector3();
        Laya.Vector3.subtract(BesomPedestalVec, handVec, p);
        let lenp = Laya.Vector3.scalarLength(p);
        return lenp;
    }

    /**
     * 当扫把和手接触时
     * 计算扫把底部相对于手心的x轴位置，移动扫把X轴位置，使扫把底端一直处于手心位置
     * */
    bottomPosition(): number {
        if (!this.BesomHandleLen) {
            return;
        }
        // 通过直角三角形公式，计算扫把底部到扫把中心点X轴距离
        // 斜边
        let l_01 = this.BesomHandleLen;
        // 竖着的直角边
        let l_02 = Math.abs(this.Besom.transform.localPositionY - this.self.transform.localPositionY);
        // 底下直角边
        let l_03;
        if (Math.pow(l_01, 2) - Math.pow(l_02, 2) < 0) {
            l_03 = 0;
        } else {
            l_03 = Math.sqrt(Math.pow(l_01, 2) - Math.pow(l_02, 2));
        }
        // 扫把底端的世界x轴坐标
        let BesomBottomX;
        if (this.Besom.transform.localRotationEulerX > 0) {
            BesomBottomX = this.Besom.transform.localPositionX + l_03;
        } else {
            BesomBottomX = this.Besom.transform.localPositionX - l_03;
        }
        // 扫把底端的世界x轴坐标相对于手的中心点偏移量，这个量在手和扫把刚接触的时候就固定了,也就是底部在手上的位置
        let offsetX = this.self.transform.localPositionX - BesomBottomX;
        this.Besom.transform.localPositionX += offsetX;

        return offsetX;
    }

    /**手臂指向手,手也指向手臂*/
    armLookAtHand(): void {
        // 当前手的位置
        let handVec = this.self.transform.position;

        //左胳膊指向左手
        let leftArm = this.selfScene['UIMain'].Person['UIMain_Person'].leftArm;
        if (this.self.name === 'leftHand') {
            leftArm.transform.lookAt(handVec, new Laya.Vector3(0, 1, 0));

            this.armDirection(leftArm);
            // 左手范围，需要世界坐标
            let armVec = leftArm.transform.position;
            this.palm.transform.lookAt(armVec, new Laya.Vector3(0, 1, 0));
            this.palmDirection();

            this.handDistance(armVec, handVec);
        }
        //右胳膊指向右手,右边需要反向
        let rightArm = this.selfScene['UIMain'].Person['UIMain_Person'].rightArm;
        if (this.self.name === 'rightHand') {
            rightArm.transform.lookAt(handVec, new Laya.Vector3(0, 1, 0));
            // 修正方向
            this.armDirection(rightArm);

            // 右手范围，左右手方向不一样，需要分开写，需要世界坐标
            let armVec = rightArm.transform.position;
            this.palm.transform.lookAt(armVec, new Laya.Vector3(0, 1, 0));
            this.palmDirection();

            this.handDistance(armVec, handVec);
        }
    }

    /**胳膊的方向修正,手的方向修正，手不会修正碰撞，只会修正模型*/
    armDirection(arm): void {
        let e = arm.transform.localRotationEuler.clone();
        let x = e.x;
        let y = e.y;
        let z = e.z;
        if (arm.name === 'rightArm') {
            e.x = x + 85;
            e.y = y + 19;
            e.z = z + 30;
        } else {
            e.x = x + 85;
            e.y = y - 15;
            e.z = z - 26;
        }
        arm.transform.localRotationEuler = e;
    }

    /**手心看向手臂的方向修正*/
    palmDirection(): void {
        let e = this.palm.transform.localRotationEuler.clone();
        let x = e.x;
        let y = e.y;
        let z = e.z;
        if (this.self.name === 'rightHand') {
            e.x = x + 90;
            e.y = y;
            e.z = z - 160;
        } else {
            e.x = x + 90;
            e.y = y;
            e.z = z + 168;
        }
        this.palm.transform.localRotationEuler = e;
    }

    /**
     * 最长距离限制
     * @param armVec 手臂的位置
     * @param handVec 手的位置
    */
    handDistance(armVec: Laya.Vector3, handVec: Laya.Vector3): void {
        // 两个向量相减等于手臂到手的向量
        let p = new Laya.Vector3();
        Laya.Vector3.subtract(handVec, armVec, p);
        // 向量的长度
        let lenP = Laya.Vector3.scalarLength(p);
        // 归一化向量
        let normalizP = new Laya.Vector3();
        Laya.Vector3.normalize(p, normalizP);

        // this.longset和this.shortest是最长长度和最短长度，是固定值
        if (lenP > this.longest) {
            // 最长范围
            let x = armVec.x + normalizP.x * this.longest;
            let y = armVec.y + normalizP.y * this.longest;
            let z = armVec.z + normalizP.z * this.longest;

            this.self.transform.position.x = x;
            this.self.transform.position.y = y;
            // Z轴是前后，不变
            // this.self.transform.position.z = z;
        }

        // 手臂分离
        // 增加向量长度，根据比例来计算
        // 需要分离的长度/可以分离的总长度 = 当前长度/总长度
        // 位置也需要修正
        let moveL;
        moveL = (lenP / this.longest) * (this.longest - this.shortest);
        if (this.self.name === 'rightHand') {
            let rightUnder = this.selfScene['UIMain'].Person['UIMain_Person'].rightUnder;
            let rightUnderArmY = this.selfScene['UIMain'].Person['UIMain_Person'].rightUnderArmY;
            let rightUnderArmX = this.selfScene['UIMain'].Person['UIMain_Person'].rightUnderArmX;

            rightUnder.transform.localPositionY = rightUnderArmY - moveL * 40;
            rightUnder.transform.localPositionX = rightUnderArmX - 1.5;
        } else {
            let leftUnder = this.selfScene['UIMain'].Person['UIMain_Person'].leftUnder;
            let leftUnderArmY = this.selfScene['UIMain'].Person['UIMain_Person'].leftUnderArmY;
            let leftUnderArmX = this.selfScene['UIMain'].Person['UIMain_Person'].leftUnderArmX;

            leftUnder.transform.localPositionY = leftUnderArmY - moveL * 40;
            leftUnder.transform.localPositionX = leftUnderArmX + 1.5;
        }
    }

    onUpdate() {
        if (!this.lopState) {
            this.armLookAtHand();
        }

        // 当手和扫把连接并且碰撞的手名字和当前手名字相同时,扫把处于up状态时也不会连接
        let diffX = this.self.transform.position.x - this.Besom.transform.position.x;
        let diffY = this.self.transform.position.y - this.Besom.transform.position.y;
        if (Math.abs(diffX) < 0.09 && Math.abs(diffY) < 0.01 && lwg.Global._besomRotate !== lwg.Enum.BesomMoveType.up) {
            // 如果扫把是静止状态，那么给予一个随机的方向，不让扫把静止
            if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.static) {
                let random = Math.floor(Math.random() * 2);
                random === 0 ? lwg.Global._besomRotate = lwg.Enum.BesomRotateType.left : lwg.Global._besomRotate = lwg.Enum.BesomRotateType.right;
                this.Besom['UIMain_Besom'].timeAdd = 0;
                this.Besom['UIMain_Besom'].rotateAcc = 0;
            }
            // 更改状态
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.connectStatic;
            lwg.Global._firstConnect = true;
            this.Besom['UIMain_Besom'].downAccelerated = 0;

            // 如果颠起任务完成了颠起高度，那么在此接住就会胜利！
            if (lwg.Global._taskPreTopYNum === 1) {
                lwg.Global._taskPreTopYNum = 2;
                console.log(lwg.Global._taskPreTopYNum);
            }
        }
    }


    onDisable(): void {

    }
}