export default class GoldPre extends Laya.Script {

    /**指代当前挂载脚本的节点*/
    private self;
    /**当前金币用于什么类型*/
    private type: string;
    /**时间线*/
    private timer: number;
    /**移动开关*/
    private moveSwitch: boolean;
    
    constructor() { super(); }

    onEnable(): void {

    }

    /**初始角度*/
    private startAngle: number;

    /**初始化*/


    onDisable(): void {
    }
}