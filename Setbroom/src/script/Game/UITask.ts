import { lwg } from "../Lwg_Template/lwg";
import UIMain_Gold from './UIMain_Gold';

export default class UITask extends Laya.Script {
    /**指代挂载当前脚本的节点*/
    private self: Laya.Scene;

    /**任务倒计时时间，用在坚持时间任务*/
    private TaskTime: Laya.Label;

    /**内容总节点*/
    private Describe: Laya.Sprite;
    /**任务数量节点*/
    private TaskNum: Laya.Label;
    /**任务描述*/
    private TaskContent: Laya.Label;

    /**任务颠起高度线，用在颠起任务*/
    private TaskLine: Laya.Image;

    /**任务位置圆圈，用在移动到规定距离*/
    private TaskCircle: Laya.Sprite;
    /**圆圈内倒计时圆圈*/
    private CountDown: Laya.Sprite;

    constructor() { super(); }

    onEnable(): void {

        this.self = this.owner as Laya.Scene;

        this.TaskTime = this.self['TaskTime'];

        this.Describe = this.self['Describe'];
        this.TaskNum = this.self['TaskNum'];
        this.TaskContent = this.self['TaskContent'];

        this.TaskLine = this.self['TaskLine'];

        this.TaskCircle = this.self['TaskCircle'];

        this.self['UITask'] = this;

        this.self = this.owner as Laya.Scene;
        this.sontentSet();
    }

    /**当前关卡的显示*/
    sontentSet(): void {
        console.log('重来');
        let num = lwg.Global._taskPreNum;
        if (num > lwg.Global._taskContentArray.length) {
            return;
        }
        let task: object = lwg.Global._taskContentArray[num - 1];
        // 不同关卡显示的内容不同
        switch (task['type']) {
            case lwg.Enum.TaskType.continue:
                this.TaskLine.visible = false;
                this.TaskCircle.visible = false;

                this.TaskTime.visible = true;
                this.TaskTime.text = task['time'] + 's';
                lwg.Global._taskPreTime = task['time'] + 's';

                lwg.Global._taskGoldBoo = false;

                break;
            case lwg.Enum.TaskType.topUp:
                this.TaskLine.visible = true;
                lwg.Global._taskPreTopY = this.TaskLine.y;
                lwg.Global._taskPreTopYNum = 0;

                this.TaskCircle.visible = false;
                this.TaskTime.visible = false;
                lwg.Global._taskGoldBoo = false;

                break;
            case lwg.Enum.TaskType.move:
                this.TaskLine.visible = false;
                this.TaskCircle.visible = true;

                // 圆圈是随机一个位置，每次不一样
                let randomX = this.TaskCircle.width / 2 + (Laya.stage.width - this.TaskCircle.width) * Math.random();
                this.TaskCircle.x = randomX;
                lwg.Global._taskPrePoint.x = this.TaskCircle.x;
                // y轴位置在向上100范围内
                let randomY = 50 * Math.random();
                this.TaskCircle.y -= randomY;
                lwg.Global._taskPrePoint.y = this.TaskCircle.y + this.self.y;
                this.createCountDown();

                console.log('移动任务来一次', this.drawPie);
                this.TaskTime.visible = false;
                lwg.Global._taskGoldBoo = false;

                break;
            case lwg.Enum.TaskType.gold:
                this.TaskLine.visible = false;
                this.TaskCircle.visible = false;

                this.TaskTime.visible = true;
                this.TaskTime.text = task['time'] + 's';
                lwg.Global._taskPreTime = task['time'] + 's';
                lwg.Global._taskGoldBoo = true;
                this.goldLevelSet();
                break;
            default:
                break;
        }

        this.TaskContent.text = task['dec'];
        let tasklen = lwg.Global._taskContentArray.length;
        this.TaskNum.text = '[' + (num) + '/' + tasklen + ']';
        lwg.Global._taskPreType = task['type'];
        console.log('新的任务是:' + lwg.Global._taskPreType);

        this.taskPromptStyle();
    }

    /**任务提示底板样式根据字的数量增多而拉长*/
    taskPromptStyle(): void {
        let len = this.TaskContent.text.length;
        if (len > 10) {
            let baseboard = this.Describe.getChildByName('baseboard') as Laya.Image;
            baseboard.width = 435;
            this.Describe.x = 142;
        } else {
            let baseboard = this.Describe.getChildByName('baseboard') as Laya.Image;
            baseboard.width = 360;
            this.Describe.x = 179;
        }
    }
    /**时间倒计时的扇形遮罩*/
    private drawPie: Laya.DrawPieCmd;
    /**创建倒计时*/
    createCountDown(): void {
        this.CountDown = new Laya.Sprite();
        this.CountDown.loadImage('youxi/ui_comp.png');
        this.TaskCircle.addChild(this.CountDown);
        this.CountDown.width = 154;
        this.CountDown.height = 154;
        this.CountDown.pivotX = 77;
        this.CountDown.pivotY = 77;
        this.CountDown.x = 77;
        this.CountDown.y = 77;
        this.drawPie = lwg.Tools.drawPieMask(this.CountDown, 0, 360);
    }

    /**金币关卡的设置,当关卡为金币关卡时创建40个金币*/
    goldLevelSet(): void {
        let goldTem = lwg.Global.UIMain['UIMain'].goldTem as Laya.MeshSprite3D;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 10; j++) {
                let gold = goldTem.clone() as Laya.MeshSprite3D;
                let GoldParent = lwg.Global.UIMain['UIMain'].GoldParent as Laya.MeshSprite3D;
                GoldParent.addChild(gold);
                gold.transform.localPositionX = goldTem.transform.localPositionX - j * 0.063;
                gold.transform.localPositionY = goldTem.transform.localPositionY - i * 0.063;
                gold.addComponent(UIMain_Gold);
                let goldColl = gold.getComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
                goldColl.isTrigger = true;
            }
        }
        lwg.Global._taskGoldNum = 0;
    }

    onUpdate(): void {
        this.TaskTime.text = lwg.Global._taskPreTime;
        if (!lwg.Global._gameStart) {
            this.self.close();
        }
    }
}