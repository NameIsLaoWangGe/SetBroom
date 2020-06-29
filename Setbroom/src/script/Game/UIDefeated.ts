import { lwg } from "../Lwg_Template/lwg";
import ADManager from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";
export default class UIDefeated extends Laya.Script {
    /**指代挂载当前脚本的节点*/
    private self: Laya.Scene;
    /**重来来按钮*/
    private BtnAgain: Laya.Image;
    /**下一关按钮*/
    private BtnLast: Laya.Image;
    /**金币资源数量*/
    private GoldRes: Laya.Sprite;
    /**领取奖励按钮*/
    private BtnSet: Laya.Image;
    constructor() { super(); }

    onEnable(): void {
        RecordManager.stopAutoRecord();

        this.self = this.owner as Laya.Scene;
        this.BtnAgain = this.self['BtnAgain'];
        this.BtnLast = this.self['BtnLast'];
        this.GoldRes = this.self['GoldRes'];
        this.BtnSet = this.self['BtnSet'];
        this.goldRes();
        lwg.Global.vibratingScreen();

        this.adaptive();
        this.openAni();

        this.BtnAgain.visible = false;
        setTimeout(() => {
            this.BtnAgain.visible = true;
        }, lwg.Global._btnDelayed); 

        if (lwg.Global._shakeSwitch) {
            ADManager.Vibratelong();
        }
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.BtnLast.y = Laya.stage.height * 0.754;
        this.self['BtnShare'].y = Laya.stage.height * 0.754;
        this.BtnAgain.y = this.BtnLast.y - 103;

        this.self['Logo'].y = Laya.stage.height * 0.1718;

        this.self['P202'].y = Laya.stage.height * 0.4328;

    }

    /**开场动画*/
    openAni(): void {
        let delayed = 150;
        let time = 200;

        let x1 = this.self['Logo'].x;
        lwg.Animation.move_Deform_X(this.self['Logo'], x1, 30, x1, -0.1, 0.2, time, delayed * 1, f => { });

        let x2 = this.BtnAgain.x;
        lwg.Animation.move_Deform_X(this.BtnAgain, x2, 0, x2, -0.1, 0.2, time, delayed * 2, f => { });

        let x3 = this.BtnLast.x;
        lwg.Animation.move_Deform_X(this.BtnLast, x3, 0, x3, -0.1, 0.2, time, delayed * 3, f => { });

        let x5 = this.GoldRes.x;
        lwg.Animation.move_Deform_X(this.GoldRes, 920, -30, x5, -0.1, 0.2, time, delayed * 3, f => { });

        let x6 = this.BtnSet.x;
        lwg.Animation.move_Deform_X(this.BtnSet, -200, 0, x6, -0.1, 0.2, time, delayed * 3, f => {
            lwg.Animation.swell_shrink(this.self['Logo'], 1, 1.1, time / 2, delayed * 1, f => {
                this.btnOnClick();
            });
        });

        let y1 = this.self['background'].y;
        lwg.Animation.move_Deform_Y(this.self['background'], -300, -15, y1, -0.1, 0.2, time, delayed, f => {
        });
    }

    /**当前拥有金币数量显示，并没有加上获得的金币*/
    goldRes(): void {
        let goldLebel = this.GoldRes.getChildByName('Num') as Laya.Label;
        goldLebel.text = (lwg.Global._goldNum).toString();
    }

    /**按钮事件注册*/
    btnOnClick(): void {
        lwg.Click.on('largen', null, this.BtnAgain, this, null, null, this.BtnAgainUp, null);
        lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.BtnLastUp, null);
        lwg.Click.on('largen', null, this.BtnSet, this, null, null, this.btnSetUP, null);
        lwg.Click.on('largen', null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
    }
    // 分享
    btnShareUp(event): void {
        event.currentTarget.scale(1, 1);

        RecordManager._share('noAward', () => {
            this.btnShareUpFunc();
        })
    }
    btnShareUpFunc(): void {
        console.log('分享成功，只是没有奖励！');
    }

    /**再来一次的按钮抬起事件*/
    BtnAgainUp(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
        lwg.Global._gameStart = true;
        lwg.Global._levelInformation();
    }

    /**下一关按钮抬起事件*/
    BtnLastUp(event): void {
        event.currentTarget.scale(1, 1);
        ADManager.ShowReward(() => {
            this.advFunc();
        })
    }

    advFunc(): void {
        lwg.Global._openInterface('UIStart', this.self, f => {
            lwg.Global._gameLevel++;
            // 注意换装,以防是试用皮肤
            lwg.Global.UIMain['UIMain'].currentPifuSet();//更换成超人皮肤
        });
    }

    /**设置按钮抬起*/
    btnSetUP(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._openInterface('UISet', null, null);
    }

    onDisable(): void {
    }
}