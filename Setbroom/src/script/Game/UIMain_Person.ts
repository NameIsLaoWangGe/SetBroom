export default class UIMain_Person extends Laya.Script3D {
    constructor() { super(); }
    private self: Laya.MeshSprite3D;
    private selfScene: Laya.Scene3D;
    private head: Laya.MeshSprite3D;
    private rightArm: Laya.MeshSprite3D;
    private rightUnder: Laya.MeshSprite3D;
    private leftArm: Laya.MeshSprite3D;
    private leftUnder: Laya.MeshSprite3D;
    private besom: Laya.MeshSprite3D;
    /**记录下臂的位置，通过初始位置进行手臂分离*/
    private rightUnderArmX: number;
    private rightUnderArmY: number;
    private rightUnderArmZ: number;

    private leftUnderArmX: number;
    private leftUnderArmY: number;
    private leftUnderArmZ: number;

    onEnable(): void {
        this.self = this.owner as Laya.MeshSprite3D;
        this.selfScene = this.self.scene as Laya.Scene3D;

        this.head = this.self.getChildByName('head') as Laya.MeshSprite3D;

        this.rightArm = this.self.getChildByName('rightArm') as Laya.MeshSprite3D;
        this.rightUnder = this.rightArm.getChildByName('rightUnder') as Laya.MeshSprite3D;

        this.leftArm = this.self.getChildByName('leftArm') as Laya.MeshSprite3D;
        this.leftUnder = this.leftArm.getChildByName('leftUnder') as Laya.MeshSprite3D;

        this.leftUnderArmX = this.leftUnder.transform.localPositionX;
        this.leftUnderArmY = this.leftUnder.transform.localPositionY;
        this.leftUnderArmZ = this.leftUnder.transform.localPositionZ;

        this.rightUnderArmX = this.rightUnder.transform.localPositionX;
        this.rightUnderArmY = this.rightUnder.transform.localPositionY;
        this.rightUnderArmZ = this.rightUnder.transform.localPositionZ;
        this.self['UIMain_Person'] = this;
    }

    /**手臂回到初始状态*/
    originalState(): void {
        //手臂回到初始下垂状态
        let leftArm = this.leftArm as Laya.MeshSprite3D;
        leftArm.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        let rightArm = this.rightArm as Laya.MeshSprite3D;
        rightArm.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);

        // 小臂回到初始状态
        this.leftUnder.transform.localPositionX = this.leftUnderArmX;
        this.leftUnder.transform.localPositionY = this.leftUnderArmY;
        this.leftUnder.transform.localPositionZ = this.leftUnderArmZ;

        this.rightUnder.transform.localPositionX = this.rightUnderArmX;
        this.rightUnder.transform.localPositionY = this.rightUnderArmY;
        this.rightUnder.transform.localPositionZ = this.rightUnderArmZ;
    }

    /**角色头部随着扫把的位置而旋转，始终看着扫把*/
    personLookAtBesom(): void {
        this.besom = this.selfScene['UIMain'].Besom;
        let selfVec = this.besom.transform.localPosition;
        this.head.transform.lookAt(selfVec, new Laya.Vector3(0, 1, 0));
        // 修正方向,除以2旋转的角度少一些
        let e = this.head.transform.localRotationEuler.clone();
        e.x = e.x / 2;
        e.y = e.y / 2;
        e.z = e.z / 2;
        this.head.transform.localRotationEuler = e;
    }

    onUpdate(): void {
        this.personLookAtBesom();
    }

    onDisable(): void {
    }
}