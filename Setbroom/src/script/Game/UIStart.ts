import { lwg } from "../Lwg_Template/lwg";
export default class UIStart extends Laya.Script {
    /**挂载当前脚本的节点*/
    private self: Laya.Scene;
    /**开始游戏按钮*/
    private BtnStart: Laya.Image;
    /**关卡显示位置*/
    private AccordingLv: Laya.Sprite;
    /**金币资源*/
    private GoldRes: Laya.Sprite;
    /**皮肤按钮*/
    private BtnPifu: Laya.Image;
    /**限定皮肤按钮*/
    private BtnXianding: Laya.Image;
    /**设置按钮*/
    private BtnSet: Laya.Image;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Scene;
        this.BtnStart = this.self['BtnStart'];
        this.BtnPifu = this.self['BtnPifu'];
        this.BtnXianding = this.self['BtnXianding'];
        this.BtnSet = this.self['BtnSet'];
        this.AccordingLv = this.self['AccordingLv'];
        this.GoldRes = this.self['GoldRes'];

        this.self['UIStart'] = this;

        this.goldRes();
        this.levelsDisplayFormat();
        this.pifuXianding();
        lwg.Global._levelInformation();
        if (lwg.Global._voiceSwitch) {
            lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
        }
        this.noHaveSubChaoren();

        this.adaptive();
        this.openAni();
    }


    /**一些节点的适配*/
    adaptive(): void {
        this.BtnStart.y = Laya.stage.height * 0.788;
    }

    /**开场动画*/
    openAni(): void {
        let delayed = 100;
        let time = 250;
        let x1 = this.BtnSet.x;
        lwg.Animation.move_Deform_X(this.BtnSet, -200, 30, x1, -0.1, 0.2, time, delayed * 3, f => { });

        let x2 = this.GoldRes.x;
        lwg.Animation.move_Deform_X(this.GoldRes, 920, 30, x2, 0.2, -0.15, time, delayed * 3, f => { });

        let x3 = this.BtnXianding.x;
        lwg.Animation.move_Deform_X(this.BtnXianding, -200, 30, x3, -0.15, 0.2, time, delayed * 3, f => { });

        let x4 = this.BtnPifu.x;
        lwg.Animation.move_Deform_X(this.BtnPifu, 920, 30, x4, 0.2, -0.15, time, delayed * 3, f => {
            this.openAniFunc();
        });

        let y1 = this.BtnStart.y;
        lwg.Animation.move_Deform_Y(this.BtnStart, Laya.stage.height - 100, 15, y1, -0.15, 0.2, time, delayed * 1, f => { });

        let y2 = this.AccordingLv.y;
        lwg.Animation.move_Deform_Y(this.AccordingLv, -200, -15, y2, -0.15, 0.2, time, delayed * 1, f => { });

    }
    /**开场动画回调*/
    openAniFunc(): void {
        this.btnClickOn();
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
            // console.log(lwg.Global._notHavePifuSubChaoren);
        }
    }

    /**限定皮肤是否已经获得*/
    pifuXianding(): void {
        // if (lwg.Global.pingceV) {
        //     this.BtnXianding.visible = false;
        //     return;
        // }
        if (lwg.Global._watchAdsNum >= 3) {
            this.BtnXianding.visible = false;
        }
    }

    /**金币资源初始化*/
    goldRes(): void {
        let goldLebel = this.GoldRes.getChildByName('Num') as Laya.Label;
        goldLebel.text = (lwg.Global._goldNum).toString();
    }

    /**不同模式下，关卡显示位置的显示模式*/
    levelsDisplayFormat(): void {
        let baseboard = this.AccordingLv.getChildByName('Baseboard') as Laya.Image;
        let baseboard_shadow = this.AccordingLv.getChildByName('Baseboard_Shadow') as Laya.Image;
        let box = this.AccordingLv.getChildByName('Box') as Laya.Image;
        if (lwg.Global._gameLevel > 3) {
            baseboard.skin = 'zhujiemian/baseboard_02.png';
            baseboard_shadow.skin = 'zhujiemian/baseboard_shadow.png';
            this.AccordingLv.x = 360;
            box.x = 405;
        } else {
            baseboard.skin = 'zhujiemian/baseboard_03.png';
            baseboard_shadow.skin = 'zhujiemian/baseboard_shadow2.png';
            this.AccordingLv.x = 423;
            box.x = 282;
        }
        this.levelsAccording_4();
    }

    /**
     * 显示关卡
     * 前3关是三个为一组
     * 后面从第4关开始每4个关卡为一组
     * */
    levelsAccording_4(): void {
        let currentNum;
        if (lwg.Global._gameLevel > 3) {
            // 每四个为一组,currentNum为第几个位置
            currentNum = (lwg.Global._gameLevel + 1) % 4;
            // 如果恰好是第四个位置，
            if (currentNum === 0) {
                currentNum = 4;
            }
        } else {
            // 每3个为一组,currentNum为第几个位置
            currentNum = lwg.Global._gameLevel;
        }

        // 关卡数显示
        let cusNum = this.AccordingLv.getChildByName('CusNum') as Laya.Sprite;
        // 显示已经过关的或者当前位置
        let selectedBase = this.AccordingLv.getChildByName('SelectedBase') as Laya.Sprite;
        // 字体颜色
        for (let index = 0; index < cusNum.numChildren; index++) {
            const cus = cusNum.getChildAt(index) as Laya.Label;
            let base = selectedBase.getChildAt(index) as Laya.Image;//黄色底部显示
            let num = Number(cus.name.substring(3, 4));
            if (num === currentNum) {
                cus.color = '#0d0d21';
                cus.text = lwg.Global._gameLevel.toString();
                if (lwg.Global._gameLevel === 3) {
                    base.skin = 'zhujiemian/ui_customs_circle02.png';
                }
            } else {
                let diff = num - currentNum;
                if (diff > 0) {
                    cus.text = (lwg.Global._gameLevel + diff).toString();
                    base.visible = false;
                    cus.color = '#fff630';
                } else {
                    cus.text = (lwg.Global._gameLevel + diff).toString();
                    cus.color = '#0d0d21';
                }
            }
        }
    }

    /**游戏开始按钮*/
    btnClickOn(): void {
        lwg.Click.on('largen', null, this.BtnStart, this, null, null, this.btnStartClickUp, null);
        lwg.Click.on('largen', null, this.BtnPifu, this, null, null, this.btnPifuClickUp, null);
        lwg.Click.on('largen', null, this.BtnSet, this, null, null, this.btnSetClickUp, null);
        lwg.Click.on('largen', null, this.BtnXianding, this, null, null, this.btnXiandingClickUp, null);
    }

    /**开始游戏按钮抬起*/
    btnStartClickUp(event): void {
        event.currentTarget.scale(1, 1);
        if (lwg.Global.pingceV) {
            lwg.Global._gameStart = true;
            this.self.close();
            return;
        }
        this.noHaveSubChaoren();
        if (lwg.Global._notHavePifuSubChaoren.length === 0) {
            lwg.Global._gameStart = true;
        } else {
            lwg.Global._openInterface('UIPifuTry', this.self, null);
        }
        this.self.close();
    }

    /**设置按钮抬起*/
    btnSetClickUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._openInterface('UISet', null, null);
    }

    /**设置按钮抬起*/
    btnPifuClickUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._openInterface('UIPifu_01', null, null);
    }

    /**限定皮肤*/
    btnXiandingClickUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Global._openInterface('UIXDpifu', this.self, null);
    }

    onDisable(): void {
    }
}