import { lwg } from "../Lwg_Template/lwg";
import ADManager from "../../TJ/Admanager";

export default class UIVictory extends Laya.Script {
    // /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
    // public GoldPre: number = 1000;
    /**挂载当前脚本的节点*/
    private self: Laya.Scene;
    /**领取奖励按钮*/
    private BtnGet: Laya.Sprite;
    /**过关显示*/
    private AccordingLv: Laya.Sprite;
    /**当前拥有的金币数量*/
    private GoldRes: Laya.Sprite;
    /**获得金币*/
    private GetGold: Laya.Sprite;
    /**设置按钮*/
    private BtnSet: Laya.Image;
    /**选择领取模式按钮*/
    private BtnSelect: Laya.Sprite;
    /**两个按钮一起*/
    private SetBtn: Laya.Sprite;

    /**胜利logo*/
    private Logo: Laya.Sprite;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Scene
        this.BtnGet = this.self['BtnGet'];
        this.AccordingLv = this.self['AccordingLv'];
        this.GoldRes = this.self['GoldRes'];
        this.GetGold = this.self['GetGold'];
        this.BtnSet = this.self['BtnSet'];
        this.BtnSelect = this.self['BtnSelect'];
        this.Logo = this.self['Logo'];
        this.SetBtn = this.self['SetBtn'];

        this.getGoldDisplay();
        this.accordingLv();
        this.goldRes();
        console.log('当前关卡是：' + lwg.Global._gameLevel);

        // oppo评测需要关闭广告
        if (lwg.Global.pingceV) {
            let select = this.BtnSelect.getChildByName('select') as Laya.Sprite;
            select.visible = false;
            this.BtnSelect.visible = false;
        }

        this.adaptive();
        this.openAni();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.GetGold.y = Laya.stage.height * 0.273;
        this.Logo.y = Laya.stage.height * 0.192;
        this.AccordingLv.y = Laya.stage.height * 0.110;
        this.SetBtn.y = Laya.stage.height * 0.762;
        this.self['P202'].y = Laya.stage.height * 0.494;
    }

    /**开场动画*/
    openAni(): void {
        let delayed = 150;
        let time = 200;

        let y1 = this.self['background'].y;
        lwg.Animation.move_Deform_Y(this.self['background'], -300, -15, y1, -0.1, 0.2, time, delayed, f => {
        });

        let y2 = this.AccordingLv.y;
        lwg.Animation.move_Deform_Y(this.AccordingLv, -200, -15, y2, -0.15, 0.2, time, delayed * 2, f => { });

        let x1 = this.Logo.x;
        lwg.Animation.move_Deform_X(this.Logo, x1, -30, x1, -0.1, 0.2, time, delayed * 1, f => { });

        let x4 = this.GetGold.x;
        lwg.Animation.move_Deform_X(this.GetGold, x4, 30, x4, -0.1, 0.2, time, delayed * 2, f => { });

        let x2 = this.SetBtn.x;
        lwg.Animation.move_Deform_X(this.SetBtn, x2, 30, x2, -0.1, 0.2, time, delayed * 3, f => {

            lwg.Animation.swell_shrink(this.Logo, 1, 1.1, time / 2, delayed * 1, f => {
                this.btnClickOn();
            });
            lwg.Animation.swell_shrink(this.GetGold, 1, 1.1, time / 2, delayed * 2, f => {
            });
            lwg.Animation.swell_shrink(this.SetBtn, 1, 1.1, time / 2, delayed * 3, f => {
            });

        });

        let x5 = this.GoldRes.x;
        lwg.Animation.move_Deform_X(this.GoldRes, 920, -30, x5, -0.1, 0.2, time, delayed * 3, f => { });

        let x6 = this.BtnSet.x;
        lwg.Animation.move_Deform_X(this.BtnSet, -200, 0, x6, -0.1, 0.2, time, delayed * 3, f => { });

        // lwg.Animation.fadeOut(this.self['background'], 0, 1, time * 2, 0, null);

    }

    /**开场动画回调*/
    openAniFunc(): void {
        this.btnClickOn();
    }

    /**本关获得金币显示,此时并未获得*/
    getGoldDisplay(): void {
        let getLebel = this.GetGold.getChildByName('Num') as Laya.Label;

        let level = lwg.Global._gameLevel;
        if (lwg.Global._taskGoldBoo) {
            getLebel.text = lwg.Global._taskGoldNum.toString();
            console.log('金币关卡，共吃到金币为：' + getLebel.text);
        } else {
            getLebel.text = (25).toString();
            console.log('普通关卡奖励金币为：' + getLebel.text);
        }
    }

    /**当前拥有金币数量显示，并没有加上获得的金币*/
    goldRes(): void {
        let goldLebel = this.GoldRes.getChildByName('Num') as Laya.Label;
        goldLebel.text = (lwg.Global._goldNum).toString();
    }

    /**关卡显示*/
    accordingLv(): void {
        let currentLv = this.AccordingLv.getChildByName('CurrentLv') as Laya.Label;
        currentLv.text = lwg.Global._gameLevel.toString();
        lwg.Global._gameLevel++;
        let nextLv = this.AccordingLv.getChildByName('NextLv') as Laya.Label;
        nextLv.text = lwg.Global._gameLevel.toString();
    }

    /**获取按钮点击事件*/
    btnClickOn(): void {
        lwg.Click.on('largen', null, this.self['BtnAdv'], this, null, null, this.btnAdvUp, null);
        lwg.Click.on('noEffect', null, this.self['BtnNo'], this, this.btnNoUp, null, null, null);
        lwg.Click.on('largen', null, this.BtnSet, this, null, null, this.btnSetUP, null);
    }

    btnNoUp(event): void {
        event.currentTarget.scale(1, 1);
        let getLebel = this.GetGold.getChildByName('Num') as Laya.Label;
        lwg.Global._goldNum += Number(getLebel.text);
        this.openPifuXianding();
        this.self.close();
        lwg.LocalStorage.addData();
    }

    btnAdvUp(event): void {
        event.currentTarget.scale(1, 1);
        ADManager.ShowReward(() => {
            this.advFunc();
        })
    }

    /**看完广告后的回调,10倍领取*/
    advFunc(): void {
        let getLebel = this.GetGold.getChildByName('Num') as Laya.Label;
        lwg.Global._goldNum += Number(getLebel.text) * 10;
        lwg.Global.UIMain['UIMain'].currentPifuSet();//更换皮肤
        lwg.LocalStorage.addData();
        if (lwg.Global.pingceV) {
            return;
        }
        this.openPifuXianding();
    }

    /**判断是否弹出限定皮肤界面*/
    openPifuXianding(): void {
        // 注意换装,以防是试用皮肤
        if ((lwg.Global._gameLevel - 1) % lwg.Global._checkpointInterval === 1 && lwg.Global._watchAdsNum < 3) {
            lwg.Global._openInterface('UIXDpifu', null, null);
        } else {
            lwg.Global._openInterface('UIStart', this.self, f => { });
        }
    }

    /**设置按钮抬起*/
    btnSetUP(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._openInterface('UISet', null, null);
    }

    onDisable(): void {

    }
}