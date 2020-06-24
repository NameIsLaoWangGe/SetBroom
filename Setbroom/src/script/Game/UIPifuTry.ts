import { lwg } from "../Lwg_Template/lwg";

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
        this.advBtnSelect();
        this.adaptive();
        this.openAni();
    }

    /**一些节点的适配*/
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
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


    /**初始化广告选择按钮*/
    advBtnSelect(): void {
        console.log(lwg.Global._gameOverAdvModel);
        let dec = this.BtnSelect.getChildByName('dec') as Laya.Image;
        if (lwg.Global._gameOverAdvModel === 1) {
            dec.skin = 'pifushiyong/word_advget.png';
            this.BtnZanshi.skin = 'pifushiyong/word_zanshi.png';
        } else if (lwg.Global._gameOverAdvModel === 2) {
            dec.skin = 'pifushiyong/word_advnoget.png';
            this.BtnZanshi.skin = 'pifushiyong/word_zanshino.png';
        }
        if (lwg.Global._gameOverAdvModel === 1) {
            lwg.Global._gameOverAdvModel = 2;
        } else {
            lwg.Global._gameOverAdvModel = 1;
        }
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
        lwg.Click.on('largen', null, this.BtnAdv, this, null, null, this.btnAdvClickUp, null);
        lwg.Click.on('noEffect', null, this.BtnSelect, this, this.btnSelectClickDown, null, null, null);
        lwg.Click.on('largen', null, this.BtnZanshi, this, null, null, this.btnZanshiClickUp, null);
    }

    /**开始游戏按钮抬起*/
    btnAdvClickUp(event): void {
        // 记录原来的皮肤，数据中还需换回
        if (!lwg.Global._whetherAdv) {
            lwg.Global._createHint(lwg.Enum.HintType.noAdv, Laya.stage.width / 2, Laya.stage.height / 2);
        } else {
            console.log('看广告！');
            this.advFunc();
        }
    }

    /**广告选定按钮事件*/
    btnSelectClickDown(): void {
        let select = this.BtnSelect.getChildByName('select') as Laya.Sprite;
        if (select.visible) {
            select.visible = false;
        } else {
            select.visible = true;
        }
        // 更换按钮下方文字按钮的字体样式
        let url1 = 'pifushiyong/word_zanshi.png';
        let url2 = 'pifushiyong/word_zanshino.png';
        if (this.BtnZanshi.skin === url1) {
            this.BtnZanshi.skin = url2;
        } else if (this.BtnZanshi.skin === url2) {
            this.BtnZanshi.skin = url1;
        }
    }

    /**暂时文字按钮点击事件*/
    btnZanshiClickUp(): void {
        let url1 = 'pifushiyong/word_zanshi.png';
        let url2 = 'pifushiyong/word_zanshino.png';
        if (this.BtnZanshi.skin === url1) {
            if (!lwg.Global._whetherAdv) {
                lwg.Global._createHint(lwg.Enum.HintType.noAdv, Laya.stage.width / 2, Laya.stage.height / 2);
            } else {
                console.log('看广告！');
                this.advFunc();
            }
        } else if (this.BtnZanshi.skin === url2) {
            // 没有看广告，不会更换皮肤。
            console.log('不看广告!');
            this.nodvFunc();
        }
    }

    /**
     * 看完广告后的回调
     * 皮肤更换后，把保存的皮肤还原
    */
    advFunc(): void {
        this.self.close();
        let yuanpifu = lwg.Global._currentPifu;
        lwg.Global._currentPifu = lwg.Enum.PifuAllName[this.pifuNum];
        lwg.Global.UIMain['UIMain'].currentPifuSet();//更换皮肤
        lwg.Global._currentPifu = yuanpifu;
        lwg.Global._gameStart = true;
        this.self.close();

        lwg.LocalStorage.addData();
    }

    /**不看广告*/
    nodvFunc(): void {
        this.self.close();
        lwg.Global._gameStart = true;
    }

    onDisable(): void {
    }
}