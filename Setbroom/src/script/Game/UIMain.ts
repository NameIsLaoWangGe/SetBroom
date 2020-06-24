import UIMain_Person from './UIMain_Person';
import UIMain_Besom from './UIMain_Besom';
import UIMain_Hand from './UIMain_Hand';
import UIMain_Gold from './UIMain_Gold';
import { lwg } from '../Lwg_Template/lwg';
export default class UIMain extends Laya.Script3D {
    /**当前场景*/
    private GameScene: Laya.Scene3D;
    /**摄像机*/
    private Camera: Laya.Camera;
    /**射线*/
    private _ray: Laya.Ray;
    /**射线扫描结果*/
    private outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();
    /**灯光*/
    private light: Laya.LightSprite;
    /**地面*/
    private ground: Laya.MeshSprite3D;
    /**角色父节点和所有角色集合*/
    private PersonParent: Laya.MeshSprite3D;
    private Person_xiaofu: Laya.MeshSprite3D;;
    private Person_konglong: Laya.MeshSprite3D;;
    private Person_xueren: Laya.MeshSprite3D;;
    private Person_qipao: Laya.MeshSprite3D;;
    private Person_qianxun: Laya.MeshSprite3D;;
    private Person_lvyifu: Laya.MeshSprite3D;;
    private Person_maozi: Laya.MeshSprite3D;;
    private Person_lufei: Laya.MeshSprite3D;;
    private Person_chaoren: Laya.MeshSprite3D;
    /**当前角色*/
    private Person: Laya.MeshSprite3D;

    /**角色的头部*/
    private head: Laya.MeshSprite3D;
    /**右手*/
    private rightHand: Laya.MeshSprite3D;
    /**左手*/
    private leftHand: Laya.MeshSprite3D;
    /**当前选中的手*/
    private targetHand: Laya.MeshSprite3D;

    /**扫把*/
    private Besom: Laya.MeshSprite3D;
    private BesomRig: Laya.Rigidbody3D;

    /**金币父节点*/
    private GoldParent: Laya.MeshSprite3D;
    /**金币样式*/
    private goldTem: Laya.MeshSprite3D;

    constructor() { super(); }

    onEnable(): void {
        this.GameScene = this.owner as Laya.Scene3D;
        this.GameScene['UIMain'] = this;
        this.Camera = this.GameScene.getChildAt(0) as Laya.Camera;

        this.PersonParent = this.GameScene.getChildByName('PersonParent') as Laya.MeshSprite3D;
        this.Person_xiaofu = this.PersonParent.getChildByName('01_xiaofu') as Laya.MeshSprite3D;
        this.Person_konglong = this.PersonParent.getChildByName('02_konglong') as Laya.MeshSprite3D;
        this.Person_xueren = this.PersonParent.getChildByName('03_xueren') as Laya.MeshSprite3D;
        this.Person_qipao = this.PersonParent.getChildByName('04_qipao') as Laya.MeshSprite3D;
        this.Person_qianxun = this.PersonParent.getChildByName('05_qianxun') as Laya.MeshSprite3D;
        this.Person_lvyifu = this.PersonParent.getChildByName('06_lvyifu') as Laya.MeshSprite3D;
        this.Person_maozi = this.PersonParent.getChildByName('07_maozi') as Laya.MeshSprite3D;
        this.Person_lufei = this.PersonParent.getChildByName('08_lufei') as Laya.MeshSprite3D;
        this.Person_chaoren = this.PersonParent.getChildByName('09_chaoren') as Laya.MeshSprite3D;
        this.currentPifuSet();

        this.Besom = this.GameScene.getChildByName('Besom') as Laya.MeshSprite3D;
        this.Besom.addComponent(UIMain_Besom);
        this.BesomRig = this.Besom.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        lwg.Global._besomMove = lwg.Enum.BesomMoveType.static;

        this.GoldParent = this.GameScene.getChildByName('GoldParent') as Laya.MeshSprite3D;
        this.goldTem = this.GoldParent.getChildByName('goldTem') as Laya.MeshSprite3D;
        this.goldTem.removeSelf();

        //射线初始化（必须初始化）
        this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));

        this.addMouseEvent();
        this.targetHand = null;
        // // 关闭多点触控
        // Laya.MouseManager.multiTouchEnabled = false;
    }

    /**当前皮肤设置*/
    currentPifuSet(): void {
        //角色父节点移除角色
        this.PersonParent.removeChildren(0, this.PersonParent.numChildren - 1);
        console.log(lwg.Global._currentPifu);
        // 必须使用克隆添加，这样是新的节点，游戏内唯一，否则可能很多其他节点会锁定到多个person
        switch (lwg.Global._currentPifu) {
            case '01_xiaofu':
                this.PersonParent.addChild(this.Person_xiaofu.clone());
                break;
            case '02_konglong':
                this.PersonParent.addChild(this.Person_konglong.clone());
                break;
            case '03_xueren':
                this.PersonParent.addChild(this.Person_xueren.clone());
                break;
            case '04_qipao':
                this.PersonParent.addChild(this.Person_qipao.clone());
                break;
            case '05_qianxun':
                this.PersonParent.addChild(this.Person_qianxun.clone());
                break;
            case '06_lvyifu':
                this.PersonParent.addChild(this.Person_lvyifu.clone());
                break;
            case '07_maozi':
                this.PersonParent.addChild(this.Person_maozi.clone());
                break;
            case '08_lufei':
                this.PersonParent.addChild(this.Person_lufei.clone());
                break;
            case '09_chaoren':
                this.PersonParent.addChild(this.Person_chaoren.clone());
                break;
            default:
                break;
        }
        console.log(this.PersonParent.getChildAt(0));
        //如果没有脚本则添加脚本
        this.Person = this.PersonParent.getChildAt(0) as Laya.MeshSprite3D;
        let scriptPerson = this.Person.getComponent(UIMain_Person);
        if (!scriptPerson) {
            this.Person.addComponent(UIMain_Person);
        }
        // 左右手
        this.rightHand = this.Person.getChildByName('rightHand') as Laya.MeshSprite3D;
        let scriptRightHand = this.rightHand.getComponent(UIMain_Hand);
        if (!scriptRightHand) {
            this.rightHand.addComponent(UIMain_Hand);
        }
        this.leftHand = this.Person.getChildByName('leftHand') as Laya.MeshSprite3D;
        let scriptLeftHand = this.leftHand.getComponent(UIMain_Hand);
        if (!scriptLeftHand) {
            this.leftHand.addComponent(UIMain_Hand);
        }
    }

    /**鼠标事件监听*/
    private addMouseEvent(): void {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
    }

    /**移动开关*/
    private moveSwitch: boolean = false;
    /**点击位置X记录*/
    private firstX;
    /**点击位置Y记录*/
    private firstY;
    /**按下*/
    onMouseDown(): void {
        if (!lwg.Global._gameStart) {
            return;
        }
        lwg.Global._timeLineSwitch = true;
        if (lwg.Global._clickScreenNum === 0) {
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
        }
        lwg.Global._clickScreenNum++;
        // 初始位置
        this.firstX = Laya.MouseManager.instance.mouseX
        this.firstY = Laya.MouseManager.instance.mouseY - 100;//手始终保持在高于触摸点位置，这样可以看到手

        //产生射线
        //射线碰撞到挡屏，用来设置手的初始位置，挡屏的属性isTrigger 要勾上，这样只检测碰撞，不产生碰撞反应
        this.Camera.viewportPointToRay(new Laya.Vector2(this.firstX, this.firstY), this._ray);
        this.GameScene.physicsSimulation.rayCastAll(this._ray, this.outs);

        //找到挡屏的位置，把手的位置放在投屏位置的上方，也就是触摸点的上方
        if (this.outs.length != 0) {
            for (var i = 0; i < this.outs.length; i++) {
                //找到挡屏
                let hitResult = this.outs[i].collider.owner;
                if (hitResult.name === 'screen') {
                    // 开启移动
                    this.moveSwitch = true;
                    //看自己点击的是屏幕的那边，如果是左边则操作左手，是右边则操作右手，不需要碰到手
                    let stageWidth = Laya.stage.width;
                    if (this.firstX > stageWidth / 2) {
                        this.targetHand = this.rightHand;
                        //另一只手回到初始位置
                        this.leftHand['UIMain_Hand'].firstState();
                    } else {
                        this.targetHand = this.leftHand;
                        //另一只手回到初始位置
                        this.rightHand['UIMain_Hand'].firstState();
                    }
                    // 修正手的位置和角度
                    this.targetHand.transform.position = this.outs[i].point;
                    this.targetHand['UIMain_Hand'].armLookAtHand();
                    this.targetHand['UIMain_Hand'].lopState = false;
                }
            }
        }
    }

    /**
     * 滑动屏幕
     */
    onMouseMove(): void {
        if (!this.moveSwitch) {
            return;
        }
        let x = Laya.MouseManager.instance.mouseX;
        let y = Laya.MouseManager.instance.mouseY - 100;//手始终保持在高于触摸点位置，这样可以看到手
        let differenceX;
        let differenceY;
        if (this.firstX && this.firstY) {
            differenceX = this.firstX - x;
            differenceY = this.firstY - y;
        } else {
            this.firstX = Laya.MouseManager.instance.mouseX;
            this.firstY = Laya.MouseManager.instance.mouseY - 100;//手始终保持在高于触摸点位置，这样可以看到手
            return;
        }
        let moveX = differenceX / 900;
        let moveY = differenceY / 900;
        this.firstX = x;
        this.firstY = y;
        //平移
        let handPosition = new Laya.Vector3(moveX, moveY, 0);
        this.targetHand.transform.translate(handPosition, false);
        // 向下移动过快则断开
        if (moveY < -0.03 && lwg.Global._besomMove === lwg.Enum.BesomMoveType.connectStatic) {
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
            this.Besom['UIMain_Besom'].downAccelerated = 0;
        }

        // 向上移动过快则颠起
        if (moveY > 0.03 && lwg.Global._besomMove === lwg.Enum.BesomMoveType.connectStatic) {
            console.log('颠起！');
            this.Besom.transform.position.y += 5;
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.up;

            // 随着力度增加速度，但是有最高值
            let increment;
            increment = (moveY - 0.03);
            if (increment > 0.021) {
                increment = 0.021;
            }
            this.Besom['UIMain_Besom'].upAccelerated = 0.07 + increment;
            // console.log(this.Besom['UIMain_Besom'].upAccelerated);
        }

        // 非悬空状态和悬空状态的旋转不相同
        if (lwg.Global._besomMove === lwg.Enum.BesomMoveType.up || lwg.Global._besomMove === lwg.Enum.BesomMoveType.down) {
            lwg.Global._besomRotate = lwg.Enum.BesomRotateType.inSky;
        } else {
            // 向右移动
            if (moveX > 0.005) {
                lwg.Global._besomRotate = lwg.Enum.BesomRotateType.left;
                this.Besom['UIMain_Besom'].timeAdd = 0;
                this.Besom['UIMain_Besom'].rotateAcc_01 = 0.4 + moveX * 30;
                this.Besom['UIMain_Besom'].rotateAcc_02 = 0;
            }
            // 向左移动
            if (moveX < -0.005) {
                lwg.Global._besomRotate = lwg.Enum.BesomRotateType.right;
                this.Besom['UIMain_Besom'].timeAdd = 0;
                this.Besom['UIMain_Besom'].rotateAcc_01 = -0.4 + moveX * 30;
                this.Besom['UIMain_Besom'].rotateAcc_02 = 0;
            }

            if (moveX === 0) {
                lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
                let rotate = this.Besom.transform.localRotationEulerZ;
                if (rotate > 0) {
                    this.Besom['UIMain_Besom'].rotateAcc_02 = -0.8;
                } else if (rotate <= 0) {
                    this.Besom['UIMain_Besom'].rotateAcc_02 = 0.8;
                }

                this.Besom['UIMain_Besom'].rotateAcc_02 = 0;
            }
        }
    }

	/**
	 * 抬起
	 */
    onMouseUp(): void {
        this.moveSwitch = false;
        lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
        this.Besom['UIMain_Besom'].rotateAcc = 0.1;
    }
	/**
	 * 出屏幕
	 */
    onMouseOut(): void {
        this.moveSwitch = false;
        lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
        this.Besom['UIMain_Besom'].rotateAcc = 0.1;
    }

    /**检测当前任务并且判断是否成功，因为失败或只有两种方式，一种是落地，一种是角度大于60度*/
    taskcheck(): void {
        // 每个任务所需的判断
        let type = lwg.Global._taskPreType;
        switch (type) {
            case lwg.Enum.TaskType.continue:
                // 坚持时间结束则成功
                if (lwg.Global._gameTimeLine % 60 == 0) {
                    lwg.Global._taskPreTime = Number(lwg.Global._taskPreTime.substring(0, lwg.Global._taskPreTime.length - 1)) - 1 + 's';
                    if (lwg.Global._taskPreTime === '0s') {
                        //任务完成，切换任务
                        console.log('坚持时间任务完成!');
                        this.taskSwitch();
                    }
                }
                break;

            case lwg.Enum.TaskType.topUp:
                // 颠起高度大于设置高度则成功,需要进行世界坐标position的对比
                let pedestalP = (this.Besom.getChildAt(2) as Laya.MeshSprite3D).transform.position;
                let pedestalPY = lwg.Tools.transitionScreenPointfor3D(pedestalP, this.Camera).y;
                if (pedestalPY < lwg.Global._taskPreTopY) {
                    lwg.Global._taskPreTopYNum = 1;
                    console.log('颠起高度达到了！，接到才算胜利');
                }
                if (lwg.Global._taskPreTopYNum === 2) {
                    //任务完成，切换任务
                    console.log('颠起任务完成！');
                    this.taskSwitch();
                }
                break;

            case lwg.Enum.TaskType.move:
                // 扫把头移动到相应位置则成功,需要进行世界坐标position的对比
                let BesomHeadP = (this.Besom.getChildAt(0) as Laya.MeshSprite3D).transform.position;
                let BesomHeadScreenP = lwg.Tools.transitionScreenPointfor3D(BesomHeadP, this.Camera);
                let difX = BesomHeadScreenP.x - lwg.Global._taskPrePoint.x;
                let difY = BesomHeadScreenP.y - lwg.Global._taskPrePoint.y;

                // 获取任务节点的倒计时圆圈
                let CountDown = lwg.Global.UITask['UITask'].CountDown as Laya.Sprite;
                let drawPie = lwg.Global.UITask['UITask'].drawPie as Laya.DrawPieCmd;
                if (Math.abs(difX) < 80 && Math.abs(difY) < 80) {
                    if (drawPie) {
                        if (drawPie.endAngle <= 0) {
                            this.taskSwitch();
                            CountDown.removeSelf();
                            //任务完成，切换任务
                            console.log('移动任务完成！');
                        } else {
                            // 修改扇形的父节点模式，才可以进行角度调整
                            CountDown.cacheAs = "none";
                            drawPie.endAngle -= 4;
                            // 修改过角度后，再改回模式才可以遮罩
                            CountDown.cacheAs = "bitmap";
                            // 防止这次减小过大，多出一点
                            if (drawPie.endAngle < 0) {
                                drawPie.endAngle = 0;
                            }
                        }
                    }
                } else {
                    // 修改扇形的父节点模式，才可以进行角度调整
                    CountDown.cacheAs = "none";
                    drawPie.endAngle = 360;
                    // 修改过角度后，再改回模式才可以遮罩
                    CountDown.cacheAs = "bitmap";
                }
                break;

            case lwg.Enum.TaskType.gold:
                // 坚持时间结束则成功
                if (lwg.Global._gameTimeLine % 60 === 0) {
                    lwg.Global._taskPreTime = Number(lwg.Global._taskPreTime.substring(0, lwg.Global._taskPreTime.length - 1)) - 1 + 's';
                    // 金币关卡胜利的方式有两种，一种是时间到了，一种是金币吃完了
                    if (lwg.Global._taskPreTime === '0s' || this.GoldParent['_children'].length === 0) {
                        //任务完成，切换任务
                        console.log('吃金币任务完成！');
                        this.taskSwitch();
                    }
                }
                break;
            default:
                break;
        }
    }

    /**
     * 任务切换
     * 当前任务的排序数字如果大于总任务，那么说明本关胜利了
     * 如果当前的任务排序数字小于总任务或者等于总任务，说明还有1个以上的任务没有完成，那么继续完成
    */
    taskSwitch(): void {
        //任务顺序+1
        lwg.Global._taskPreNum += 1;
        let sum = lwg.Global._taskContentArray.length;
        let num = lwg.Global._taskPreNum;
        if (num > sum) {
            // 如果是金币关卡则要消除父节点的金币
            let level = lwg.Global._gameLevel;
            if (lwg.Global._taskGoldBoo) {
                this.GoldParent.removeChildren(0, this.GoldParent['_children'].length - 1);
            }
            this.defeatedDecide();
            lwg.Global._openInterface('UIVictory', null, null);
        } else {
            lwg.Global.UITask['UITask'].sontentSet();
        }
    }

    /**游戏结束的参数设置*/
    defeatedDecide(): void {
        this.moveSwitch = false;
        this.targetHand = null;//手不被选中
        lwg.Global._gameStart = false;
        lwg.Global._timeLineSwitch = false;
        lwg.Global._gameTimeLine = 0;
        lwg.Global._firstConnect = false;
    }

    onUpdate(): void {
        if (!lwg.Global._gameStart && !lwg.Global._timeLineSwitch) {
            return;
        }
        // 第一帧的时候重制任务
        if (lwg.Global._gameTimeLine === 0) {
            lwg.Global._clickScreenNum = 0;
            lwg.Global._firstConnect = false;
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.static;
            lwg.Global._besomRotate = lwg.Enum.BesomRotateType.static;
            lwg.Global._openInterface('UITask', null, null);
            this.Besom['UIMain_Besom'].initProperty();
        }

        lwg.Global._gameTimeLine++;

        // 首次连接后，开始各种任务
        if (lwg.Global._firstConnect) {
            this.taskcheck();
        }

        // 失败的判断，目前两种失败判定，一种是倾斜到一定角度，一种是掉下了
        // 如果是金币关卡则不会失败，而是重置扫把的属性，让扫把重新回到头上
        let absZ = Math.abs(this.Besom.transform.localRotationEulerZ);
        let posY = this.Besom.transform.localPositionY;
        if (posY < -3.8 || absZ > 80) {
            if (lwg.Global._taskGoldBoo) {
                this.Besom['UIMain_Besom'].initProperty();
                // console.log('这是金币关卡，不会失败，所以重置扫把属性！');
            } else {
                this.defeatedDecide();
                lwg.Global._openInterface('UIDefeated', null, null);
            }
        }
    }

    onDisable(): void {

    }

}