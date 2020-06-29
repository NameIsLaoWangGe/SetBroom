import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";

export default class UIShare extends Laya.Script {
    self
    onEnable(): void {
        this.self = this.owner as Laya.Scene;
        this.adaptive();
        this.btnOnClick();
        this.goldRes();
    }
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
    }
    /**当前拥有金币数量显示，并没有加上获得的金币*/
    goldRes(): void {
        this.self['GoldNum'].text = lwg.Global._goldNum;
    }

    btnOnClick(): void {
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['background'], this, null, null, this.backgroundUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNoShare'], this, null, null, this.btnNoShareUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
    }
    backgroundUp(event): void {
        console.log('点击背景也是分享！');
        RecordManager._share('award', () => {
            this.btnShareUpFunc();
        })
    }
    btnShareUp(event): void {
        event.currentTarget.scale(1, 1);
        console.log('分享！');
        RecordManager._share('award', () => {
            this.btnShareUpFunc();
        })
    }
    btnShareUpFunc(): void {
        // 分享可以获得奖励
        console.log('分享成功了！');
        lwg.Global._createHint_01(lwg.Enum.HintType.shareyes);
        lwg.Global._goldNum += 125;
        lwg.Global.UIVictory['UIVictory'].goldRes();

        let d = new Date();
        lwg.Global._hotShare = false;
        lwg.Global._hotShareTime = d.getDate();

        lwg.LocalStorage.addData();
        this.self.close();
    }

    btnNoShareUp(event): void {
        this.self.close();
        event.currentTarget.scale(1, 1);
    }
}