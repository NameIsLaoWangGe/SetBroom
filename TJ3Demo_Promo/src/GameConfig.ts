/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import PromoOpen from "./TJ/Promo/script/PromoOpen"
import ButtonScale from "./TJ/Promo/script/ButtonScale"
import PromoItem from "./TJ/Promo/script/PromoItem"
import P201 from "./TJ/Promo/script/P201"
import P202 from "./TJ/Promo/script/P202"
import P103 from "./TJ/Promo/script/P103"
import P204 from "./TJ/Promo/script/P204"
import P205 from "./TJ/Promo/script/P205"
import P106 from "./TJ/Promo/script/P106"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=720;
    static height:number=1280;
    static scaleMode:string="fixedauto";
    static screenMode:string="none";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="Promo.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("TJ/Promo/script/PromoOpen.ts",PromoOpen);
        reg("TJ/Promo/script/ButtonScale.ts",ButtonScale);
        reg("TJ/Promo/script/PromoItem.ts",PromoItem);
        reg("TJ/Promo/script/P201.ts",P201);
        reg("TJ/Promo/script/P202.ts",P202);
        reg("TJ/Promo/script/P103.ts",P103);
        reg("TJ/Promo/script/P204.ts",P204);
        reg("TJ/Promo/script/P205.ts",P205);
        reg("TJ/Promo/script/P106.ts",P106);
    }
}
GameConfig.init();