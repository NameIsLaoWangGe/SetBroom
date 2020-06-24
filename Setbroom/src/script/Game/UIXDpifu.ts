import { lwg } from "../Lwg_Template/lwg";
import UIStart from "./UIStart";
import ADManager from "../../TJ/Admanager";

export default class UIXDpifu extends Laya.Script {
    /**指代当前挂载脚本的节点*/
    private self;
    /**内容*/
    private SceneContent: Laya.Sprite;
    /**内容*/
    private background: Laya.Sprite;
    /**返回按钮*/
    private BtnBack: Laya.Sprite;
    /**看广告按钮*/
    private BtnGet: Laya.Sprite;
    /**logo*/
    private logo: Laya.Sprite;
    /**中间角色*/
    private person: Laya.Sprite;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Sprite;
        this.BtnBack = this.self['BtnBack'];
        this.BtnGet = this.self['BtnGet'];
        this.SceneContent = this.self['SceneContent'];
        this.background = this.self['background'];
        this.logo = this.self['logo'];
        this.person = this.self['person'];

        this.btnGetNum();

        this.adaptive();
        this.openAni();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.SceneContent.y = Laya.stage.height / 2;
    }

    /**开场动画*/
    openAni(): void {
        let delayed = 150;
        let time = 250;

        let y1 = this.background.y;
        lwg.Animation.move_Deform_Y(this.background, -300, -15, y1, -0.1, 0.2, time, delayed, f => {
        });

        let y2 = this.SceneContent.y;
        lwg.Animation.move_Deform_Y(this.SceneContent, 1600, 15, y2, -0.1, 0.2, time, delayed * 2, f => {

            lwg.Animation.swell_shrink(this.logo, 1, 1.1, time / 2, delayed * 3, f => {
                this.btnClickOn();
            });
            lwg.Animation.swell_shrink(this.BtnGet, 1, 1.1, time / 2, delayed * 2, f => {
            });
            lwg.Animation.swell_shrink(this.person, 1, 1.1, time / 2, delayed * 1, f => {
            });
        });
    }


    /**开场动画回调*/
    openAniFunc(): void {
        this.btnClickOn();
    }

    /**按钮上点击次数显示*/
    btnGetNum(): void {
        let num = this.BtnGet.getChildByName('Num') as Laya.Label;
        num.text = '(' + lwg.Global._watchAdsNum + '/' + 3 + ')';
    }

    /**游戏开始按钮*/
    btnClickOn(): void {
        lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackClickUp, null);
        lwg.Click.on('largen', null, this.BtnGet, this, null, null, this.btnGetClickUp, null);
    }

    /**返回按钮抬起*/
    btnBackClickUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._openInterface('UIStart', this.self, null);
    }

    /**看广告按钮抬起*/
    btnGetClickUp(event): void {
        event.currentTarget.scale(1, 1);
        ADManager.ShowReward(() => {
            this.advFunc();
        })
    }

    /**看完广告的返回函数*/
    advFunc(): void {
        lwg.Global._watchAdsNum += 1;
        this.btnGetNum();
        if (lwg.Global._watchAdsNum >= 3) {
            this.self.close();
            lwg.Global._havePifu.push('09_chaoren');
            lwg.Global._currentPifu = lwg.Enum.PifuAllName[8];
            lwg.Global.UIMain['UIMain'].currentPifuSet();//更换成超人皮肤
            lwg.Global.UIStart['UIStart'].pifuXianding();//隐藏限定皮肤按钮

            lwg.LocalStorage.addData();
        }
    }

    onDisable(): void {

    }
}