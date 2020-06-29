(function () {
    'use strict';

    class PromoOpen extends Laya.Script {
        constructor() {
            super(...arguments);
            this.target = null;
        }
        onClick() {
            this.target.active = this.target.visible = true;
        }
    }

    class ButtonScale extends Laya.Script {
        constructor() {
            super(...arguments);
            this.time = .1;
            this.ratio = 1.04;
            this.startScaleX = 1;
            this.startScaleY = 1;
            this.scaled = false;
        }
        onAwake() {
            this.owner.on(Laya.Event.MOUSE_DOWN, null, () => { this.ScaleBig(); });
            this.owner.on(Laya.Event.MOUSE_UP, null, () => { this.ScaleSmall(); });
            this.owner.on(Laya.Event.MOUSE_OUT, null, () => { this.ScaleSmall(); });
        }
        ScaleBig() {
            if (this.scaled)
                return;
            this.scaled = true;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX * this.ratio, scaleY: this.startScaleY * this.ratio }, this.time * 1000);
        }
        ScaleSmall() {
            if (!this.scaled)
                return;
            this.scaled = false;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX, scaleY: this.startScaleY }, this.time * 1000);
        }
    }

    class PromoItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.bgImage = null;
            this.iconImage = null;
            this.nameText = null;
            this.infoText = null;
            this.flag1 = null;
            this.flag2 = null;
            this.flag3 = null;
        }
        onAwake() {
            this.bgImage = this.owner.getChildByName("bg");
            this.iconImage = this.owner.getChildByName("icon");
            if (this.iconImage != null) {
                this.flag1 = this.iconImage.getChildByName("flag1");
                this.flag2 = this.iconImage.getChildByName("flag2");
                this.flag3 = this.iconImage.getChildByName("flag3");
            }
            this.nameText = this.owner.getChildByName("name");
            this.infoText = this.owner.getChildByName("info");
        }
        DoLoad() {
            if (this.data == null)
                return;
            if (this.iconImage != null)
                this.iconImage.skin = this.data.icon;
            if (this.nameText != null)
                this.nameText.text = this.data.title;
            this.SetFlag();
        }
        SetFlag() {
            if (this.flag1 != null)
                this.flag1.active = this.flag1.visible = false;
            if (this.flag2 != null)
                this.flag2.active = this.flag2.visible = false;
            if (this.flag3 != null)
                this.flag3.active = this.flag3.visible = false;
            switch (this.data.tag) {
                case 1:
                    if (this.flag1 != null)
                        this.flag1.active = this.flag1.visible = true;
                    break;
                case 2:
                    if (this.flag2 != null)
                        this.flag2.active = this.flag2.visible = true;
                    break;
                case 3:
                    if (this.flag3 != null)
                        this.flag3.active = this.flag3.visible = true;
                    break;
            }
        }
        OnShow() {
            this.data.ReportShow();
        }
        OnClick() {
            this.data.Click();
            if (this.onClick_ != null) {
                this.onClick_(this);
            }
        }
        onClick() {
            this.OnClick();
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class Behaviour extends Laya.Script {
        constructor() {
            super(...arguments);
            this.isAwake = false;
            this.isStart = false;
            this.isEnable = false;
            this.isDestroy = false;
        }
        OnAwake() { }
        OnStart() { }
        OnUpdate() { }
        OnEnable() { }
        OnDisable() { }
        OnDestroy() { }
        DoAwake() {
            if (!this.active)
                return;
            if (!this.isAwake) {
                this.isAwake = true;
                this.OnAwake();
            }
        }
        DoStart() {
            if (!this.active)
                return;
            if (!this.isStart) {
                this.isStart = true;
                this.OnStart();
            }
        }
        DoUpdate() {
            if (!this.active)
                return;
            if (this.isStart) {
                this.OnUpdate();
            }
        }
        DoEnable() {
            if (!this.active)
                return;
            if (!this.isEnable) {
                this.isEnable = true;
                this.OnEnable();
            }
        }
        DoDisable() {
            if (this.isEnable) {
                this.isEnable = false;
                this.OnDisable();
            }
        }
        DoDestroy() {
            if (!this.isDestroy) {
                this.isDestroy = true;
                this.OnDestroy();
            }
        }
        onAwake() {
            this.DoAwake();
        }
        onStart() {
            this.DoAwake();
            this.DoStart();
        }
        onUpdate() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
            this.DoUpdate();
        }
        onEnable() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
        }
        onDisable() {
            this.DoDisable();
        }
        onDestroy() {
            this.DoDestroy();
        }
        static SetActive(node, value) {
            if (node == null)
                return;
            node.active = value;
            if (node instanceof Laya.Box) {
                node.visible = value;
            }
        }
        static GetActive(node) {
            if (node == null)
                return false;
            if (!node.active)
                return false;
            if (node instanceof Laya.Box) {
                if (!node.visible)
                    return false;
            }
            return true;
        }
        get active() {
            return Behaviour.GetActive(this.owner);
        }
        set active(value) {
            Behaviour.SetActive(this.owner, value);
            if (value) {
                this.DoEnable();
            }
            else {
                this.DoDisable();
            }
        }
    }

    class P201 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoItem = null;
            this.shake = false;
            this.animTime = 0;
            this.refrTime = 0;
        }
        OnAwake() {
            return __awaiter(this, void 0, void 0, function* () {
                this.promoItem = this.owner.getComponent(PromoItem);
                TJ.Develop.Yun.Promo.Data.ReportAwake(P201.style);
                this.promoItem.style = P201.style;
                this.active = false;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt && Laya.Browser.onIOS) {
                    return;
                }
                if (P201.promoList == null) {
                    let list = yield TJ.Develop.Yun.Promo.List.Get(P201.style);
                    if (P201.promoList == null)
                        P201.promoList = list;
                }
                if (P201.promoList.count > 0) {
                    TJ.Develop.Yun.Promo.Data.ReportStart(P201.style);
                    this.active = true;
                }
                else {
                    this.owner.destroy();
                }
            });
        }
        OnEnable() {
            this.LoadAndShowIcon();
        }
        OnDisable() {
            if (P201.promoList != null) {
                P201.promoList.Unload(this.promoItem.data);
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            this.refrTime += deltaTime;
            if (this.refrTime > 5) {
                this.refrTime -= 5;
                this.LoadAndShowIcon();
            }
            if (!this.shake)
                return;
            this.animTime += deltaTime;
            this.animTime %= 2.5;
            if (this.animTime <= .75) {
                this.promoItem.owner.rotation = Math.sin(this.animTime * 6 * Math.PI) * 25 * (1 - this.animTime / .75);
            }
            else {
                this.promoItem.owner.rotation = 0;
            }
        }
        LoadIcon() {
            let data = P201.promoList.Load();
            if (data != null) {
                P201.promoList.Unload(this.promoItem.data);
                this.promoItem.data = data;
                this.promoItem.onClick_ = () => { this.LoadAndShowIcon(); };
                this.promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon() {
            if (this.LoadIcon() != null) {
                this.promoItem.OnShow();
            }
            else {
                if (this.promoItem.data == null) {
                    this.owner.destroy();
                }
            }
        }
    }
    P201.style = "P201";
    P201.promoList = null;

    class P202 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.line = 0;
            this.column = 0;
            this.toTop = false;
            this.showing = [];
        }
        OnAwake() {
            return __awaiter(this, void 0, void 0, function* () {
                this.scroll = this.owner.getChildByName("scroll");
                this.layout = this.scroll.getChildByName("layout");
                this.prefab = this.layout.getCell(0);
                let w = this.owner.width - this.paddingTop - this.paddingBottom;
                while (w >= this.prefab.width) {
                    w = w - this.prefab.width - this.layout.spaceX;
                    this.column++;
                }
                TJ.Develop.Yun.Promo.Data.ReportAwake(P202.style);
                this.active = false;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt && Laya.Browser.onIOS) {
                    return;
                }
                this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P202.style);
                if (this.promoList.count > 0) {
                    TJ.Develop.Yun.Promo.Data.ReportStart(P202.style);
                    this.line = Math.ceil(this.promoList.count / this.column);
                    this.layout.repeatX = this.column;
                    this.layout.repeatY = this.line;
                    for (let i = 0; i < this.layout.cells.length; i++) {
                        let node = this.layout.getCell(i);
                        if (i < this.promoList.count) {
                            let item = node.getComponent(PromoItem);
                            if (item != null) {
                                this.itemList.push(item);
                                item.style = P202.style;
                            }
                            Behaviour.SetActive(node, true);
                        }
                        else {
                            Behaviour.SetActive(node, false);
                        }
                    }
                    this.line = Math.ceil(this.itemList.length / this.column);
                    let h = this.paddingTop + this.paddingBottom;
                    h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
                    this.layout.height = h;
                    if (this.scroll.height < this.layout.height) {
                        this.scroll.vScrollBarSkin = "";
                        this.scroll.vScrollBar.rollRatio = 0;
                    }
                    for (let item of this.itemList) {
                        this.LoadIcon(item);
                    }
                    this.active = true;
                }
                else {
                    this.owner.destroy();
                }
            });
        }
        OnDisable() {
            return __awaiter(this, void 0, void 0, function* () {
                this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P202.style);
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
            });
        }
        get maxTop() {
            return 0;
        }
        get maxBottom() {
            let y = this.paddingTop + this.paddingBottom;
            y += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1) - this.scroll.height;
            return y;
        }
        get scrollValue() {
            if (this.scroll.vScrollBar != null) {
                return this.scroll.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.vScrollBar != null) {
                this.scroll.vScrollBar.value = v;
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.scroll.height < this.layout.height) {
                if (this.scrollValue <= this.maxTop) {
                    this.toTop = false;
                }
                else if (this.scrollValue >= this.maxBottom) {
                    this.toTop = true;
                }
                if (this.toTop) {
                    this.scrollValue -= 50 * deltaTime;
                }
                else {
                    this.scrollValue += 50 * deltaTime;
                }
            }
            else {
                this.scrollValue = this.maxTop;
            }
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
                promoItem.infoText.text = 1 + Math.floor(Math.random() * 40) / 10 + "w人在玩";
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let i = this.showing.indexOf(item);
                let node = item.owner;
                let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
                if (d < this.scroll.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P202.style = "P202";

    class P103 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.layout = null;
        }
        OnAwake() {
            return __awaiter(this, void 0, void 0, function* () {
                this.layout = this.owner.getChildByName("layout");
                let close = this.owner.getChildByName("close");
                close.clickHandler = new Laya.Handler(null, () => { this.OnClose(); });
                TJ.Develop.Yun.Promo.Data.ReportAwake(P103.style);
                this.active = false;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt && Laya.Browser.onIOS) {
                    return;
                }
                this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P103.style);
                if (this.promoList.count > 0) {
                    TJ.Develop.Yun.Promo.Data.ReportStart(P103.style);
                    for (let i = 0; i < this.layout.cells.length; i++) {
                        let node = this.layout.getCell(i);
                        if (i < this.promoList.count) {
                            let item = node.getComponent(PromoItem);
                            if (item != null) {
                                this.itemList.push(item);
                                item.style = P103.style;
                            }
                            node.active = node.visible = true;
                        }
                        else {
                            node.active = node.visible = false;
                        }
                    }
                    for (let item of this.itemList) {
                        this.LoadIcon(item);
                    }
                    this.active = true;
                }
                else {
                    this.owner.destroy();
                }
            });
        }
        OnEnable() {
            for (let item of this.itemList) {
                item.OnShow();
            }
        }
        OnDisable() {
            return __awaiter(this, void 0, void 0, function* () {
                this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P103.style);
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
            });
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        OnClose() {
            let node = this.owner;
            node.active = node.visible = false;
        }
    }
    P103.style = "P103";

    class P204 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingLeft = 20;
            this.paddingRight = 20;
            this.toLeft = false;
            this.showing = [];
        }
        OnAwake() {
            return __awaiter(this, void 0, void 0, function* () {
                this.scroll = this.owner.getChildByName("scroll");
                this.layout = this.scroll.getChildByName("layout");
                this.prefab = this.layout.getCell(0);
                TJ.Develop.Yun.Promo.Data.ReportAwake(P204.style);
                this.active = false;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt && Laya.Browser.onIOS) {
                    return;
                }
                let list = yield TJ.Develop.Yun.Promo.List.Get(P204.style);
                if (this.promoList == null)
                    this.promoList = list;
                if (this.promoList.count > 0) {
                    TJ.Develop.Yun.Promo.Data.ReportStart(P204.style);
                    this.layout.repeatX = this.promoList.count;
                    for (let i = 0; i < this.layout.cells.length; i++) {
                        let node = this.layout.getCell(i);
                        if (i < this.promoList.count) {
                            let item = node.getComponent(PromoItem);
                            if (item != null) {
                                this.itemList.push(item);
                                item.style = P204.style;
                            }
                            node.active = node.visible = true;
                        }
                        else {
                            node.active = node.visible = false;
                        }
                    }
                    let w = this.paddingLeft + this.paddingRight;
                    w += this.prefab.width * this.itemList.length + this.layout.spaceX * (this.itemList.length - 1);
                    this.layout.width = w;
                    if (this.scroll.width < this.layout.width) {
                        this.scroll.hScrollBarSkin = "";
                        this.scroll.hScrollBar.rollRatio = 0;
                    }
                    this.layout.width = w;
                    for (let item of this.itemList) {
                        this.LoadIcon(item);
                    }
                    this.active = true;
                }
                else {
                    this.owner.destroy();
                }
            });
        }
        get maxLeft() {
            let x = 0;
            return x;
        }
        get maxRight() {
            let x = this.scroll.hScrollBar.max;
            return x;
        }
        get scrollValue() {
            if (this.scroll.hScrollBar != null) {
                return this.scroll.hScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.hScrollBar != null) {
                this.scroll.hScrollBar.value = v;
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.scroll.width < this.layout.width) {
                if (this.scrollValue >= this.maxRight) {
                    this.toLeft = true;
                }
                else if (this.scrollValue <= this.maxLeft) {
                    this.toLeft = false;
                }
                if (this.toLeft) {
                    this.scrollValue -= 50 * deltaTime;
                }
                else {
                    this.scrollValue += 50 * deltaTime;
                }
            }
            else {
                this.layout.x = this.maxLeft;
            }
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadIcon(item); };
                promoItem.DoLoad();
                let i = this.showing.indexOf(promoItem);
                if (i >= 0) {
                    this.showing.splice(i, 1);
                }
            }
            return data;
        }
        CheckShow() {
            for (let item of this.itemList) {
                let node = item.owner;
                let d = Math.abs(node.x - this.scrollValue - this.scroll.width / 2 + node.width / 2 + this.layout.spaceX);
                let i = this.showing.indexOf(item);
                if (d < this.scroll.width / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P204.style = "P204";

    class P205 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.move = null;
            this.show = null;
            this.hide = null;
            this.maxX = 620;
            this.line = 0;
            this.column = 0;
            this.targetX = 0;
            this.showing = [];
        }
        OnAwake() {
            return __awaiter(this, void 0, void 0, function* () {
                this.move = this.owner.getChildByName("move");
                let button = this.move.getChildByName("button");
                this.show = button.getChildByName("show");
                this.hide = button.getChildByName("hide");
                let board = this.move.getChildByName("board");
                this.scroll = board.getChildByName("scroll");
                this.layout = this.scroll.getChildByName("layout");
                this.prefab = this.layout.getCell(0);
                this.show.clickHandler = new Laya.Handler(null, () => { this.Show(); });
                this.hide.clickHandler = new Laya.Handler(null, () => { this.Hide(); });
                let w = this.scroll.width - this.paddingTop - this.paddingBottom;
                while (w >= this.prefab.width) {
                    w = w - this.prefab.width - this.layout.spaceX;
                    this.column++;
                }
                TJ.Develop.Yun.Promo.Data.ReportAwake(P205.style);
                if (this.show.parent.scaleX < 0)
                    this.maxX = -this.maxX;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                    if (Laya.Browser.onIOS) {
                        this.active = false;
                        return;
                    }
                    return;
                }
                this.active = false;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt && Laya.Browser.onIOS) {
                    return;
                }
                this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P205.style);
                if (this.promoList.count > 0) {
                    TJ.Develop.Yun.Promo.Data.ReportStart(P205.style);
                    this.line = Math.ceil(this.promoList.count / this.column);
                    this.layout.repeatX = this.column;
                    this.layout.repeatY = this.line;
                    for (let i = 0; i < this.layout.cells.length; i++) {
                        let node = this.layout.getCell(i);
                        if (i < this.promoList.count) {
                            let item = node.getComponent(PromoItem);
                            if (item != null) {
                                this.itemList.push(item);
                                item.style = P205.style;
                            }
                            node.active = node.visible = true;
                        }
                        else {
                            node.active = node.visible = false;
                        }
                    }
                    this.line = Math.ceil(this.itemList.length / this.column);
                    let h = this.paddingTop + this.paddingBottom;
                    h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
                    this.layout.height = h;
                    if (this.scroll.height < this.layout.height) {
                        this.scroll.vScrollBarSkin = "";
                        this.scroll.vScrollBar.rollRatio = 0;
                    }
                    for (let item of this.itemList) {
                        this.LoadIcon(item);
                    }
                    this.active = true;
                }
                else {
                    this.owner.destroy();
                }
            });
        }
        get scrollValue() {
            if (this.scroll.vScrollBar != null) {
                return this.scroll.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.vScrollBar != null) {
                this.scroll.vScrollBar.value = v;
            }
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        Show() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                let param = new TJ.API.Promo.Param();
                param.extraData = { "TJ_App": TJ.API.AppInfo.AppGuid() };
                TJ.API.Promo.Pop(param);
                return;
            }
            this.targetX = this.maxX;
            this.show.active = this.show.visible = false;
            this.hide.active = this.hide.visible = true;
            this.scrollValue = 0;
        }
        Hide() {
            this.targetX = 0;
            this.showing = [];
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.move.centerX != this.targetX) {
                let d = this.targetX - this.move.centerX;
                let s = 3000 * deltaTime;
                if (d > 0) {
                    d = Math.min(this.move.centerX + s, this.targetX);
                }
                else {
                    d = Math.max(this.move.centerX - s, this.targetX);
                }
                this.move.centerX = d;
                if (this.move.centerX == 0) {
                    this.show.active = this.show.visible = true;
                    this.hide.active = this.hide.visible = false;
                    window.setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P205.style);
                        for (let item of this.itemList) {
                            this.LoadIcon(item);
                        }
                    }), 0);
                }
            }
            else {
                if (this.move.centerX == this.maxX) {
                    this.CheckShow();
                }
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let i = this.showing.indexOf(item);
                let node = item.owner;
                let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
                if (d < this.scroll.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P205.style = "P205";

    class P106 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.layout = null;
            this.showing = [];
        }
        OnAwake() {
            return __awaiter(this, void 0, void 0, function* () {
                this.scrollView = this.owner.getChildByName("scroll");
                this.layout = this.scrollView.getChildByName("layout");
                this.scrollView.vScrollBarSkin = "";
                let close = this.owner.getChildByName("close");
                close.clickHandler = new Laya.Handler(null, () => { this.OnClose(); });
                TJ.Develop.Yun.Promo.Data.ReportAwake(P106.style);
                this.active = false;
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt && Laya.Browser.onIOS) {
                    return;
                }
                let list = yield TJ.Develop.Yun.Promo.List.Get(P106.style);
                if (this.promoList == null)
                    this.promoList = list;
                if (this.promoList.count > 0) {
                    TJ.Develop.Yun.Promo.Data.ReportStart(P106.style);
                    this.layout.repeatY = this.promoList.count;
                    let h = 0;
                    for (let i = 0; i < this.layout.cells.length; i++) {
                        let node = this.layout.getCell(i);
                        if (i < this.promoList.count) {
                            let item = node.getComponent(PromoItem);
                            if (item != null) {
                                this.itemList.push(item);
                                item.style = P106.style;
                            }
                            Behaviour.SetActive(node, true);
                        }
                        else {
                            Behaviour.SetActive(node, false);
                        }
                        if (i > 0) {
                            h += this.layout.spaceY;
                        }
                        h += node.height;
                    }
                    this.layout.height = h;
                    for (let item of this.itemList) {
                        this.LoadIcon(item);
                    }
                    this.active = true;
                }
                else {
                    this.owner.destroy();
                }
            });
        }
        OnEnable() {
            this.scrollValue = 0;
        }
        OnDisable() {
            return __awaiter(this, void 0, void 0, function* () {
                this.promoList = yield TJ.Develop.Yun.Promo.List.Get(P106.style);
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
            });
        }
        OnUpdate() {
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadIcon(item); };
                promoItem.DoLoad();
                let i = this.showing.indexOf(promoItem);
                if (i >= 0) {
                    this.showing.splice(i, 1);
                }
            }
            return data;
        }
        get scrollValue() {
            if (this.scrollView.vScrollBar != null) {
                return this.scrollView.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scrollView.vScrollBar != null) {
                this.scrollView.vScrollBar.value = v;
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let node = item.owner;
                let d = Math.abs(node.y - this.scrollValue - this.scrollView.height / 2 + node.height / 2 + this.layout.spaceY);
                let i = this.showing.indexOf(item);
                if (d < this.scrollView.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
        OnClose() {
            let node = this.owner;
            node.active = node.visible = false;
        }
    }
    P106.style = "P106";

    var lwg;
    (function (lwg) {
        let Global;
        (function (Global) {
            Global._gameStart = false;
            Global._timeLineSwitch = false;
            Global._clickScreenNum = 0;
            Global._gameTimeLine = 0;
            Global._goldNum = 0;
            Global._btnDelayed = 2000;
            Global._taskContentArray = [];
            Global._taskPrePoint = new Laya.Point();
            Global._firstConnect = false;
            Global._connectState = false;
            Global._hotShare = true;
            Global._voiceSwitch = true;
            Global._shakeSwitch = true;
            Global._currentPifu = '01_xiaofu';
            Global._havePifu = ['01_xiaofu'];
            Global._allPifu = ['01_xiaofu', '02_konglong', '03_xueren', '04_qipao', '05_qianxun', '06_lvyifu', '07_maozi', '08_lufei', '09_chaoren'];
            Global._checkpointInterval = 3;
            Global.pingceV = false;
            function vibratingScreen() {
            }
            Global.vibratingScreen = vibratingScreen;
            function _levelInformation() {
                let data = lwg.Global._levelsData;
                let index;
                if (lwg.Global._gameLevel > 20) {
                    index = Math.floor(Math.random() * 20);
                }
                else {
                    index = lwg.Global._gameLevel - 1;
                }
                let levelData = data[index];
                lwg.Global._taskContentArray = [];
                for (let index = 0; index < levelData['type'].length; index++) {
                    let taskobj = {};
                    const type = levelData['type'][index];
                    taskobj['type'] = type;
                    const time = levelData['time'][index];
                    taskobj['time'] = time;
                    const dec = levelData['dec'][index];
                    taskobj['dec'] = dec;
                    lwg.Global._taskContentArray.push(taskobj);
                }
                console.log(lwg.Global._taskContentArray);
                lwg.Global._taskPreNum = 1;
            }
            Global._levelInformation = _levelInformation;
            function _createHint_01(type) {
                let sp;
                Laya.loader.load('prefab/HintPre_01.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                    let dec = sp.getChildByName('dec');
                    dec.text = Enum.HintDec[type];
                    sp.zOrder = 100;
                    dec.alpha = 0;
                    Animation.scale_Alpha(sp, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                        Animation.fadeOut(dec, 0, 1, 150, 0, f => {
                            Animation.fadeOut(dec, 1, 0, 200, 800, f => {
                                Animation.scale_Alpha(sp, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                    sp.removeSelf();
                                });
                            });
                        });
                    });
                }));
            }
            Global._createHint_01 = _createHint_01;
            function _openInterface(openName, cloesScene, func) {
                Laya.Scene.load('sys/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    Laya.stage.addChild(scene);
                    let background = scene.getChildByName('background');
                    if (background) {
                        background.width = Laya.stage.width;
                        background.height = Laya.stage.height;
                    }
                    switch (openName) {
                        case 'UIVictory':
                            Global.UIVictory = scene;
                            console.log('本关胜利');
                            break;
                        case 'UIDefeated':
                            console.log('本关失败');
                            break;
                        case 'UITask':
                            Global.UITask = scene;
                            console.log('任务界面');
                            break;
                        case 'UIStart':
                            Global.UIStart = scene;
                            console.log('开始界面');
                            break;
                        case 'UISet':
                            console.log('设置界面');
                            Global.UISet = scene;
                            break;
                        case 'UILoding':
                            console.log('加载界面');
                            break;
                        default:
                            break;
                    }
                    if (cloesScene) {
                        cloesScene.close();
                    }
                    if (func) {
                        func();
                    }
                }));
            }
            Global._openInterface = _openInterface;
            function _createHint(type, x, y) {
                let sp;
                Laya.loader.load('prefab/HintPre.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.pos(x, y);
                    let dec = sp.getChildByName('dec');
                    dec.text = lwg.Enum.HintDec[type];
                    lwg.Animation.HintAni_01(sp, 100, 100, 1000, 50, 100, f => {
                        sp.removeSelf();
                    });
                }));
            }
            Global._createHint = _createHint;
        })(Global = lwg.Global || (lwg.Global = {}));
        function _createGold(type, parent, x, y) {
            let sp;
            Laya.loader.load('prefab/GolPre.json', Laya.Handler.create(this, function (prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                parent.addChild(sp);
            }));
        }
        lwg._createGold = _createGold;
        let LocalStorage;
        (function (LocalStorage) {
            let storageData;
            function addData() {
                storageData = {
                    '_gameLevel': lwg.Global._gameLevel,
                    '_goldNum': lwg.Global._goldNum,
                    '_buyNum': lwg.Global._buyNum,
                    '_currentPifu': lwg.Global._currentPifu,
                    '_havePifu': lwg.Global._havePifu,
                    '_watchAdsNum': lwg.Global._watchAdsNum,
                    '_gameOverAdvModel': lwg.Global._gameOverAdvModel,
                    '_hotShareTime': lwg.Global._hotShareTime,
                };
                let data = JSON.stringify(storageData);
                Laya.LocalStorage.setJSON('storageData', data);
            }
            LocalStorage.addData = addData;
            function clearData() {
                Laya.LocalStorage.clear();
            }
            LocalStorage.clearData = clearData;
            function getData() {
                let storageData = Laya.LocalStorage.getJSON('storageData');
                if (storageData) {
                    let data = JSON.parse(storageData);
                    return data;
                }
                else {
                    lwg.Global._gameLevel = 1;
                    lwg.Global._goldNum = 0;
                    lwg.Global._buyNum = 1;
                    lwg.Global._currentPifu = lwg.Enum.PifuAllName[0];
                    lwg.Global._havePifu = ['01_xiaofu'];
                    lwg.Global._watchAdsNum = 0;
                    lwg.Global._gameOverAdvModel = 1;
                    lwg.Global._whetherAdv = false;
                    lwg.Global._hotShareTime = null;
                    return null;
                }
            }
            LocalStorage.getData = getData;
        })(LocalStorage = lwg.LocalStorage || (lwg.LocalStorage = {}));
        let Enum;
        (function (Enum) {
            let SceneName;
            (function (SceneName) {
                SceneName["UILoding"] = "UILoding";
                SceneName["UIStart"] = "UIStart";
                SceneName["UIMain"] = "UIMain";
                SceneName["UIVictory"] = "UIVictory";
                SceneName["UIDefeated"] = "UIDefeated";
                SceneName["UIExecutionHint"] = "UIExecutionHint";
                SceneName["UIPassHint"] = "UIPassHint";
                SceneName["UISet"] = "UISet";
                SceneName["UIPifu"] = "UIPifu";
                SceneName["UIPuase"] = "UIPuase";
                SceneName["UIShare"] = "UIShare";
                SceneName["UISmallHint"] = "UISmallHint";
                SceneName["UIXDpifu"] = "UIXDpifu";
                SceneName["UIPifuTry"] = "UIPifuTry";
                SceneName["UIRedeem"] = "UIRedeem";
                SceneName["UIAnchorXD"] = "UIAnchorXD";
            })(SceneName = Enum.SceneName || (Enum.SceneName = {}));
            let BesomMoveType;
            (function (BesomMoveType) {
                BesomMoveType["static"] = "static";
                BesomMoveType["connectStatic"] = "connectStatic";
                BesomMoveType["up"] = "up";
                BesomMoveType["left"] = "left";
                BesomMoveType["down"] = "down";
                BesomMoveType["right"] = "right";
                BesomMoveType["left_up"] = "left_up";
                BesomMoveType["right_up"] = "right_up";
                BesomMoveType["left_down"] = "left_down";
                BesomMoveType["right_down"] = "right_down";
            })(BesomMoveType = Enum.BesomMoveType || (Enum.BesomMoveType = {}));
            let BesomRotateType;
            (function (BesomRotateType) {
                BesomRotateType["static"] = "static";
                BesomRotateType["connectStatic"] = "connectStatic";
                BesomRotateType["inSky"] = "inSky";
                BesomRotateType["left"] = "left";
                BesomRotateType["right"] = "right";
            })(BesomRotateType = Enum.BesomRotateType || (Enum.BesomRotateType = {}));
            let HintDec;
            (function (HintDec) {
                HintDec[HintDec["\u91D1\u5E01\u4E0D\u591F\u4E86\uFF01"] = 0] = "\u91D1\u5E01\u4E0D\u591F\u4E86\uFF01";
                HintDec[HintDec["\u6CA1\u6709\u53EF\u4EE5\u8D2D\u4E70\u7684\u76AE\u80A4\u4E86\uFF01"] = 1] = "\u6CA1\u6709\u53EF\u4EE5\u8D2D\u4E70\u7684\u76AE\u80A4\u4E86\uFF01";
                HintDec[HintDec["\u6682\u65F6\u6CA1\u6709\u5E7F\u544A\uFF0C\u8FC7\u4F1A\u513F\u518D\u8BD5\u8BD5\u5427\uFF01"] = 2] = "\u6682\u65F6\u6CA1\u6709\u5E7F\u544A\uFF0C\u8FC7\u4F1A\u513F\u518D\u8BD5\u8BD5\u5427\uFF01";
                HintDec[HintDec["\u6682\u65E0\u76AE\u80A4!"] = 3] = "\u6682\u65E0\u76AE\u80A4!";
                HintDec[HintDec["\u6682\u65E0\u5206\u4EAB!"] = 4] = "\u6682\u65E0\u5206\u4EAB!";
                HintDec[HintDec["\u6682\u65E0\u63D0\u793A\u673A\u4F1A!"] = 5] = "\u6682\u65E0\u63D0\u793A\u673A\u4F1A!";
                HintDec[HintDec["\u89C2\u770B\u5B8C\u6574\u5E7F\u544A\u624D\u80FD\u83B7\u53D6\u5956\u52B1\u54E6\uFF01"] = 6] = "\u89C2\u770B\u5B8C\u6574\u5E7F\u544A\u624D\u80FD\u83B7\u53D6\u5956\u52B1\u54E6\uFF01";
                HintDec[HintDec["\u901A\u5173\u4E0A\u4E00\u5173\u624D\u80FD\u89E3\u9501\u672C\u5173\uFF01"] = 7] = "\u901A\u5173\u4E0A\u4E00\u5173\u624D\u80FD\u89E3\u9501\u672C\u5173\uFF01";
                HintDec[HintDec["\u5206\u4EAB\u6210\u529F\u540E\u624D\u80FD\u83B7\u53D6\u5956\u52B1\uFF01"] = 8] = "\u5206\u4EAB\u6210\u529F\u540E\u624D\u80FD\u83B7\u53D6\u5956\u52B1\uFF01";
                HintDec[HintDec["\u5206\u4EAB\u6210\u529F"] = 9] = "\u5206\u4EAB\u6210\u529F";
                HintDec[HintDec["\u6682\u65E0\u89C6\u9891\uFF0C\u73A9\u4E00\u5C40\u6E38\u620F\u4E4B\u540E\u5206\u4EAB\uFF01"] = 10] = "\u6682\u65E0\u89C6\u9891\uFF0C\u73A9\u4E00\u5C40\u6E38\u620F\u4E4B\u540E\u5206\u4EAB\uFF01";
                HintDec[HintDec["\u6D88\u80172\u70B9\u4F53\u529B\uFF01"] = 11] = "\u6D88\u80172\u70B9\u4F53\u529B\uFF01";
                HintDec[HintDec["\u4ECA\u65E5\u4F53\u529B\u798F\u5229\u5DF2\u9886\u53D6\uFF01"] = 12] = "\u4ECA\u65E5\u4F53\u529B\u798F\u5229\u5DF2\u9886\u53D6\uFF01";
                HintDec[HintDec["\u5206\u4EAB\u6210\u529F\uFF0C\u83B7\u5F97125\u91D1\u5E01\uFF01"] = 13] = "\u5206\u4EAB\u6210\u529F\uFF0C\u83B7\u5F97125\u91D1\u5E01\uFF01";
                HintDec[HintDec["\u9650\u5B9A\u76AE\u80A4\u5DF2\u7ECF\u83B7\u5F97\uFF0C\u8BF7\u524D\u5F80\u5546\u5E97\u67E5\u770B\u3002"] = 14] = "\u9650\u5B9A\u76AE\u80A4\u5DF2\u7ECF\u83B7\u5F97\uFF0C\u8BF7\u524D\u5F80\u5546\u5E97\u67E5\u770B\u3002";
                HintDec[HintDec["\u5206\u4EAB\u5931\u8D25\uFF01"] = 15] = "\u5206\u4EAB\u5931\u8D25\uFF01";
                HintDec[HintDec["\u5151\u6362\u7801\u9519\u8BEF\uFF01"] = 16] = "\u5151\u6362\u7801\u9519\u8BEF\uFF01";
            })(HintDec = Enum.HintDec || (Enum.HintDec = {}));
            let HintType;
            (function (HintType) {
                HintType[HintType["noGold"] = 0] = "noGold";
                HintType[HintType["noGetPifu"] = 1] = "noGetPifu";
                HintType[HintType["noAdv"] = 2] = "noAdv";
                HintType[HintType["noPifu"] = 3] = "noPifu";
                HintType[HintType["noShare"] = 4] = "noShare";
                HintType[HintType["noHint"] = 5] = "noHint";
                HintType[HintType["lookend"] = 6] = "lookend";
                HintType[HintType["nopass"] = 7] = "nopass";
                HintType[HintType["sharefail"] = 8] = "sharefail";
                HintType[HintType["sharesuccess"] = 9] = "sharesuccess";
                HintType[HintType["novideo"] = 10] = "novideo";
                HintType[HintType["consumeEx"] = 11] = "consumeEx";
                HintType[HintType["no_exemptExTime"] = 12] = "no_exemptExTime";
                HintType[HintType["shareyes"] = 13] = "shareyes";
                HintType[HintType["getXD"] = 14] = "getXD";
                HintType[HintType["sharefailNoAward"] = 15] = "sharefailNoAward";
                HintType[HintType["inputerr"] = 16] = "inputerr";
            })(HintType = Enum.HintType || (Enum.HintType = {}));
            let ClickType;
            (function (ClickType) {
                ClickType["noEffect"] = "noEffect";
                ClickType["largen"] = "largen";
                ClickType["balloon"] = "balloon";
                ClickType["beetle"] = "beetle";
            })(ClickType = Enum.ClickType || (Enum.ClickType = {}));
            let voiceUrl;
            (function (voiceUrl) {
                voiceUrl["btn"] = "voice/btn.wav";
                voiceUrl["bgm"] = "voice/bgm.mp3";
                voiceUrl["chijinbi"] = "voice/chijinbi.wav";
                voiceUrl["guoguan"] = "voice/guoguan.wav";
                voiceUrl["wancheng"] = "voice/wancheng.wav";
            })(voiceUrl = Enum.voiceUrl || (Enum.voiceUrl = {}));
            let PifuAllName;
            (function (PifuAllName) {
                PifuAllName[PifuAllName["01_xiaofu"] = 0] = "01_xiaofu";
                PifuAllName[PifuAllName["02_konglong"] = 1] = "02_konglong";
                PifuAllName[PifuAllName["03_xueren"] = 2] = "03_xueren";
                PifuAllName[PifuAllName["04_qipao"] = 3] = "04_qipao";
                PifuAllName[PifuAllName["05_qianxun"] = 4] = "05_qianxun";
                PifuAllName[PifuAllName["06_lvyifu"] = 5] = "06_lvyifu";
                PifuAllName[PifuAllName["07_maozi"] = 6] = "07_maozi";
                PifuAllName[PifuAllName["08_lufei"] = 7] = "08_lufei";
                PifuAllName[PifuAllName["09_chaoren"] = 8] = "09_chaoren";
            })(PifuAllName = Enum.PifuAllName || (Enum.PifuAllName = {}));
            let PifuAllName_Ch;
            (function (PifuAllName_Ch) {
                PifuAllName_Ch[PifuAllName_Ch["\u540C\u684C"] = 0] = "\u540C\u684C";
                PifuAllName_Ch[PifuAllName_Ch["\u5C0F\u6050\u9F99"] = 1] = "\u5C0F\u6050\u9F99";
                PifuAllName_Ch[PifuAllName_Ch["\u96EA\u4EBA"] = 2] = "\u96EA\u4EBA";
                PifuAllName_Ch[PifuAllName_Ch["\u557E\u557E"] = 3] = "\u557E\u557E";
                PifuAllName_Ch[PifuAllName_Ch["\u5C0F\u828A"] = 4] = "\u5C0F\u828A";
                PifuAllName_Ch[PifuAllName_Ch["\u9EA6\u5C14"] = 5] = "\u9EA6\u5C14";
                PifuAllName_Ch[PifuAllName_Ch["\u68D2\u7403\u5C0F\u5B50"] = 6] = "\u68D2\u7403\u5C0F\u5B50";
                PifuAllName_Ch[PifuAllName_Ch["\u9646\u80A5"] = 7] = "\u9646\u80A5";
                PifuAllName_Ch[PifuAllName_Ch["\u82F1\u96C4"] = 8] = "\u82F1\u96C4";
            })(PifuAllName_Ch = Enum.PifuAllName_Ch || (Enum.PifuAllName_Ch = {}));
            let PifuSkin;
            (function (PifuSkin) {
                PifuSkin[PifuSkin["pifu/pifu_01_xiaofu.png"] = 0] = "pifu/pifu_01_xiaofu.png";
                PifuSkin[PifuSkin["pifu/pifu_02_konglong.png"] = 1] = "pifu/pifu_02_konglong.png";
                PifuSkin[PifuSkin["pifu/pifu_03_xueren.png"] = 2] = "pifu/pifu_03_xueren.png";
                PifuSkin[PifuSkin["pifu/pifu_04_qipao.png"] = 3] = "pifu/pifu_04_qipao.png";
                PifuSkin[PifuSkin["pifu/pifu_05_qianxun.png"] = 4] = "pifu/pifu_05_qianxun.png";
                PifuSkin[PifuSkin["pifu/pifu_06_lvyifu.png"] = 5] = "pifu/pifu_06_lvyifu.png";
                PifuSkin[PifuSkin["pifu/pifu_07_maozi.png"] = 6] = "pifu/pifu_07_maozi.png";
                PifuSkin[PifuSkin["pifu/pifu_08_lufei.png"] = 7] = "pifu/pifu_08_lufei.png";
                PifuSkin[PifuSkin["pifu/pifu_09_chaoren.png"] = 8] = "pifu/pifu_09_chaoren.png";
            })(PifuSkin = Enum.PifuSkin || (Enum.PifuSkin = {}));
            let PifuSkin_No;
            (function (PifuSkin_No) {
                PifuSkin_No[PifuSkin_No["pifu/pifu_01_xiaofu_h.png"] = 0] = "pifu/pifu_01_xiaofu_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_02_konglong_h.png"] = 1] = "pifu/pifu_02_konglong_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_03_xueren_h.png"] = 2] = "pifu/pifu_03_xueren_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_04_qipao_h.png"] = 3] = "pifu/pifu_04_qipao_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_05_qianxun_h.png"] = 4] = "pifu/pifu_05_qianxun_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_06_lvyifu_h.png"] = 5] = "pifu/pifu_06_lvyifu_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_07_maozi_h.png"] = 6] = "pifu/pifu_07_maozi_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_08_lufei_h.png"] = 7] = "pifu/pifu_08_lufei_h.png";
                PifuSkin_No[PifuSkin_No["pifu/pifu_09_chaoren_h.png"] = 8] = "pifu/pifu_09_chaoren_h.png";
            })(PifuSkin_No = Enum.PifuSkin_No || (Enum.PifuSkin_No = {}));
            let TaskType;
            (function (TaskType) {
                TaskType["topUp"] = "topUp";
                TaskType["move"] = "move";
                TaskType["continue"] = "continue";
                TaskType["gold"] = "gold";
            })(TaskType = Enum.TaskType || (Enum.TaskType = {}));
        })(Enum = lwg.Enum || (lwg.Enum = {}));
        let Click;
        (function (Click) {
            let ClickType;
            (function (ClickType) {
                ClickType["noEffect"] = "noEffect";
                ClickType["largen"] = "largen";
                ClickType["balloon"] = "balloon";
                ClickType["beetle"] = "beetle";
            })(ClickType = Click.ClickType || (Click.ClickType = {}));
            function on(effect, audioUrl, target, caller, down, move, up, out) {
                let btnEffect;
                if (audioUrl) {
                    Click.audioUrl = audioUrl;
                }
                else {
                    Click.audioUrl = Enum.voiceUrl.btn;
                }
                switch (effect) {
                    case 'noEffect':
                        btnEffect = new Btn_NoEffect();
                        break;
                    case 'largen':
                        btnEffect = new Btn_LargenEffect();
                        break;
                    case 'balloon':
                        btnEffect = new Btn_Balloon();
                        break;
                    case 'beetle':
                        btnEffect = new Btn_Beetle();
                        break;
                    default:
                        btnEffect = new Btn_LargenEffect();
                        break;
                }
                target.on(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
                target.on(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
                target.on(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
                target.on(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
            }
            Click.on = on;
            function off(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case 'largen':
                        btnEffect = new Btn_LargenEffect();
                        break;
                    case 'balloon':
                        btnEffect = new Btn_Balloon();
                        break;
                    case 'beetle':
                        btnEffect = new Btn_Beetle();
                        break;
                    default:
                        break;
                }
                target.off(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
                target.off(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
                target.off(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
                target.off(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
            }
            Click.off = off;
        })(Click = lwg.Click || (lwg.Click = {}));
        class Btn_NoEffect {
            constructor() {
            }
            down(event) {
                console.log('防止穿透！');
            }
            move(event) {
            }
            up(event) {
            }
            out(event) {
            }
        }
        lwg.Btn_NoEffect = Btn_NoEffect;
        class Btn_LargenEffect {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(1.1, 1.1);
                if (lwg.Global._voiceSwitch) {
                    Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
                }
            }
            move(event) {
                event.currentTarget.scale(1, 1);
            }
            up(event) {
                event.currentTarget.scale(1, 1);
            }
            out(event) {
                event.currentTarget.scale(1, 1);
            }
        }
        lwg.Btn_LargenEffect = Btn_LargenEffect;
        class Btn_Balloon {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click.balloonScale + 0.06, Click.balloonScale + 0.06);
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
            up(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
            move(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
            out(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
        }
        lwg.Btn_Balloon = Btn_Balloon;
        class Btn_Beetle {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click.beetleScale + 0.06, Click.beetleScale + 0.06);
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
            up(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
            move(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
            out(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
        }
        lwg.Btn_Beetle = Btn_Beetle;
        let Animation;
        (function (Animation) {
            function upDown_Rotate(node, time, func) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.upDown_Rotate = upDown_Rotate;
            function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func) {
                target.alpha = fAlpha;
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.scale_Alpha = scale_Alpha;
            function leftRight_Rotate(node, time, func) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                            }), 0);
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.leftRight_Rotate = leftRight_Rotate;
            function leftRight_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation.leftRight_Shake = leftRight_Shake;
            function upDwon_Shake(node, time, range, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }));
            }
            Animation.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.scale(0, 0);
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_FadeOut = move_FadeOut;
            function move_FadeOut_Scale(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_FadeOut_Scale = move_FadeOut_Scale;
            function drop_Simple(node, targetY, rotation, time, delayed, func) {
                Laya.Tween.to(node, { y: targetY, rotation: rotation }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
                target.alpha = fAlpha;
                target.y = firstY;
                Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, arr, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            let child = node.getChildByName(arr[i]);
                            if (child !== null) {
                                child['alpha'] = 0;
                            }
                        }
                    }
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            if (arr) {
                                for (let i = 0; i < arr.length; i++) {
                                    let child = node.getChildByName(arr[i]);
                                    if (child !== null) {
                                        child['alpha'] = 1;
                                    }
                                }
                            }
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2 !== null) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, arr, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            let child = node.getChildByName(arr[i]);
                            if (child !== null) {
                                child['alpha'] = 0;
                            }
                        }
                    }
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                if (arr) {
                                    for (let i = 0; i < arr.length; i++) {
                                        let child = node.getChildByName(arr[i]);
                                        if (child !== null) {
                                            child['alpha'] = 1;
                                        }
                                    }
                                }
                                if (func2 !== null) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Animation.move_changeRotate = move_changeRotate;
            function bombs_Appear(node, firstAlpha, firstScale, scale1, rotation, time1, time2, delayed, audioType, func) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, rotation: rotation }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.2, scaleY: firstScale + (scale1 - firstScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.bombs_Appear = bombs_Appear;
            function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.swell_shrink = swell_shrink;
            function move_Simple(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_Simple = move_Simple;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.blink_FadeOut = blink_FadeOut;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.HintAni_01 = HintAni_01;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Animation.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Animation = lwg.Animation || (lwg.Animation = {}));
        let PalyAudio;
        (function (PalyAudio) {
            function playSound(url, number) {
                if (lwg.Global._voiceSwitch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () { }));
                }
            }
            PalyAudio.playSound = playSound;
            function playMusic(url, number, deley) {
                if (lwg.Global._voiceSwitch) {
                    Laya.SoundManager.playMusic(url, number, Laya.Handler.create(this, function () { }), deley);
                }
            }
            PalyAudio.playMusic = playMusic;
            function stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            PalyAudio.stopMusic = stopMusic;
        })(PalyAudio = lwg.PalyAudio || (lwg.PalyAudio = {}));
        let Tools;
        (function (Tools) {
            function drawPieMask(parent, startAngle, endAngle) {
                parent.cacheAs = "bitmap";
                let drawPieSpt = new Laya.Sprite();
                drawPieSpt.blendMode = "destination-out";
                parent.addChild(drawPieSpt);
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }
            Tools.drawPieMask = drawPieMask;
            function transitionScreenPointfor3D(v3, camera) {
                let ScreenV3 = new Laya.Vector3();
                camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV3);
                let point = new Laya.Vector2();
                point.x = ScreenV3.x;
                point.y = ScreenV3.y;
                return point;
            }
            Tools.transitionScreenPointfor3D = transitionScreenPointfor3D;
            function random(n, m) {
                m = m || 10;
                const c = m - n + 1;
                return Math.floor(Math.random() * c + n);
            }
            Tools.random = random;
            function getRandomArrayElements(arr, count) {
                var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
                while (i-- > min) {
                    index = Math.floor((i + 1) * Math.random());
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }
                return shuffled.slice(min);
            }
            Tools.getRandomArrayElements = getRandomArrayElements;
            function getArrayDifElements(arr, count) {
                const result = [];
                let i = 0;
                for (i; i < count; i++) {
                    const temp = getDiffEle(arr.slice(), result, i);
                    result.push(temp);
                }
                return result;
            }
            Tools.getArrayDifElements = getArrayDifElements;
            function getDiffEle(arr, result, place) {
                let indexArr = [];
                let i = 0;
                for (i; i < arr.length - place; i++) {
                    indexArr.push(i);
                }
                const ranIndex = Math.floor(Math.random() * indexArr.length);
                if (result.indexOf(arr[ranIndex]) === -1) {
                    const backNum = arr[ranIndex];
                    arr[ranIndex] = arr[indexArr.length - 1];
                    return backNum;
                }
                else {
                    arr.splice(ranIndex, 1);
                    return getDiffEle(arr, result, place);
                }
            }
            Tools.getDiffEle = getDiffEle;
            Tools.roleDragCan = false;
            function copydata(obj) {
                const ret = {};
                Object.getOwnPropertyNames(obj).forEach(name => {
                    ret[name] = obj[name];
                });
                return ret;
            }
            Tools.copydata = copydata;
            function fillArray(value, len) {
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(value);
                }
                return arr;
            }
            Tools.fillArray = fillArray;
            function speedByAngle(angle, XY) {
                if (angle % 90 === 0 || !angle) {
                    console.error("计算的角度异常,需要查看：", angle);
                    return;
                }
                let speedXY = { x: 0, y: 0 };
                speedXY.y = XY.y;
                speedXY.x = speedXY.y / Math.tan(angle * Math.PI / 180);
                return speedXY;
            }
            Tools.speedByAngle = speedByAngle;
            function speedXYByAngle(angle, speed) {
                const speedXY = { x: 0, y: 0 };
                speedXY.x = speed * Math.cos(angle * Math.PI / 180);
                speedXY.y = speed * Math.sin(angle * Math.PI / 180);
                return speedXY;
            }
            Tools.speedXYByAngle = speedXYByAngle;
            function speedLabelByAngle(angle, speed, speedBate) {
                const speedXY = { x: 0, y: 0 };
                const selfAngle = angle;
                const defaultSpeed = speed;
                const bate = speedBate || 1;
                if (selfAngle % 90 === 0) {
                    if (selfAngle === 0 || selfAngle === 360) {
                        speedXY.x = Math.abs(defaultSpeed) * bate;
                    }
                    else if (selfAngle === 90) {
                        speedXY.y = Math.abs(defaultSpeed) * bate;
                    }
                    else if (selfAngle === 180) {
                        speedXY.x = -Math.abs(defaultSpeed) * bate;
                    }
                    else {
                        speedXY.y = -Math.abs(defaultSpeed) * bate;
                    }
                }
                else {
                    const tempXY = Tools.speedXYByAngle(selfAngle, defaultSpeed);
                    speedXY.x = tempXY.x;
                    speedXY.y = tempXY.y;
                    if (selfAngle > 0 && selfAngle < 180) {
                        speedXY.y = Math.abs(speedXY.y) * bate;
                    }
                    else {
                        speedXY.y = -Math.abs(speedXY.y) * bate;
                    }
                    if (selfAngle > 90 && selfAngle < 270) {
                        speedXY.x = -Math.abs(speedXY.x) * bate;
                    }
                    else {
                        speedXY.x = Math.abs(speedXY.x) * bate;
                    }
                }
                return speedXY;
            }
            Tools.speedLabelByAngle = speedLabelByAngle;
            function getRad(degree) {
                return degree / 180 * Math.PI;
            }
            Tools.getRad = getRad;
            function getRoundPos(angle, radius, centPos) {
                var center = centPos;
                var radius = radius;
                var hudu = (2 * Math.PI / 360) * angle;
                var X = center.x + Math.sin(hudu) * radius;
                var Y = center.y - Math.cos(hudu) * radius;
                return { x: X, y: Y };
            }
            Tools.getRoundPos = getRoundPos;
            function converteNum(num) {
                if (typeof (num) !== "number") {
                    console.warn("要转化的数字并不为number");
                    return num;
                }
                let backNum;
                if (num < 1000) {
                    backNum = "" + num;
                }
                else if (num < 1000000) {
                    backNum = "" + (num / 1000).toFixed(1) + "k";
                }
                else if (num < 10e8) {
                    backNum = "" + (num / 1000000).toFixed(1) + "m";
                }
                else {
                    backNum = "" + num;
                }
                return backNum;
            }
            Tools.converteNum = converteNum;
        })(Tools = lwg.Tools || (lwg.Tools = {}));
    })(lwg || (lwg = {}));

    class ADManager {
        constructor() {
        }
        static ShowBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.ShowBanner(p);
        }
        static CloseBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.RemoveBanner(p);
        }
        static ShowNormal() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static showNormal2() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static ShowReward(rewardAction, CDTime = 500) {
            if (ADManager.CanShowCD) {
                lwg.PalyAudio.stopMusic();
                console.log("?????");
                let p = new TJ.ADS.Param();
                p.extraAd = true;
                let getReward = false;
                p.cbi.Add(TJ.Define.Event.Reward, () => {
                    getReward = true;
                    lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
                    if (rewardAction != null)
                        rewardAction();
                });
                p.cbi.Add(TJ.Define.Event.Close, () => {
                    if (!getReward) {
                        lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
                        lwg.Global._createHint_01(lwg.Enum.HintType.lookend);
                    }
                });
                p.cbi.Add(TJ.Define.Event.NoAds, () => {
                    lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
                    lwg.Global._createHint_01(lwg.Enum.HintType.noAdv);
                });
                TJ.ADS.Api.ShowReward(p);
                ADManager.CanShowCD = false;
                setTimeout(() => {
                    ADManager.CanShowCD = true;
                }, CDTime);
            }
        }
        static Event(param, value) {
            console.log("Param:>" + param + "Value:>" + value);
            let p = new TJ.GSA.Param();
            if (value == null) {
                p.id = param;
            }
            else {
                p.id = param + value;
            }
            console.log(p.id);
            TJ.GSA.Api.Event(p);
        }
        static initShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.onShareAppMessage(() => {
                    return {
                        title: this.shareContent,
                        imageUrl: this.shareImgUrl,
                        query: ""
                    };
                });
                this.wx.showShareMenu({
                    withShareTicket: true,
                    success: null,
                    fail: null,
                    complete: null
                });
            }
        }
        static lureShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.shareAppMessage({
                    title: this.shareContent,
                    imageUrl: this.shareImgUrl,
                    query: ""
                });
            }
        }
        static VibrateShort() {
            TJ.API.Vibrate.Short();
        }
        static Vibratelong() {
            TJ.API.Vibrate.Long();
        }
        static TAPoint(type, name) {
            let p = new TJ.API.TA.Param();
            p.id = name;
            switch (type) {
                case TaT.BtnShow:
                    TJ.API.TA.Event_Button_Show(p);
                    break;
                case TaT.BtnClick:
                    TJ.API.TA.Event_Button_Click(p);
                    break;
                case TaT.PageShow:
                    TJ.API.TA.Event_Page_Show(p);
                    break;
                case TaT.PageEnter:
                    TJ.API.TA.Event_Page_Enter(p);
                    break;
                case TaT.PageLeave:
                    TJ.API.TA.Event_Page_Leave(p);
                    break;
                case TaT.LevelStart:
                    TJ.API.TA.Event_Level_Start(p);
                    break;
                case TaT.LevelFail:
                    TJ.API.TA.Event_Level_Fail(p);
                    break;
                case TaT.LevelFinish:
                    TJ.API.TA.Event_Level_Finish(p);
                    break;
            }
        }
    }
    ADManager.CanShowCD = true;
    ADManager.wx = Laya.Browser.window.wx;
    ADManager.shareImgUrl = "http://image.tomatojoy.cn/6847506204006681a5d5fa0cd91ce408";
    ADManager.shareContent = "快把锅甩给队友！";
    var TaT;
    (function (TaT) {
        TaT[TaT["BtnShow"] = 0] = "BtnShow";
        TaT[TaT["BtnClick"] = 1] = "BtnClick";
        TaT[TaT["PageShow"] = 2] = "PageShow";
        TaT[TaT["PageEnter"] = 3] = "PageEnter";
        TaT[TaT["PageLeave"] = 4] = "PageLeave";
        TaT[TaT["LevelStart"] = 5] = "LevelStart";
        TaT[TaT["LevelFinish"] = 6] = "LevelFinish";
        TaT[TaT["LevelFail"] = 7] = "LevelFail";
    })(TaT || (TaT = {}));

    class RecordManager {
        constructor() {
            this.GRV = null;
            this.isRecordVideoing = false;
            this.isVideoRecord = false;
            this.videoRecordTimer = 0;
            this.isHasVideoRecord = false;
        }
        static Init() {
            RecordManager.grv = new TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo();
        }
        static startAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.grv == null)
                RecordManager.Init();
            if (RecordManager.recording)
                return;
            RecordManager.autoRecording = true;
            console.log("******************开始录屏");
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (!RecordManager.autoRecording) {
                console.log("RecordManager.autoRecording", RecordManager.autoRecording);
                return false;
            }
            RecordManager.autoRecording = false;
            RecordManager._end(false);
            if (Date.now() - RecordManager.lastRecordTime > 6000) {
                return true;
            }
            if (Date.now() - RecordManager.lastRecordTime < 3000) {
                console.log("小于3秒");
                return false;
            }
            return true;
        }
        static startRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.autoRecording) {
                this.stopAutoRecord();
            }
            RecordManager.recording = true;
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("time:" + (Date.now() - RecordManager.lastRecordTime));
            if (Date.now() - RecordManager.lastRecordTime <= 3000) {
                return false;
            }
            RecordManager.recording = false;
            RecordManager._end(true);
            return true;
        }
        static _start() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180s  ？？？？？");
            RecordManager.grv.Start(180);
        }
        static _end(share) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180结束 ？？？？？");
            RecordManager.grv.Stop(share);
        }
        static _share(type, successedAc, completedAc = null, failAc = null) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************吊起分享 ？？？？？", RecordManager.grv, RecordManager.grv.videoPath);
            if (RecordManager.grv.videoPath) {
                let p = new TJ.Platform.AppRt.Extern.TT.ShareAppMessageParam();
                p.extra.videoTopics = ["甩锅给队友", "回来吧刺激战场", "番茄小游戏", "抖音小游戏"];
                p.channel = "video";
                p.success = () => {
                    lwg.Global._createHint_01(lwg.Enum.HintType.sharesuccess);
                    successedAc();
                };
                p.fail = () => {
                    if (type === 'noAward') {
                        lwg.Global._createHint_01(lwg.Enum.HintType.sharefailNoAward);
                    }
                    else {
                        lwg.Global._createHint_01(lwg.Enum.HintType.sharefail);
                    }
                    failAc();
                };
                RecordManager.grv.Share(p);
            }
            else {
                lwg.Global._createHint_01(lwg.Enum.HintType.novideo);
            }
        }
    }
    RecordManager.recording = false;
    RecordManager.autoRecording = false;

    class UIDefeated extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            RecordManager.stopAutoRecord();
            this.self = this.owner;
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
        adaptive() {
            this.BtnLast.y = Laya.stage.height * 0.754;
            this.self['BtnShare'].y = Laya.stage.height * 0.754;
            this.BtnAgain.y = this.BtnLast.y - 103;
            this.self['Logo'].y = Laya.stage.height * 0.1718;
            this.self['P202'].y = Laya.stage.height * 0.4328;
        }
        openAni() {
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
        goldRes() {
            let goldLebel = this.GoldRes.getChildByName('Num');
            goldLebel.text = (lwg.Global._goldNum).toString();
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.BtnAgain, this, null, null, this.BtnAgainUp, null);
            lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.BtnLastUp, null);
            lwg.Click.on('largen', null, this.BtnSet, this, null, null, this.btnSetUP, null);
            lwg.Click.on('largen', null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
        }
        btnShareUp(event) {
            event.currentTarget.scale(1, 1);
            RecordManager._share('noAward', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUpFunc() {
            console.log('分享成功，只是没有奖励！');
        }
        BtnAgainUp(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
            lwg.Global._gameStart = true;
            lwg.Global._levelInformation();
        }
        BtnLastUp(event) {
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.advFunc();
            });
        }
        advFunc() {
            lwg.Global._openInterface('UIStart', this.self, f => {
                lwg.Global._gameLevel++;
                lwg.Global.UIMain['UIMain'].currentPifuSet();
            });
        }
        btnSetUP(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._openInterface('UISet', null, null);
        }
        onDisable() {
        }
    }

    class UIMain_Person extends Laya.Script3D {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
            this.selfScene = this.self.scene;
            this.head = this.self.getChildByName('head');
            this.rightArm = this.self.getChildByName('rightArm');
            this.rightUnder = this.rightArm.getChildByName('rightUnder');
            this.leftArm = this.self.getChildByName('leftArm');
            this.leftUnder = this.leftArm.getChildByName('leftUnder');
            this.leftUnderArmX = this.leftUnder.transform.localPositionX;
            this.leftUnderArmY = this.leftUnder.transform.localPositionY;
            this.leftUnderArmZ = this.leftUnder.transform.localPositionZ;
            this.rightUnderArmX = this.rightUnder.transform.localPositionX;
            this.rightUnderArmY = this.rightUnder.transform.localPositionY;
            this.rightUnderArmZ = this.rightUnder.transform.localPositionZ;
            this.self['UIMain_Person'] = this;
        }
        originalState() {
            let leftArm = this.leftArm;
            leftArm.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            let rightArm = this.rightArm;
            rightArm.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            this.leftUnder.transform.localPositionX = this.leftUnderArmX;
            this.leftUnder.transform.localPositionY = this.leftUnderArmY;
            this.leftUnder.transform.localPositionZ = this.leftUnderArmZ;
            this.rightUnder.transform.localPositionX = this.rightUnderArmX;
            this.rightUnder.transform.localPositionY = this.rightUnderArmY;
            this.rightUnder.transform.localPositionZ = this.rightUnderArmZ;
        }
        personLookAtBesom() {
            this.besom = this.selfScene['UIMain'].Besom;
            let selfVec = this.besom.transform.localPosition;
            this.head.transform.lookAt(selfVec, new Laya.Vector3(0, 1, 0));
            let e = this.head.transform.localRotationEuler.clone();
            e.x = e.x / 2;
            e.y = e.y / 2;
            e.z = e.z / 2;
            this.head.transform.localRotationEuler = e;
        }
        onUpdate() {
            this.personLookAtBesom();
        }
        onDisable() {
        }
    }

    class UIMain_Besom extends Laya.Script3D {
        constructor() {
            super();
            this.FPos = new Laya.Vector3();
            this.downAccelerated = 0;
        }
        onEnable() {
            this.self = this.owner;
            this.self['UIMain_Besom'] = this;
            this.selfScene = this.self.scene;
            this.transform = this.self.transform;
            this.firstPosX = this.transform.localPositionX;
            this.firstPosY = this.transform.localPositionY;
            this.firstPosZ = this.transform.localPositionZ;
            this.firstRotZ = this.transform.localRotationEulerZ;
            this.firstRotY = this.transform.localRotationEulerY;
            this.firstRotX = this.transform.localRotationEulerX;
            this.transform.localRotationEulerZ = 0;
            this.FPos = this.self.transform.localPosition;
        }
        initProperty() {
            this.self.transform.localPositionX = this.firstPosX;
            this.self.transform.localPositionY = this.firstPosY;
            this.self.transform.localPositionZ = this.firstPosZ;
            let e = this.self.transform.localRotationEuler;
            e.x = this.firstRotX;
            e.y = this.firstRotY;
            e.z = this.firstRotZ;
            this.self.transform.localRotationEuler = e;
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
            lwg.Global._besomRotate = lwg.Enum.BesomMoveType.static;
            this.downAccelerated = 0;
            this.timeAdd = 0;
            this.rotateAcc_01 = 0;
            this.rotateAcc_02 = 0;
            this.upAccelerated = 0;
        }
        rigParameters() {
            this.selfRig.detectCollisions = true;
            this.selfRig.friction = 100;
            this.selfRig.restitution = 0.1;
            this.selfRig.gravity = (new Laya.Vector3(0, 0, 0));
            this.selfRig.angularVelocity = new Laya.Vector3(0, 0, 0);
            this.selfRig.mass = 10;
        }
        onCollisionEnter(other) {
            console.log(other);
        }
        move_Static() {
            this.self.transform.position = this.FPos;
        }
        move_ConnectStatic() {
            this.besomNormalFollow();
        }
        move_Up() {
            if (this.upAccelerated < 0) {
                lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
            }
            this.self.transform.localPositionY += this.upAccelerated;
            this.upAccelerated -= 0.007;
            this.rotateAcc_01 = 0;
        }
        move_Down() {
            this.self.transform.localPositionY += this.downAccelerated;
            this.downAccelerated -= 0.0003;
        }
        move_Left() {
            this.besomNormalFollow();
        }
        move_Right() {
            this.besomNormalFollow();
        }
        move_Right_Up() {
        }
        move_Right_Down() {
        }
        move_Left_Up() {
        }
        move_Left_Down() {
        }
        besomNormalFollow() {
            this.targetHand = this.selfScene['UIMain'].targetHand;
            if (this.targetHand) {
                let position = this.targetHand.transform.position;
                this.self.transform.position = position;
            }
        }
        rotate_leftAndRight() {
            if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.right) {
                this.self.transform.localRotationEulerZ += this.rotateAcc_01;
                this.timeAddControl();
            }
            else if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.left) {
                this.self.transform.localRotationEulerZ += this.rotateAcc_01;
                this.timeAddControl();
            }
            else if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.connectStatic) {
                let rotate = this.self.transform.localRotationEulerZ;
                if (rotate > 0) {
                    this.rotateAcc_02 += 0.01;
                }
                else if (rotate <= 0) {
                    this.rotateAcc_02 -= 0.01;
                }
                this.self.transform.localRotationEulerZ += this.rotateAcc_02;
            }
        }
        timeAddControl() {
            this.timeAdd++;
            if (this.timeAdd > 0) {
                lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
            }
        }
        activityRestrictions() {
            let rote = this.transform.localRotationEuler;
            rote.x = 0;
            rote.y = 0;
            this.transform.localRotationEuler = rote;
            this.transform.localPositionZ = this.firstPosZ;
        }
        onUpdate() {
            if (!lwg.Global._gameStart) {
                return;
            }
            this.activityRestrictions();
            switch (lwg.Global._besomMove) {
                case lwg.Enum.BesomMoveType.static:
                    this.move_Static();
                    break;
                case lwg.Enum.BesomMoveType.connectStatic:
                    this.move_ConnectStatic();
                    break;
                case lwg.Enum.BesomMoveType.up:
                    this.move_Up();
                    break;
                case lwg.Enum.BesomMoveType.left:
                    this.move_Left();
                    break;
                case lwg.Enum.BesomMoveType.right:
                    this.move_Right();
                    break;
                case lwg.Enum.BesomMoveType.down:
                    this.move_Down();
                    break;
                case lwg.Enum.BesomMoveType.right_up:
                    this.move_Right_Up();
                    break;
                case lwg.Enum.BesomMoveType.right_down:
                    this.move_Right_Down();
                    break;
                case lwg.Enum.BesomMoveType.left_up:
                    this.move_Left_Up();
                    break;
                case lwg.Enum.BesomMoveType.left_down:
                    this.move_Left_Up();
                    break;
                default:
                    break;
            }
            this.rotate_leftAndRight();
        }
        onDisable() {
        }
    }

    class Hand extends Laya.Script3D {
        constructor() {
            super();
            this.compoundShape = new Laya.CompoundColliderShape();
            this.longest = 0.375;
            this.shortest = 0.21;
        }
        onEnable() {
            this.self = this.owner;
            this.selfScene = this.self.scene;
            this.Besom = this.selfScene.getChildByName('Besom');
            this.palm = this.self.getChildByName('palm');
            this.palmLPx = this.palm.transform.localPositionX;
            this.palmLPy = this.palm.transform.localPositionY;
            this.palmLPz = this.palm.transform.localPositionZ;
            this.firstLPx = this.self.transform.localPositionX;
            this.firstLPy = this.self.transform.localPositionY;
            this.firstLPz = this.self.transform.localPositionZ;
            let firstLREx = this.self.transform.localRotationEulerX;
            let firstLREy = this.self.transform.localRotationEulerY;
            let firstLREz = this.self.transform.localRotationEulerZ;
            this.firstLRE = new Laya.Vector3(firstLREx, firstLREy, firstLREz);
            this.lopState = true;
            this.self['UIMain_Hand'] = this;
        }
        firstState() {
            this.self.transform.localPositionX = this.firstLPx;
            this.self.transform.localPositionY = this.firstLPy;
            this.self.transform.localPositionZ = this.firstLPz;
            this.self.transform.localRotationEuler = this.firstLRE;
            let e = this.palm.transform.localRotationEuler.clone();
            e.x = 0;
            e.y = 0;
            e.z = 0;
            this.palm.transform.localRotationEuler = e;
            this.palm.transform.localPositionX = this.palmLPx;
            this.palm.transform.localPositionY = this.palmLPy;
            this.palm.transform.localPositionZ = this.palmLPz;
            this.selfScene['UIMain'].Person['UIMain_Person'].originalState();
            this.lopState = true;
        }
        onTriggerEnter(other) {
            this.handName = this.self.name;
            this.bottomPosition();
            lwg.Global._connectState = true;
            lwg.Global._firstConnect = true;
            console.log(other);
        }
        BesomHandLenCount() {
            let BesomVec = this.Besom.transform.localPosition;
            let handVec = this.self.transform.localPosition;
            let p = new Laya.Vector3();
            Laya.Vector3.subtract(BesomVec, handVec, p);
            let lenp = Laya.Vector3.scalarLength(p);
            return lenp;
        }
        BesomPedestalHandLenCount() {
            let BesomPedestal = this.Besom.getChildByName('pedestal');
            let BesomPedestalVec = BesomPedestal.transform.position;
            let handVec = this.self.transform.position;
            let p = new Laya.Vector3();
            Laya.Vector3.subtract(BesomPedestalVec, handVec, p);
            let lenp = Laya.Vector3.scalarLength(p);
            return lenp;
        }
        bottomPosition() {
            if (!this.BesomHandleLen) {
                return;
            }
            let l_01 = this.BesomHandleLen;
            let l_02 = Math.abs(this.Besom.transform.localPositionY - this.self.transform.localPositionY);
            let l_03;
            if (Math.pow(l_01, 2) - Math.pow(l_02, 2) < 0) {
                l_03 = 0;
            }
            else {
                l_03 = Math.sqrt(Math.pow(l_01, 2) - Math.pow(l_02, 2));
            }
            let BesomBottomX;
            if (this.Besom.transform.localRotationEulerX > 0) {
                BesomBottomX = this.Besom.transform.localPositionX + l_03;
            }
            else {
                BesomBottomX = this.Besom.transform.localPositionX - l_03;
            }
            let offsetX = this.self.transform.localPositionX - BesomBottomX;
            this.Besom.transform.localPositionX += offsetX;
            return offsetX;
        }
        armLookAtHand() {
            let handVec = this.self.transform.position;
            let leftArm = this.selfScene['UIMain'].Person['UIMain_Person'].leftArm;
            if (this.self.name === 'leftHand') {
                leftArm.transform.lookAt(handVec, new Laya.Vector3(0, 1, 0));
                this.armDirection(leftArm);
                let armVec = leftArm.transform.position;
                this.palm.transform.lookAt(armVec, new Laya.Vector3(0, 1, 0));
                this.palmDirection();
                this.handDistance(armVec, handVec);
            }
            let rightArm = this.selfScene['UIMain'].Person['UIMain_Person'].rightArm;
            if (this.self.name === 'rightHand') {
                rightArm.transform.lookAt(handVec, new Laya.Vector3(0, 1, 0));
                this.armDirection(rightArm);
                let armVec = rightArm.transform.position;
                this.palm.transform.lookAt(armVec, new Laya.Vector3(0, 1, 0));
                this.palmDirection();
                this.handDistance(armVec, handVec);
            }
        }
        armDirection(arm) {
            let e = arm.transform.localRotationEuler.clone();
            let x = e.x;
            let y = e.y;
            let z = e.z;
            if (arm.name === 'rightArm') {
                e.x = x + 85;
                e.y = y + 19;
                e.z = z + 30;
            }
            else {
                e.x = x + 85;
                e.y = y - 15;
                e.z = z - 26;
            }
            arm.transform.localRotationEuler = e;
        }
        palmDirection() {
            let e = this.palm.transform.localRotationEuler.clone();
            let x = e.x;
            let y = e.y;
            let z = e.z;
            if (this.self.name === 'rightHand') {
                e.x = x + 90;
                e.y = y;
                e.z = z - 160;
            }
            else {
                e.x = x + 90;
                e.y = y;
                e.z = z + 168;
            }
            this.palm.transform.localRotationEuler = e;
        }
        handDistance(armVec, handVec) {
            let p = new Laya.Vector3();
            Laya.Vector3.subtract(handVec, armVec, p);
            let lenP = Laya.Vector3.scalarLength(p);
            let normalizP = new Laya.Vector3();
            Laya.Vector3.normalize(p, normalizP);
            if (lenP > this.longest) {
                let x = armVec.x + normalizP.x * this.longest;
                let y = armVec.y + normalizP.y * this.longest;
                let z = armVec.z + normalizP.z * this.longest;
                this.self.transform.position.x = x;
                this.self.transform.position.y = y;
            }
            let moveL;
            moveL = (lenP / this.longest) * (this.longest - this.shortest);
            if (this.self.name === 'rightHand') {
                let rightUnder = this.selfScene['UIMain'].Person['UIMain_Person'].rightUnder;
                let rightUnderArmY = this.selfScene['UIMain'].Person['UIMain_Person'].rightUnderArmY;
                let rightUnderArmX = this.selfScene['UIMain'].Person['UIMain_Person'].rightUnderArmX;
                rightUnder.transform.localPositionY = rightUnderArmY - moveL * 40;
                rightUnder.transform.localPositionX = rightUnderArmX - 1.5;
            }
            else {
                let leftUnder = this.selfScene['UIMain'].Person['UIMain_Person'].leftUnder;
                let leftUnderArmY = this.selfScene['UIMain'].Person['UIMain_Person'].leftUnderArmY;
                let leftUnderArmX = this.selfScene['UIMain'].Person['UIMain_Person'].leftUnderArmX;
                leftUnder.transform.localPositionY = leftUnderArmY - moveL * 40;
                leftUnder.transform.localPositionX = leftUnderArmX + 1.5;
            }
        }
        onUpdate() {
            if (!this.lopState) {
                this.armLookAtHand();
            }
            let diffX = this.self.transform.position.x - this.Besom.transform.position.x;
            let diffY = this.self.transform.position.y - this.Besom.transform.position.y;
            if (Math.abs(diffX) < 0.09 && Math.abs(diffY) < 0.01 && lwg.Global._besomRotate !== lwg.Enum.BesomMoveType.up) {
                if (lwg.Global._besomRotate === lwg.Enum.BesomRotateType.static) {
                    let random = Math.floor(Math.random() * 2);
                    random === 0 ? lwg.Global._besomRotate = lwg.Enum.BesomRotateType.left : lwg.Global._besomRotate = lwg.Enum.BesomRotateType.right;
                    this.Besom['UIMain_Besom'].timeAdd = 0;
                    this.Besom['UIMain_Besom'].rotateAcc = 0;
                }
                lwg.Global._besomMove = lwg.Enum.BesomMoveType.connectStatic;
                lwg.Global._firstConnect = true;
                this.Besom['UIMain_Besom'].downAccelerated = 0;
                if (lwg.Global._taskPreTopYNum === 1) {
                    lwg.Global._taskPreTopYNum = 2;
                    console.log(lwg.Global._taskPreTopYNum);
                }
            }
        }
        onDisable() {
        }
    }

    class UIMain extends Laya.Script3D {
        constructor() {
            super();
            this.outs = new Array();
            this.moveSwitch = false;
        }
        ;
        ;
        ;
        ;
        ;
        ;
        ;
        ;
        onEnable() {
            this.GameScene = this.owner;
            this.GameScene['UIMain'] = this;
            this.Camera = this.GameScene.getChildAt(0);
            this.PersonParent = this.GameScene.getChildByName('PersonParent');
            this.Person_xiaofu = this.PersonParent.getChildByName('01_xiaofu');
            this.Person_konglong = this.PersonParent.getChildByName('02_konglong');
            this.Person_xueren = this.PersonParent.getChildByName('03_xueren');
            this.Person_qipao = this.PersonParent.getChildByName('04_qipao');
            this.Person_qianxun = this.PersonParent.getChildByName('05_qianxun');
            this.Person_lvyifu = this.PersonParent.getChildByName('06_lvyifu');
            this.Person_maozi = this.PersonParent.getChildByName('07_maozi');
            this.Person_lufei = this.PersonParent.getChildByName('08_lufei');
            this.Person_chaoren = this.PersonParent.getChildByName('09_chaoren');
            this.currentPifuSet();
            this.Besom = this.GameScene.getChildByName('Besom');
            this.Besom.addComponent(UIMain_Besom);
            this.BesomRig = this.Besom.getComponent(Laya.Rigidbody3D);
            lwg.Global._besomMove = lwg.Enum.BesomMoveType.static;
            this.GoldParent = this.GameScene.getChildByName('GoldParent');
            this.goldTem = this.GoldParent.getChildByName('goldTem');
            this.goldTem.removeSelf();
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            this.addMouseEvent();
            this.targetHand = null;
        }
        currentPifuSet() {
            this.PersonParent.removeChildren(0, this.PersonParent.numChildren - 1);
            console.log(lwg.Global._currentPifu);
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
            this.Person = this.PersonParent.getChildAt(0);
            let scriptPerson = this.Person.getComponent(UIMain_Person);
            if (!scriptPerson) {
                this.Person.addComponent(UIMain_Person);
            }
            this.rightHand = this.Person.getChildByName('rightHand');
            let scriptRightHand = this.rightHand.getComponent(Hand);
            if (!scriptRightHand) {
                this.rightHand.addComponent(Hand);
            }
            this.leftHand = this.Person.getChildByName('leftHand');
            let scriptLeftHand = this.leftHand.getComponent(Hand);
            if (!scriptLeftHand) {
                this.leftHand.addComponent(Hand);
            }
        }
        addMouseEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        }
        onMouseDown() {
            if (!lwg.Global._gameStart) {
                return;
            }
            lwg.Global._timeLineSwitch = true;
            if (lwg.Global._clickScreenNum === 0) {
                lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
            }
            lwg.Global._clickScreenNum++;
            this.firstX = Laya.MouseManager.instance.mouseX;
            this.firstY = Laya.MouseManager.instance.mouseY - 100;
            this.Camera.viewportPointToRay(new Laya.Vector2(this.firstX, this.firstY), this._ray);
            this.GameScene.physicsSimulation.rayCastAll(this._ray, this.outs);
            if (this.outs.length != 0) {
                for (var i = 0; i < this.outs.length; i++) {
                    let hitResult = this.outs[i].collider.owner;
                    if (hitResult.name === 'screen') {
                        this.moveSwitch = true;
                        let stageWidth = Laya.stage.width;
                        if (this.firstX > stageWidth / 2) {
                            this.targetHand = this.rightHand;
                            this.leftHand['UIMain_Hand'].firstState();
                        }
                        else {
                            this.targetHand = this.leftHand;
                            this.rightHand['UIMain_Hand'].firstState();
                        }
                        this.targetHand.transform.position = this.outs[i].point;
                        this.targetHand['UIMain_Hand'].armLookAtHand();
                        this.targetHand['UIMain_Hand'].lopState = false;
                    }
                }
            }
        }
        onMouseMove() {
            if (!this.moveSwitch) {
                return;
            }
            let x = Laya.MouseManager.instance.mouseX;
            let y = Laya.MouseManager.instance.mouseY - 100;
            let differenceX;
            let differenceY;
            if (this.firstX && this.firstY) {
                differenceX = this.firstX - x;
                differenceY = this.firstY - y;
            }
            else {
                this.firstX = Laya.MouseManager.instance.mouseX;
                this.firstY = Laya.MouseManager.instance.mouseY - 100;
                return;
            }
            let moveX = differenceX / 900;
            let moveY = differenceY / 900;
            this.firstX = x;
            this.firstY = y;
            let handPosition = new Laya.Vector3(moveX, moveY, 0);
            this.targetHand.transform.translate(handPosition, false);
            if (moveY < -0.03 && lwg.Global._besomMove === lwg.Enum.BesomMoveType.connectStatic) {
                lwg.Global._besomMove = lwg.Enum.BesomMoveType.down;
                this.Besom['UIMain_Besom'].downAccelerated = 0;
            }
            if (moveY > 0.03 && lwg.Global._besomMove === lwg.Enum.BesomMoveType.connectStatic) {
                console.log('颠起！');
                this.Besom.transform.position.y += 5;
                lwg.Global._besomMove = lwg.Enum.BesomMoveType.up;
                let increment;
                increment = (moveY - 0.03);
                if (increment > 0.021) {
                    increment = 0.021;
                }
                this.Besom['UIMain_Besom'].upAccelerated = 0.07 + increment;
            }
            if (lwg.Global._besomMove === lwg.Enum.BesomMoveType.up || lwg.Global._besomMove === lwg.Enum.BesomMoveType.down) {
                lwg.Global._besomRotate = lwg.Enum.BesomRotateType.inSky;
            }
            else {
                if (moveX > 0.005) {
                    lwg.Global._besomRotate = lwg.Enum.BesomRotateType.left;
                    this.Besom['UIMain_Besom'].timeAdd = 0;
                    this.Besom['UIMain_Besom'].rotateAcc_01 = 0.4 + moveX * 30;
                    this.Besom['UIMain_Besom'].rotateAcc_02 = 0;
                }
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
                    }
                    else if (rotate <= 0) {
                        this.Besom['UIMain_Besom'].rotateAcc_02 = 0.8;
                    }
                    this.Besom['UIMain_Besom'].rotateAcc_02 = 0;
                }
            }
        }
        onMouseUp() {
            this.moveSwitch = false;
            lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
            this.Besom['UIMain_Besom'].rotateAcc = 0.1;
        }
        onMouseOut() {
            this.moveSwitch = false;
            lwg.Global._besomRotate = lwg.Enum.BesomRotateType.connectStatic;
            this.Besom['UIMain_Besom'].rotateAcc = 0.1;
        }
        taskcheck() {
            let type = lwg.Global._taskPreType;
            switch (type) {
                case lwg.Enum.TaskType.continue:
                    if (lwg.Global._gameTimeLine % 60 == 0) {
                        lwg.Global._taskPreTime = Number(lwg.Global._taskPreTime.substring(0, lwg.Global._taskPreTime.length - 1)) - 1 + 's';
                        if (lwg.Global._taskPreTime === '0s') {
                            console.log('坚持时间任务完成!');
                            this.taskSwitch();
                        }
                    }
                    break;
                case lwg.Enum.TaskType.topUp:
                    let pedestalP = this.Besom.getChildAt(2).transform.position;
                    let pedestalPY = lwg.Tools.transitionScreenPointfor3D(pedestalP, this.Camera).y;
                    if (pedestalPY < lwg.Global._taskPreTopY) {
                        lwg.Global._taskPreTopYNum = 1;
                        console.log('颠起高度达到了！，接到才算胜利');
                    }
                    if (lwg.Global._taskPreTopYNum === 2) {
                        console.log('颠起任务完成！');
                        this.taskSwitch();
                    }
                    break;
                case lwg.Enum.TaskType.move:
                    let BesomHeadP = this.Besom.getChildAt(0).transform.position;
                    let BesomHeadScreenP = lwg.Tools.transitionScreenPointfor3D(BesomHeadP, this.Camera);
                    let difX = BesomHeadScreenP.x - lwg.Global._taskPrePoint.x;
                    let difY = BesomHeadScreenP.y - lwg.Global._taskPrePoint.y;
                    let CountDown = lwg.Global.UITask['UITask'].CountDown;
                    let drawPie = lwg.Global.UITask['UITask'].drawPie;
                    if (Math.abs(difX) < 80 && Math.abs(difY) < 80) {
                        if (drawPie) {
                            if (drawPie.endAngle <= 0) {
                                this.taskSwitch();
                                CountDown.removeSelf();
                                console.log('移动任务完成！');
                            }
                            else {
                                CountDown.cacheAs = "none";
                                drawPie.endAngle -= 4;
                                CountDown.cacheAs = "bitmap";
                                if (drawPie.endAngle < 0) {
                                    drawPie.endAngle = 0;
                                }
                            }
                        }
                    }
                    else {
                        CountDown.cacheAs = "none";
                        drawPie.endAngle = 360;
                        CountDown.cacheAs = "bitmap";
                    }
                    break;
                case lwg.Enum.TaskType.gold:
                    if (lwg.Global._gameTimeLine % 60 === 0) {
                        lwg.Global._taskPreTime = Number(lwg.Global._taskPreTime.substring(0, lwg.Global._taskPreTime.length - 1)) - 1 + 's';
                        if (lwg.Global._taskPreTime === '0s' || this.GoldParent['_children'].length === 0) {
                            console.log('吃金币任务完成！');
                            this.taskSwitch();
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        taskSwitch() {
            lwg.Global._taskPreNum += 1;
            let sum = lwg.Global._taskContentArray.length;
            let num = lwg.Global._taskPreNum;
            if (num > sum) {
                let level = lwg.Global._gameLevel;
                if (lwg.Global._taskGoldBoo) {
                    this.GoldParent.removeChildren(0, this.GoldParent['_children'].length - 1);
                }
                this.defeatedDecide();
                lwg.Global._openInterface('UIVictory', null, null);
            }
            else {
                lwg.Global.UITask['UITask'].sontentSet();
            }
        }
        defeatedDecide() {
            this.moveSwitch = false;
            this.targetHand = null;
            lwg.Global._gameStart = false;
            lwg.Global._timeLineSwitch = false;
            lwg.Global._gameTimeLine = 0;
            lwg.Global._firstConnect = false;
        }
        onUpdate() {
            if (!lwg.Global._gameStart && !lwg.Global._timeLineSwitch) {
                return;
            }
            if (lwg.Global._gameTimeLine === 0) {
                lwg.Global._clickScreenNum = 0;
                lwg.Global._firstConnect = false;
                lwg.Global._besomMove = lwg.Enum.BesomMoveType.static;
                lwg.Global._besomRotate = lwg.Enum.BesomRotateType.static;
                lwg.Global._openInterface('UITask', null, null);
                this.Besom['UIMain_Besom'].initProperty();
            }
            lwg.Global._gameTimeLine++;
            if (lwg.Global._firstConnect) {
                this.taskcheck();
            }
            let absZ = Math.abs(this.Besom.transform.localRotationEulerZ);
            let posY = this.Besom.transform.localPositionY;
            if (posY < -3.8 || absZ > 80) {
                if (lwg.Global._taskGoldBoo) {
                    this.Besom['UIMain_Besom'].initProperty();
                }
                else {
                    this.defeatedDecide();
                    lwg.Global._openInterface('UIDefeated', null, null);
                }
            }
        }
        onDisable() {
        }
    }

    class UILoding extends Laya.Script {
        constructor() {
            super(...arguments);
            this.mianSceneOk = false;
        }
        onEnable() {
            this.self = this.owner;
            this.Progress = this.self['Progress'];
            this.Logo = this.self['Logo'];
            this.Word = this.self['Word'];
            this.Mask = this.self['Mask'];
            this.MaskMoveSwitch = false;
            this.adaptive();
            this.openAni();
        }
        adaptive() {
            this.Progress.y = Laya.stage.height * 0.7815;
            this.Word.y = this.Progress.y - 57.5;
            this.Logo.y = Laya.stage.height * 0.2787;
        }
        openAni() {
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
        openAniFunc() {
            this.dataLoading();
            this.MaskMoveSwitch = true;
        }
        dataLoading() {
            Laya.loader.load("Data/levelsData.json", Laya.Handler.create(this, this.levelsOnLoaded), null, Laya.Loader.JSON);
        }
        levelsOnLoaded() {
            lwg.Global._levelsData = Laya.loader.getRes("Data/levelsData.json")["RECORDS"];
            Laya.MouseManager.multiTouchEnabled = false;
            this.lodeUserInfo();
            this.lodeMianScene3D();
        }
        lodeMianScene3D() {
            Laya.Scene3D.load("testScene/LayaScene_GameMain/Conventional/GameMain.ls", Laya.Handler.create(this, this.mianSceneComplete));
        }
        mianSceneComplete(scene) {
            Laya.stage.addChildAt(scene, 0);
            scene.addComponent(UIMain);
            lwg.Global.UIMain = scene;
            this.Mask.x = -2;
            lwg.Global._openInterface('UIStart', this.self, f => {
            });
            this.mianSceneOk = true;
        }
        lodeUserInfo() {
            let data = lwg.LocalStorage.getData();
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
                }
                else {
                    lwg.Global._hotShare = false;
                    console.log('今天没有热门分享的机会！');
                }
            }
        }
        onUpdate() {
            if (this.MaskMoveSwitch) {
                if (this.Mask.x < -80) {
                    this.Mask.x += 5;
                }
            }
        }
        onDisable() {
            if (lwg.Global._voiceSwitch) {
                lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
            }
        }
    }

    class UIPifuTry extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
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
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
            this.self['P201_02'].y = Laya.stage.height * 0.1656;
            this.self['P201_01'].y = Laya.stage.height * 0.1656;
        }
        openAni() {
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
        noHaveSubChaoren() {
            let allArray = [];
            for (let i = 0; i < lwg.Global._allPifu.length; i++) {
                const element = lwg.Global._allPifu[i];
                allArray.push(element);
            }
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
            for (let k = 0; k < allArray.length; k++) {
                const element = allArray[k];
                if (element === '09_chaoren') {
                    allArray.splice(k, 1);
                }
                lwg.Global._notHavePifuSubChaoren = allArray;
                console.log(lwg.Global._notHavePifuSubChaoren);
            }
        }
        randomNoHave() {
            let len = lwg.Global._notHavePifuSubChaoren.length;
            if (len === 0) {
                this.self.close();
                lwg.Global._gameStart = true;
                return;
            }
            let random = Math.floor(Math.random() * len);
            let pifuName = lwg.Global._notHavePifu[random];
            let oder1 = lwg.Enum.PifuAllName[pifuName];
            this.pifuNum = oder1;
            this.Name.text = lwg.Enum.PifuAllName_Ch[oder1];
            let pifuImg = this.Pifu.getChildByName('img');
            let oder2 = lwg.Enum.PifuAllName[pifuName];
            pifuImg.skin = lwg.Enum.PifuSkin[oder2];
        }
        btnClickOn() {
            console.log(this.self['BtnAdv']);
            lwg.Click.on('largen', null, this.self['BtnClose'], this, null, null, this.btnCloseClickUp, null);
            lwg.Click.on('largen', null, this.self['BtnSelect'], this, null, null, this.btnAdvClickUp, null);
            lwg.Click.on('largen', null, this.self['BtnAdv'], this, null, null, this.btnAdvClickUp, null);
            lwg.Click.on('largen', null, this.BtnZanshi, this, null, null, this.btnAdvClickUp, null);
        }
        btnCloseClickUp(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
            lwg.Global._gameStart = true;
        }
        btnAdvClickUp(event) {
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.advFunc();
            });
        }
        advFunc() {
            let yuanpifu = lwg.Global._currentPifu;
            lwg.Global._currentPifu = lwg.Enum.PifuAllName[this.pifuNum];
            lwg.Global.UIMain['UIMain'].currentPifuSet();
            lwg.Global._currentPifu = yuanpifu;
            lwg.LocalStorage.addData();
            lwg.Global._gameStart = true;
            this.self.close();
        }
    }

    class UIPifu extends Laya.Script {
        constructor() {
            super();
            this.moveSwitch = false;
            this.listFirstIndex = lwg.Enum.PifuAllName[lwg.Global._currentPifu];
            this.noHaveIndex = 0;
        }
        onEnable() {
            this.self = this.owner;
            this.BtnBack = this.self['BtnBack'];
            this.BtnBuy = this.self['BtnBuy'];
            this.BtnSelect = this.self['BtnSelect'];
            this.PifuParent = this.self['PifuParent'];
            this.PifuList = this.self['PifuList'];
            this.PifuName = this.self['PifuName'];
            this.GoldRes = this.self['GoldRes'];
            this.PifuNum = this.self['PifuNum'];
            this.background = this.self['background'];
            this.noHaveSubChaoren();
            this.btnClickOn();
            this.createPifuList();
            this.goldRes();
            this.pifuNum();
            this.priceDisplay();
            this.adaptive();
            this.openAni();
        }
        priceDisplay() {
            let price = 250 * lwg.Global._buyNum - 150;
            let num = this.BtnBuy.getChildByName('Num');
            num.text = price.toString();
        }
        goldRes() {
            let goldLebel = this.GoldRes.getChildByName('Num');
            goldLebel.text = (lwg.Global._goldNum).toString();
        }
        pifuNum() {
            let pifuNumLebel = this.PifuNum.getChildByName('Num');
            pifuNumLebel.text = lwg.Global._havePifu.length + '/' + lwg.Global._allPifu.length;
        }
        noHaveSubChaoren() {
            let allArray = [];
            for (let i = 0; i < lwg.Global._allPifu.length; i++) {
                const element = lwg.Global._allPifu[i];
                allArray.push(element);
            }
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
            for (let k = 0; k < allArray.length; k++) {
                const element = allArray[k];
                if (element === '09_chaoren') {
                    allArray.splice(k, 1);
                }
                lwg.Global._notHavePifuSubChaoren = allArray;
                console.log(lwg.Global._notHavePifuSubChaoren);
            }
        }
        adaptive() {
            this.self['TowBtn'].y = Laya.stage.height * 0.822;
            this.PifuList.y = Laya.stage.height * 0.534;
            this.PifuName.y = Laya.stage.height * 0.264;
            console.log(this.self);
            this.self['P201'].y = Laya.stage.height * 0.18671875;
        }
        openAni() {
            let delayed = 100;
            let time = 200;
            let y2 = this.background.y;
            lwg.Animation.move_Deform_Y(this.background, -300, -15, y2, -0.1, 0.2, time, delayed * 1, f => {
            });
            let x1 = this.BtnBack.x;
            lwg.Animation.move_Deform_X(this.BtnBack, -200, 30, x1, -0.1, 0.2, time, delayed * 4, f => { });
            let x2 = this.GoldRes.x;
            lwg.Animation.move_Deform_X(this.GoldRes, 920, 30, x2, 0.2, -0.15, time, delayed * 3, f => { });
            let x3 = this.PifuName.x;
            lwg.Animation.move_Deform_X(this.PifuName, x3, 0, x3, 0.2, -0.15, time, delayed * 4, f => { });
            let x4 = this.BtnBuy.x;
            lwg.Animation.move_Deform_X(this.BtnBuy, x4, 0, x4, 0.2, -0.15, time, delayed * 4, f => { });
            let x5 = this.BtnSelect.x;
            lwg.Animation.move_Deform_X(this.BtnSelect, x5, 0, x5, 0.2, -0.15, time, delayed * 4, f => { });
            let y1 = this.PifuNum.y;
            lwg.Animation.move_Deform_Y(this.PifuNum, -300, -15, y1, -0.1, 0.2, time, delayed * 2, f => {
            });
            lwg.Animation.fadeOut(this.PifuList, 0, 1, time, delayed, f => {
                this.listOpenAni();
            });
        }
        createPifuList() {
            this.PifuList.hScrollBarSkin = "";
            this.PifuList.selectHandler = new Laya.Handler(this, this.onSelect_List);
            this.PifuList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.refreshListData();
            this.pifuNameRefresh();
        }
        listOpenAni() {
            if (0 <= this.listFirstIndex && this.listFirstIndex <= 4) {
                this.PifuList.scrollTo(this.PifuList.length - 1);
            }
            else {
                this.PifuList.scrollTo(0);
            }
            this.PifuList.tweenTo(this.listFirstIndex, 600);
        }
        refreshListData() {
            var data = [];
            for (var m = -1; m < 10; m++) {
                if (m === -1 || m === 9) {
                    data.push({
                        stance: true
                    });
                    continue;
                }
                let name = lwg.Global._allPifu[m];
                let have = false;
                for (let index = 0; index < lwg.Global._havePifu.length; index++) {
                    const element = lwg.Global._havePifu[index];
                    if (lwg.Global._allPifu[m] === lwg.Global._havePifu[index]) {
                        have = true;
                    }
                }
                let pifuUrl;
                let lock;
                if (have) {
                    pifuUrl = lwg.Enum.PifuSkin[m];
                    lock = false;
                }
                else {
                    pifuUrl = lwg.Enum.PifuSkin_No[m];
                    lock = true;
                }
                let select;
                if (lwg.Global._currentPifu === lwg.Enum.PifuAllName[m]) {
                    select = true;
                }
                else {
                    select = false;
                }
                let shadowUrl = 'pifu/ui_shadow.png';
                let scale;
                if (m === this.listFirstIndex) {
                    scale = 1;
                }
                else {
                    scale = 0.8;
                }
                data.push({
                    name,
                    have,
                    pifuUrl,
                    lock,
                    select,
                    shadowUrl,
                    scale
                });
            }
            this.PifuList.array = data;
        }
        onSelect_List(index) {
        }
        updateItem(cell, index) {
            let dataSource = cell.dataSource;
            let pifuImg = cell.getChildByName('PifuImg');
            let lock = cell.getChildByName('Lock');
            let select = cell.getChildByName('Select');
            let shadow = cell.getChildByName('Shadow');
            cell.name = dataSource.name;
            pifuImg.skin = dataSource.pifuUrl;
            lock.visible = dataSource.lock;
            select.visible = dataSource.select;
            shadow.skin = dataSource.shadowUrl;
            cell.scale(dataSource.scale, dataSource.scale);
        }
        onStageMouseDown() {
            this.firstX = Laya.MouseManager.instance.mouseX;
            this.moveSwitch = true;
        }
        onStageMouseUp() {
            let x = Laya.MouseManager.instance.mouseX;
            if (!this.moveSwitch) {
                return;
            }
            let diffX = x - this.firstX;
            if (diffX > 100) {
                this.listFirstIndex -= 1;
                if (this.listFirstIndex < 0) {
                    this.listFirstIndex = 0;
                }
            }
            else if (diffX < -100) {
                this.listFirstIndex += 1;
                if (this.listFirstIndex > 8) {
                    this.listFirstIndex = 8;
                }
            }
            this.moveSwitch = false;
            this.PifuList.tweenTo(this.listFirstIndex, 100, Laya.Handler.create(this, this.moveCompelet));
        }
        moveCompelet() {
            this.pifuNameRefresh();
            this.refreshListData();
            this.whetherHaveThisPifu();
        }
        pifuNameRefresh() {
            let name = this.PifuName.getChildAt(0);
            let num = this.listFirstIndex;
            if (lwg.Enum.PifuAllName[num]) {
                name.text = lwg.Enum.PifuAllName_Ch[num];
            }
        }
        whetherHaveThisPifu() {
            let cell = this.PifuList.getCell(this.listFirstIndex + 1);
            let boo = false;
            for (let index = 0; index < lwg.Global._havePifu.length; index++) {
                const pifuName = lwg.Global._havePifu[index];
                if (cell.name === pifuName) {
                    boo = true;
                }
            }
            if (boo) {
                this.showSelect = true;
                this.BtnSelect.skin = 'pifu/select_btn1.png';
            }
            else {
                this.showSelect = false;
                this.BtnSelect.skin = 'pifu/select_btn2.png';
            }
        }
        btnClickOn() {
            lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackClickUP, null);
            lwg.Click.on('largen', null, this.BtnBuy, this, null, null, this.btnBuyClickUP, null);
            lwg.Click.on('largen', null, this.BtnSelect, this, null, null, this.btnSelectClickUP, null);
        }
        btnBackClickUP(event) {
            event.stopPropagation();
            event.currentTarget.scale(1, 1);
            this.self.close();
            lwg.Global.UIMain['UIMain'].currentPifuSet();
            lwg.Global.UIStart['UIStart'].goldRes();
            lwg.LocalStorage.addData();
        }
        btnBuyClickUP(event) {
            event.currentTarget.scale(1, 1);
            event.stopPropagation();
            let price = 250 * lwg.Global._buyNum - 150;
            if (lwg.Global._goldNum < price || lwg.Global._notHavePifuSubChaoren.length <= 0) {
                if (lwg.Global._goldNum < price) {
                    lwg.Global._createHint_01(lwg.Enum.HintType.noGold);
                }
                else if (lwg.Global._notHavePifuSubChaoren.length <= 0) {
                    lwg.Global._createHint_01(lwg.Enum.HintType.noPifu);
                }
                return;
            }
            else {
                lwg.Global._goldNum -= price;
                lwg.Global._buyNum++;
                this.goldRes();
                let random = Math.floor(Math.random() * lwg.Global._notHavePifuSubChaoren.length);
                this.buyIndex = lwg.Enum.PifuAllName[lwg.Global._notHavePifuSubChaoren[random]];
                console.log('购买了第' + this.buyIndex + '位置的皮肤');
                this.nohavePifuAni();
            }
        }
        nohavePifuAni() {
            let noHavePifu_00 = lwg.Global._notHavePifuSubChaoren[this.noHaveIndex];
            console.log(noHavePifu_00);
            let index;
            if (noHavePifu_00) {
                index = lwg.Enum.PifuAllName[noHavePifu_00];
                this.listFirstIndex = index;
                this.refreshListData();
                this.pifuNameRefresh();
                this.PifuList.tweenTo(index, 200, Laya.Handler.create(this, function () {
                    this.noHaveIndex++;
                    this.nohavePifuAni();
                    this.pifuNameRefresh();
                }));
            }
            else {
                console.log('循环完毕，准备循环到被购买的那个皮肤', this.buyIndex);
                let time = this.buyIndex;
                this.PifuList.tweenTo(this.buyIndex, (11 - this.buyIndex) * 100, Laya.Handler.create(this, function () {
                    this.noHaveIndex = 0;
                    this.listFirstIndex = this.buyIndex;
                    this.buyCompelet();
                }));
            }
        }
        buyCompelet() {
            lwg.Global._havePifu.push(lwg.Enum.PifuAllName[this.buyIndex]);
            this.noHaveSubChaoren();
            this.pifuNum();
            this.pifuNameRefresh();
            this.refreshListData();
            this.whetherHaveThisPifu();
            this.priceDisplay();
            lwg.LocalStorage.addData();
            console.log('购买完成！');
        }
        btnSelectClickUP(event) {
            event.currentTarget.scale(1, 1);
            event.stopPropagation();
            let cell = this.PifuList.getCell(this.listFirstIndex + 1);
            let lock = cell.getChildByName('Lock');
            if (this.showSelect) {
                if (!lock.visible) {
                    let select1 = cell.getChildByName('Select');
                    select1.visible = false;
                    lwg.Global._currentPifu = lwg.Global._allPifu[this.listFirstIndex];
                    this.refreshListData();
                }
            }
        }
        onDisable() {
        }
    }

    class UISet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
            this.SceneContent = this.self['SceneContent'];
            this.BtnVoice = this.self['BtnVoice'];
            this.BtnShake = this.self['BtnShake'];
            this.BtnClose = this.self['BtnClose'];
            this.background = this.self['background'];
            this.btnVoiceAndBtnShake();
            this.adaptive();
            this.openAni();
        }
        adaptive() {
            this.SceneContent.y = Laya.stage.height / 2;
            this.SceneContent.x = Laya.stage.width / 2;
            this.self['P204'].y = Laya.stage.height - 75;
        }
        openAni() {
            let delayed = 150;
            let time = 200;
            let y1 = this.background.y;
            lwg.Animation.move_Deform_Y(this.background, -300, -15, y1, -0.1, 0.2, time, delayed, f => {
            });
            let y2 = this.SceneContent.y;
            lwg.Animation.move_Deform_Y(this.SceneContent, 1600, 15, y2, -0.1, 0.2, time, delayed * 2, f => {
                this.btnClickOn();
            });
            lwg.Animation.fadeOut(this.background, 0, 1, time, delayed, null);
            lwg.Animation.fadeOut(this.SceneContent, 0, 1, time, delayed, null);
        }
        openAniFunc() {
            this.btnClickOn();
        }
        btnVoiceAndBtnShake() {
            let voiceImg = this.BtnVoice.getChildAt(0);
            let voiceUrl1 = 'shezhi/icon_voiceon.png';
            let voiceUrl2 = 'shezhi/icon_voiceoff.png';
            if (lwg.Global._voiceSwitch) {
                voiceImg.skin = voiceUrl1;
            }
            else {
                voiceImg.skin = voiceUrl2;
            }
            let shakeImg = this.BtnShake.getChildAt(0);
            let shakeUrl1 = 'shezhi/shake_on.png';
            let shakeUrl2 = 'shezhi/shake_off.png';
            if (lwg.Global._shakeSwitch) {
                shakeImg.skin = shakeUrl1;
            }
            else {
                shakeImg.skin = shakeUrl2;
            }
        }
        btnClickOn() {
            lwg.Click.on('largen', null, this.BtnVoice, this, null, null, this.btnVoiceClickUP, null);
            lwg.Click.on('largen', null, this.BtnShake, this, null, null, this.btnShakeClickUP, null);
            lwg.Click.on('largen', null, this.BtnClose, this, null, null, this.btnCloseClickUP, null);
        }
        btnVoiceClickUP(event) {
            let voiceImg = this.BtnVoice.getChildAt(0);
            let voiceUrl1 = 'shezhi/icon_voiceon.png';
            let voiceUrl2 = 'shezhi/icon_voiceoff.png';
            if (voiceImg.skin === voiceUrl1) {
                voiceImg.skin = voiceUrl2;
                lwg.Global._voiceSwitch = false;
                lwg.PalyAudio.stopMusic();
            }
            else if (voiceImg.skin === voiceUrl2) {
                voiceImg.skin = voiceUrl1;
                lwg.Global._voiceSwitch = true;
                lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 0);
            }
        }
        btnShakeClickUP(event) {
            event.currentTarget.scale(1, 1);
            let img = this.BtnShake.getChildAt(0);
            let url1 = 'shezhi/shake_on.png';
            let url2 = 'shezhi/shake_off.png';
            if (img.skin === url1) {
                img.skin = url2;
                lwg.Global._shakeSwitch = false;
            }
            else if (img.skin === url2) {
                img.skin = url1;
                lwg.Global._shakeSwitch = true;
            }
        }
        btnCloseClickUP(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
        onDisable() {
        }
    }

    class UIShare extends Laya.Script {
        onEnable() {
            this.self = this.owner;
            this.adaptive();
            this.btnOnClick();
            this.goldRes();
        }
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
        }
        goldRes() {
            this.self['GoldNum'].text = lwg.Global._goldNum;
        }
        btnOnClick() {
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['background'], this, null, null, this.backgroundUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNoShare'], this, null, null, this.btnNoShareUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
        }
        backgroundUp(event) {
            console.log('点击背景也是分享！');
            RecordManager._share('award', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUp(event) {
            event.currentTarget.scale(1, 1);
            console.log('分享！');
            RecordManager._share('award', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUpFunc() {
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
        btnNoShareUp(event) {
            this.self.close();
            event.currentTarget.scale(1, 1);
        }
    }

    class UIStart extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
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
            this.noHaveSubChaoren();
            this.adaptive();
            this.openAni();
        }
        adaptive() {
            this.BtnStart.y = Laya.stage.height * 0.7171;
            this.self['P204'].y = Laya.stage.height - 75;
            this.self['P201_01'].y = Laya.stage.height * 0.245;
            this.self['P201_02'].y = Laya.stage.height * 0.245;
            this.self['P201_03'].y = Laya.stage.height * 0.37265625;
            this.self['P205'].y = Laya.stage.height * 0.505;
            this.BtnPifu.y = Laya.stage.height * 0.51875;
            this.BtnXianding.y = Laya.stage.height * 0.52109375;
            this.AccordingLv.y = Laya.stage.height * 0.1335;
        }
        openAni() {
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
        openAniFunc() {
            this.btnClickOn();
        }
        noHaveSubChaoren() {
            let allArray = [];
            for (let i = 0; i < lwg.Global._allPifu.length; i++) {
                const element = lwg.Global._allPifu[i];
                allArray.push(element);
            }
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
            for (let k = 0; k < allArray.length; k++) {
                const element = allArray[k];
                if (element === '09_chaoren') {
                    allArray.splice(k, 1);
                }
                lwg.Global._notHavePifuSubChaoren = allArray;
            }
        }
        pifuXianding() {
            if (lwg.Global._watchAdsNum >= 3) {
                this.BtnXianding.visible = false;
            }
        }
        goldRes() {
            let goldLebel = this.GoldRes.getChildByName('Num');
            goldLebel.text = (lwg.Global._goldNum).toString();
        }
        levelsDisplayFormat() {
            let baseboard = this.AccordingLv.getChildByName('Baseboard');
            let baseboard_shadow = this.AccordingLv.getChildByName('Baseboard_Shadow');
            let box = this.AccordingLv.getChildByName('Box');
            if (lwg.Global._gameLevel > 3) {
                baseboard.skin = 'zhujiemian/baseboard_02.png';
                baseboard_shadow.skin = 'zhujiemian/baseboard_shadow.png';
                this.AccordingLv.x = 360;
                box.x = 405;
            }
            else {
                baseboard.skin = 'zhujiemian/baseboard_03.png';
                baseboard_shadow.skin = 'zhujiemian/baseboard_shadow2.png';
                this.AccordingLv.x = 423;
                box.x = 282;
            }
            this.levelsAccording_4();
        }
        levelsAccording_4() {
            let currentNum;
            if (lwg.Global._gameLevel > 3) {
                currentNum = (lwg.Global._gameLevel + 1) % 4;
                if (currentNum === 0) {
                    currentNum = 4;
                }
            }
            else {
                currentNum = lwg.Global._gameLevel;
            }
            let cusNum = this.AccordingLv.getChildByName('CusNum');
            let selectedBase = this.AccordingLv.getChildByName('SelectedBase');
            for (let index = 0; index < cusNum.numChildren; index++) {
                const cus = cusNum.getChildAt(index);
                let base = selectedBase.getChildAt(index);
                let num = Number(cus.name.substring(3, 4));
                if (num === currentNum) {
                    cus.color = '#0d0d21';
                    cus.text = lwg.Global._gameLevel.toString();
                    if (lwg.Global._gameLevel === 3) {
                        base.skin = 'zhujiemian/ui_customs_circle02.png';
                    }
                }
                else {
                    let diff = num - currentNum;
                    if (diff > 0) {
                        cus.text = (lwg.Global._gameLevel + diff).toString();
                        base.visible = false;
                        cus.color = '#fff630';
                    }
                    else {
                        cus.text = (lwg.Global._gameLevel + diff).toString();
                        cus.color = '#0d0d21';
                    }
                }
            }
        }
        btnClickOn() {
            lwg.Click.on('largen', null, this.BtnStart, this, null, null, this.btnStartClickUp, null);
            lwg.Click.on('largen', null, this.BtnPifu, this, null, null, this.btnPifuClickUp, null);
            lwg.Click.on('largen', null, this.BtnSet, this, null, null, this.btnSetClickUp, null);
            lwg.Click.on('largen', null, this.BtnXianding, this, null, null, this.btnXiandingClickUp, null);
        }
        btnStartClickUp(event) {
            event.currentTarget.scale(1, 1);
            if (lwg.Global.pingceV) {
                lwg.Global._gameStart = true;
                return;
            }
            this.noHaveSubChaoren();
            if (lwg.Global._notHavePifuSubChaoren.length === 0) {
                lwg.Global._gameStart = true;
                RecordManager.startAutoRecord();
            }
            else {
                console.log('出现皮肤试用！');
                RecordManager.startAutoRecord();
                lwg.Global._openInterface('UIPifuTry', this.self, null);
            }
            this.self.close();
        }
        btnSetClickUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._openInterface('UISet', null, null);
        }
        btnPifuClickUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._openInterface('UIPifu_01', null, null);
        }
        btnXiandingClickUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._openInterface('UIXDpifu', this.self, null);
        }
        onDisable() {
        }
    }

    class UIMain_Gold extends Laya.Script3D {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
            let selfCol = this.self.getComponent(Laya.PhysicsCollider);
            selfCol.isTrigger = true;
        }
        onCollisionEnter(other) {
        }
        onTriggerStay(other) {
            console.log(other);
        }
        onDisable() {
        }
        onUpdate() {
            this.self.transform.localRotationEulerZ += 2;
            let besom = lwg.Global.UIMain['UIMain'].Besom;
            let besomHead = besom.getChildByName('head');
            let diffX = this.self.transform.position.x - besomHead.transform.position.x;
            let diffY = this.self.transform.position.y - besomHead.transform.position.y;
            if (Math.abs(diffX) < 0.10 && Math.abs(diffY) < 0.10) {
                lwg.Global._taskGoldNum++;
                this.self.removeSelf();
                lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.chijinbi, 1);
            }
        }
    }

    class UITask extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
            this.TaskTime = this.self['TaskTime'];
            this.Describe = this.self['Describe'];
            this.TaskNum = this.self['TaskNum'];
            this.TaskContent = this.self['TaskContent'];
            this.TaskLine = this.self['TaskLine'];
            this.TaskCircle = this.self['TaskCircle'];
            this.self['UITask'] = this;
            this.self = this.owner;
            this.sontentSet();
            this.adaptive();
        }
        adaptive() {
            this.self['Describe'].y = Laya.stage.height * 0.0265;
        }
        sontentSet() {
            console.log('重来');
            let num = lwg.Global._taskPreNum;
            if (num > lwg.Global._taskContentArray.length) {
                return;
            }
            let task = lwg.Global._taskContentArray[num - 1];
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
                    let randomX = this.TaskCircle.width / 2 + (Laya.stage.width - this.TaskCircle.width) * Math.random();
                    this.TaskCircle.x = randomX;
                    lwg.Global._taskPrePoint.x = this.TaskCircle.x;
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
        taskPromptStyle() {
            let len = this.TaskContent.text.length;
            if (len > 10) {
                let baseboard = this.Describe.getChildByName('baseboard');
                baseboard.width = 435;
                this.Describe.x = 142;
            }
            else {
                let baseboard = this.Describe.getChildByName('baseboard');
                baseboard.width = 360;
                this.Describe.x = 179;
            }
        }
        createCountDown() {
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
        goldLevelSet() {
            let goldTem = lwg.Global.UIMain['UIMain'].goldTem;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 10; j++) {
                    let gold = goldTem.clone();
                    let GoldParent = lwg.Global.UIMain['UIMain'].GoldParent;
                    GoldParent.addChild(gold);
                    gold.transform.localPositionX = goldTem.transform.localPositionX - j * 0.063;
                    gold.transform.localPositionY = goldTem.transform.localPositionY - i * 0.063;
                    gold.addComponent(UIMain_Gold);
                    let goldColl = gold.getComponent(Laya.PhysicsCollider);
                    goldColl.isTrigger = true;
                }
            }
            lwg.Global._taskGoldNum = 0;
        }
        onUpdate() {
            this.TaskTime.text = lwg.Global._taskPreTime;
            if (!lwg.Global._gameStart) {
                this.self.close();
            }
        }
    }

    class UIVictory extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            RecordManager.stopAutoRecord();
            this.self = this.owner;
            this.BtnGet = this.self['BtnGet'];
            this.AccordingLv = this.self['AccordingLv'];
            this.GoldRes = this.self['GoldRes'];
            this.GetGold = this.self['GetGold'];
            this.BtnSet = this.self['BtnSet'];
            this.BtnSelect = this.self['BtnSelect'];
            this.Logo = this.self['Logo'];
            this.SetBtn = this.self['SetBtn'];
            this.self['UIVictory'] = this;
            this.getGoldDisplay();
            this.accordingLv();
            this.goldRes();
            console.log('当前关卡是：' + lwg.Global._gameLevel);
            if (lwg.Global.pingceV) {
                let select = this.BtnSelect.getChildByName('select');
                select.visible = false;
                this.BtnSelect.visible = false;
            }
            this.adaptive();
            this.openAni();
            this.self['BtnNo'].visible = false;
            setTimeout(() => {
                this.self['BtnNo'].visible = true;
            }, lwg.Global._btnDelayed);
            lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.guoguan, 1);
        }
        adaptive() {
            this.GetGold.y = Laya.stage.height * 0.273;
            this.Logo.y = Laya.stage.height * 0.192;
            this.AccordingLv.y = Laya.stage.height * 0.110;
            this.SetBtn.y = Laya.stage.height * 0.762;
            this.self['P202'].y = Laya.stage.height * 0.494;
            this.self['BtnShare'].y = Laya.stage.height * 0.7539;
        }
        openAni() {
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
                    if (lwg.Global._hotShare) {
                        lwg.Global._openInterface(lwg.Enum.SceneName.UIShare, null, null);
                    }
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
        }
        openAniFunc() {
            this.btnClickOn();
        }
        getGoldDisplay() {
            let getLebel = this.GetGold.getChildByName('Num');
            let level = lwg.Global._gameLevel;
            if (lwg.Global._taskGoldBoo) {
                getLebel.text = lwg.Global._taskGoldNum.toString();
                console.log('金币关卡，共吃到金币为：' + getLebel.text);
            }
            else {
                getLebel.text = (25).toString();
                console.log('普通关卡奖励金币为：' + getLebel.text);
            }
        }
        goldRes() {
            let goldLebel = this.GoldRes.getChildByName('Num');
            goldLebel.text = (lwg.Global._goldNum).toString();
        }
        accordingLv() {
            let currentLv = this.AccordingLv.getChildByName('CurrentLv');
            currentLv.text = lwg.Global._gameLevel.toString();
            lwg.Global._gameLevel++;
            let nextLv = this.AccordingLv.getChildByName('NextLv');
            nextLv.text = lwg.Global._gameLevel.toString();
        }
        btnClickOn() {
            lwg.Click.on('largen', null, this.self['BtnAdv'], this, null, null, this.btnAdvUp, null);
            lwg.Click.on('noEffect', null, this.self['BtnNo'], this, this.btnNoUp, null, null, null);
            lwg.Click.on('largen', null, this.BtnSet, this, null, null, this.btnSetUP, null);
            lwg.Click.on('largen', null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
        }
        btnShareUp(event) {
            event.currentTarget.scale(1, 1);
            RecordManager._share('noAward', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUpFunc() {
            console.log('分享成功，只是没有奖励！');
        }
        btnNoUp(event) {
            event.currentTarget.scale(1, 1);
            let getLebel = this.GetGold.getChildByName('Num');
            lwg.Global._goldNum += Number(getLebel.text);
            lwg.LocalStorage.addData();
            this.self.close();
        }
        btnAdvUp(event) {
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.advFunc();
            });
        }
        advFunc() {
            let getLebel = this.GetGold.getChildByName('Num');
            lwg.Global._goldNum += Number(getLebel.text) * 10;
            lwg.Global.UIMain['UIMain'].currentPifuSet();
            lwg.LocalStorage.addData();
            if (lwg.Global.pingceV) {
                return;
            }
            this.self.close();
        }
        openPifuXianding() {
            if ((lwg.Global._gameLevel - 1) % lwg.Global._checkpointInterval === 1 && lwg.Global._watchAdsNum < 3) {
                lwg.Global._openInterface('UIXDpifu', null, null);
            }
            else {
                lwg.Global._openInterface('UIStart', this.self, f => { });
            }
        }
        btnSetUP(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._openInterface('UISet', null, null);
        }
        onDisable() {
            this.openPifuXianding();
        }
    }

    class UIXDpifu extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            this.self = this.owner;
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
        adaptive() {
            this.SceneContent.y = Laya.stage.height / 2;
        }
        openAni() {
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
        openAniFunc() {
            this.btnClickOn();
        }
        btnGetNum() {
            let num = this.BtnGet.getChildByName('Num');
            num.text = '(' + lwg.Global._watchAdsNum + '/' + 3 + ')';
        }
        btnClickOn() {
            lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackClickUp, null);
            lwg.Click.on('largen', null, this.BtnGet, this, null, null, this.btnGetClickUp, null);
        }
        btnBackClickUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Global._openInterface('UIStart', this.self, null);
        }
        btnGetClickUp(event) {
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.advFunc();
            });
        }
        advFunc() {
            lwg.Global._watchAdsNum += 1;
            this.btnGetNum();
            if (lwg.Global._watchAdsNum >= 3) {
                this.self.close();
                lwg.Global._havePifu.push('09_chaoren');
                lwg.Global._currentPifu = lwg.Enum.PifuAllName[8];
                lwg.Global.UIMain['UIMain'].currentPifuSet();
                lwg.Global.UIStart['UIStart'].pifuXianding();
                lwg.LocalStorage.addData();
            }
        }
        onDisable() {
        }
    }

    class HintPre extends Laya.Script {
        constructor() { super(); }
        onEnable() {
        }
        onDisable() {
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("TJ/Promo/script/PromoOpen.ts", PromoOpen);
            reg("TJ/Promo/script/ButtonScale.ts", ButtonScale);
            reg("TJ/Promo/script/PromoItem.ts", PromoItem);
            reg("TJ/Promo/script/P201.ts", P201);
            reg("TJ/Promo/script/P202.ts", P202);
            reg("TJ/Promo/script/P103.ts", P103);
            reg("TJ/Promo/script/P204.ts", P204);
            reg("TJ/Promo/script/P205.ts", P205);
            reg("TJ/Promo/script/P106.ts", P106);
            reg("script/Game/UIDefeated.ts", UIDefeated);
            reg("script/Game/UILoding.ts", UILoding);
            reg("script/Game/UIPifuTry.ts", UIPifuTry);
            reg("script/Game/UIPifu.ts", UIPifu);
            reg("script/Game/UISet.ts", UISet);
            reg("script/Game/UIShare.ts", UIShare);
            reg("script/Game/UIStart.ts", UIStart);
            reg("script/Game/UITask.ts", UITask);
            reg("script/Game/UIVictory.ts", UIVictory);
            reg("script/Game/UIXDpifu.ts", UIXDpifu);
            reg("script/Game/HintPre.ts", HintPre);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "sys/UILoding.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
