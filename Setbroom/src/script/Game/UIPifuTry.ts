import { lwg } from "../Lwg_Template/lwg";
import ADManager from "../../TJ/Admanager";

export default class UIPifuTry extends Laya.Script {
    /**指代挂载当前脚本的节点*/
    private self: Laya.Scene;
    /**皮肤的名称*/
    private PifuName: Laya.Sprite;
    /**皮肤的名称*/
    private Name: Laya.Label;
    /**皮肤的样式*/
    private Pifu: Laya.Sprite;
    /**看广告选择*/
    private BtnSelect: Laya.Sprite;
    /**看广告获取*/
    private BtnAdv: Laya.Sprite;
    /**暂时试用字体*/
    private BtnZanshi: Laya.Image;
    /**随机到的皮肤是第几个皮肤*/
    private pifuNum: number;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Scene;
        this.PifuName = this.self['PifuName'];
        this.Pifu = this.self['Pifu'];
        this.BtnSelect = this.self['BtnSelect'];
        this.BtnAdv = this.self['BtnAdv'];
        this.BtnZanshi = this.self['BtnZanshi'];
        this.Name = this.self['Name'];

        this.randomNoHave();
        this.btnClickOn();
        this.adaptive();
        this.openAni();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
        this.self['P201_02'].y = Laya.stage.height * 0.1656;
        this.self['P201_01'].y = Laya.stage.height * 0.1656;
    }

    /**开场动画*/
    openAni(): void {
        let delayed = 150;
        let time = 250;

        let y1 = this.self['background'].y;
        lwg.Animation.move_Deform_Y(this.self['background'], -300, -15, y1, -0.1, 0.2, time, delayed, f => {
        });

        let y2 = this.self['SceneContent'].y;
        lwg.Animation.move_Deform_Y(this.self['SceneContent'], 1600, 15, y2, -0.1, 0.2, time, delayed * 2, f => {

            lwg.Animation.swell_shrink(this.self['SetBtn'], 1, 1.1, time / 2, delayed * 3, f => {
                this.btnClickOn();
            });
            lwg.Animation.swell_shrink(this.PifuName, 1, 1.1, time / 2, delayed * 2, f => {
            });
            lwg.Animation.swell_shrink(this.Pifu, 1, 1.1, time / 2, delayed * 1, f => {
            });
        });

    }

    /**找出还没有获得的皮肤,不包括超人*/
    noHaveSubChaoren(): void {
        // 所有皮肤赋值给新数组
        let allArray = [];
        for (let i = 0; i < lwg.Global._allPifu.length; i++) {
            const element = lwg.Global._allPifu[i];
            allArray.push(element);
        }
        // 删除已经有的皮肤，得出还没有的皮肤
        for (let j = 0; j < allArray.length; j++) {
            let element1 = allArray[j];
            for (let k = 0; k < lwg.Global._havePifu.length; k++) {
                let element2 = lwg.Global._havePifu[k];
                if (element1 === element2) {
                    allArray.splice(j, 1);
                    j--;
                }
            }
        }

        lwg.Global._notHavePifu = allArray;
        // 去除超人皮肤
        for (let k = 0; k < allArray.length; k++) {
            const element = allArray[k];
            if (element === '09_chaoren') {
                allArray.splice(k, 1);
            }
            lwg.Global._notHavePifuSubChaoren = allArray;
            console.log(lwg.Global._notHavePifuSubChaoren);
        }
    }

    /**随机出一个还没有获得的皮肤放在皮肤加载位置*/
    randomNoHave(): void {
        let len = lwg.Global._notHavePifuSubChaoren.length;
        if (len === 0) {
            this.self.close();
            lwg.Global._gameStart = true;
            return;
        }
        let random = Math.floor(Math.random() * len);
        // 显示名称
        let pifuName = lwg.Global._notHavePifu[random];
        let oder1 = lwg.Enum.PifuAllName[pifuName];
        this.pifuNum = oder1;
        // let name = this.PifuName.getChildByName('Name') as Laya.Label;
        this.Name.text = lwg.Enum.PifuAllName_Ch[oder1];
        // 找到皮肤地址
        let pifuImg = this.Pifu.getChildByName('img') as Laya.Image;
        let oder2 = lwg.Enum.PifuAllName[pifuName];
        pifuImg.skin = lwg.Enum.PifuSkin[oder2];
    }

    /**游戏开始按钮*/
    btnClickOn(): void {
        console.log(this.self['BtnAdv']);
        lwg.Click.on('largen', null, this.self['BtnClose'], this, null, null, this.btnCloseClickUp, null);
        lwg.Click.on('largen', null, this.self['BtnSelect'], this, null, null, this.btnAdvClickUp, null);
        lwg.Click.on('largen', null, this.self['BtnAdv'], this, null, null, this.btnAdvClickUp, null);
        lwg.Click.on('largen', null, this.BtnZanshi, this, null, null, this.btnAdvClickUp, null);
    }
    btnCloseClickUp(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
        lwg.Global._gameStart = true;
    }
    btnAdvClickUp(event): void {
        event.currentTarget.scale(1, 1);
        ADManager.ShowReward(() => {
            this.advFunc();
        })
    }
    advFunc(): void {
        let yuanpifu = lwg.Global._currentPifu;
        lwg.Global._currentPifu = lwg.Enum.PifuAllName[this.pifuNum];
        lwg.Global.UIMain['UIMain'].currentPifuSet();//更换皮肤
        lwg.Global._currentPifu = yuanpifu;
        lwg.LocalStorage.addData();

        lwg.Global._gameStart = true;
        this.self.close();
    }

}