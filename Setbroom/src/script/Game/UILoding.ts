import UIMain from './UIMain';
import { lwg } from '../Lwg_Template/lwg';
export default class UILoding extends Laya.Script {
    /**挂载当前脚本的节点*/
    private self: Laya.Scene;
    /**游戏加载进度条*/
    private Progress: Laya.Sprite;
    /**logo*/
    private Logo: Laya.Sprite;
    /**加载字体*/
    private Word: Laya.Sprite;

    /**进度条*/
    private ProgressBar: Laya.Sprite;
    /**进度条遮罩*/
    private Mask: Laya.Image;
    /**进度调整遮罩移动开关*/
    private MaskMoveSwitch: boolean

    onEnable(): void {
        this.self = this.owner as Laya.Scene;
        this.Progress = this.self['Progress'];
        this.Logo = this.self['Logo'];
        this.Word = this.self['Word'];
        this.Mask = this.self['Mask'];
        this.MaskMoveSwitch = false;
        this.adaptive();
        this.openAni();
        
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.Progress.y = Laya.stage.height * 0.7815;
        this.Word.y = this.Progress.y - 57.5;
        this.Logo.y = Laya.stage.height * 0.2787;
    }

    /**开场动画*/
    openAni(): void {
        let delayed = 100;
        let time = 250;

        let logoY = this.Logo.y;
        lwg.Animation.move_Deform_Y(this.Logo, 0, 0, logoY, 0.2, -0.15, time, delayed * 1, f => { });

        let preY = this.Progress.y;
        lwg.Animation.move_Deform_Y(this.Progress, preY, 0, preY, 0.1, -0.15, time, delayed * 2, f => { });

        let wY = this.Word.y;
        lwg.Animation.move_Deform_Y(this.Word, wY, 0, wY, 0.1, -0.15, time, delayed * 3, f => {
            this.openAniFunc();
            
        });
    }
    openAniFunc(): void {
        this.dataLoading();
        this.MaskMoveSwitch = true;
    }

    /**优先加载数据表*/
    dataLoading(): void {
        Laya.loader.load("Data/levelsData.json", Laya.Handler.create(this, this.levelsOnLoaded), null, Laya.Loader.JSON);
    }

    /**回调函数*/
    levelsOnLoaded(): void {
        lwg.Global._levelsData = Laya.loader.getRes("Data/levelsData.json")["RECORDS"];
        // 关闭多点触控
        Laya.MouseManager.multiTouchEnabled = false;
        this.lodeUserInfo();
        this.lodeMianScene3D();
    }

    /**加载游戏内的3D场景，两个场景同时出现*/
    lodeMianScene3D(): void {
        Laya.Scene3D.load("testScene/LayaScene_GameMain/Conventional/GameMain.ls", Laya.Handler.create(this, this.mianSceneComplete));
    }

    /**记录游戏主场景是否完成，用于进度条的进度控制*/
    private mianSceneOk: boolean = false;
    /**回调函数*/
    mianSceneComplete(scene: Laya.Scene3D): void {
        // 将场景加到舞台上，注意层级
        Laya.stage.addChildAt(scene, 0);
        scene.addComponent(UIMain);
        lwg.Global.UIMain = scene;
        // 进度条加满
        this.Mask.x = -2;
        // 打开开始游戏界面并关闭自己
        lwg.Global._openInterface('UIStart', this.self, f => {

        });
        this.mianSceneOk = true;
    }

    /**加载玩家信息*/
    lodeUserInfo(): void {
        let data: any = lwg.LocalStorage.getData();
        if (data) {
            lwg.Global._gameLevel = data._gameLevel;
            lwg.Global._goldNum = data._goldNum;
            lwg.Global._buyNum = data._buyNum;
            lwg.Global._currentPifu = data._currentPifu;
            lwg.Global._havePifu = data._havePifu;
            lwg.Global._watchAdsNum = data._watchAdsNum;
            lwg.Global._gameOverAdvModel = data._gameOverAdvModel;
            lwg.Global._whetherAdv = data._whetherAdv;

            let d = new Date();
            lwg.Global._hotShareTime = data._hotShareTime;
         
            if (d.getDate() !== lwg.Global._hotShareTime) {
                lwg.Global._hotShare = true;
                console.log('今天还有一次热门分享的机会！');
            } else {
                lwg.Global._hotShare = false;
                console.log('今天没有热门分享的机会！');
            }
        }
    }

    onUpdate(): void {
        // 模拟加载进度
        if (this.MaskMoveSwitch) {
            if (this.Mask.x < -80) {
                this.Mask.x += 5;
            }
        }
    }

    onDisable(): void {
        if (lwg.Global._voiceSwitch) {
            lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
        }
    }
}