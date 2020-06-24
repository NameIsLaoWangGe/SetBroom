// import { ui } from "./../ui/layaMaxUI";
// import Hand from "./UIMain_Hand";
// import Besom from "./Besom";
// import GameControl from "./GameControl";
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
// export default class GameUI extends ui.test.TestSceneUI {
// 	private mat1: Laya.BlinnPhongMaterial;
// 	/**当前场景*/
// 	private gameScene: Laya.Scene3D;

// 	/**当前的角色*/
// 	private person: Laya.MeshSprite3D;

// 	/**右手*/
// 	private rightHand: Laya.MeshSprite3D;
// 	private rightHandRig: Laya.Rigidbody3D;

// 	/**右手*/
// 	private leftHand: Laya.MeshSprite3D;
// 	private leftHandRig: Laya.Rigidbody3D;

// 	/**当前选中的手*/
// 	private targetHand: Laya.MeshSprite3D;

// 	/**扫把*/
// 	private besom: Laya.MeshSprite3D;
// 	private besomRig: Laya.Rigidbody3D;

// 	/**摄像机*/
// 	private camera: Laya.Camera;

// 	/**射线*/
// 	private _ray: Laya.Ray;

// 	/**地面*/
// 	private ground: Laya.MeshSprite3D;

// 	/**射线扫描结果*/
// 	private outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();

// 	constructor() {
// 		super();
// 		// 加载prefab
// 		let selfScene = this.gameScene;
// 		Laya.Sprite3D.load("testScene/LayaScene_GameMain/Conventional/GameMain.ls", Laya.Handler.create(this, this.onComplete));
// 		//射线初始化（必须初始化）
// 		this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
// 	}

// 	/**
// 	 * 加载完成
// 	 */
// 	private onComplete(scene: Laya.Scene3D): void {
// 		// 将场景加到舞台上
// 		Laya.stage.addChild(scene);
// 		this.gameScene = scene;
// 		this.gameScene.addComponent(GameControl);

// 		this.camera = scene.getChildAt(0) as Laya.Camera;

// 		this.person = scene.getChildAt(2) as Laya.MeshSprite3D;

// 		this.rightHand = scene.getChildAt(3) as Laya.MeshSprite3D;
// 		this.rightHand.addComponent(Hand);
// 		this.rightHandRig = this.rightHand.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;

// 		this.leftHand = scene.getChildAt(4) as Laya.MeshSprite3D;
// 		this.leftHand.addComponent(Hand);
// 		this.leftHandRig = this.leftHand.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;

// 		this.besom = scene.getChildAt(5) as Laya.MeshSprite3D;
// 		this.besom.addComponent(Besom);
// 		this.besomRig = this.besom.getComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
// 		console.log(this.besom);

// 		this.addMouseEvent();
// 		// 关闭多点触控
// 		Laya.MouseManager.multiTouchEnabled = false;
// 	}

// 	/**鼠标事件监听*/
// 	private addMouseEvent(): void {
// 		Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
// 		Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
// 		Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
// 		Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
// 	}

// 	/**移动开关*/
// 	private moveSwitch: boolean = false;
// 	/**点击位置X记录*/
// 	private firstX;
// 	/**点击位置Y记录*/
// 	private firstY;
// 	/**按下*/
// 	private onMouseDown(): void {
// 		// 初始位置
// 		this.firstX = Laya.MouseManager.instance.mouseX;
// 		this.firstY = Laya.MouseManager.instance.mouseY;

// 		//产生射线
// 		//射线碰撞到挡屏，用来设置手的初始位置，挡屏的属性is trigger 要勾上，这样只检测碰撞，不产生碰撞反应
// 		this.camera.viewportPointToRay(new Laya.Vector2(this.firstX, this.firstY), this._ray);
// 		this.gameScene.physicsSimulation.rayCastAll(this._ray, this.outs);

// 		//找到挡屏的位置，把手的位置放在投屏位置的上方，也就是触摸点的上方
// 		if (this.outs.length != 0) {
// 			for (var i = 0; i < this.outs.length; i++) {
// 				//找到挡屏
// 				let hitResult = this.outs[i].collider.owner;
// 				if (hitResult.name === 'screen') {
// 					// 开启移动
// 					this.moveSwitch = true;
// 					//看自己点击的是屏幕的那边，如果是左边则操作左手，是右边则操作右手，不需要碰到手
// 					let stageWidth = Laya.stage.width;
// 					if (this.firstX > stageWidth / 2) {
// 						this.targetHand = this.rightHand;
// 						//另一只手回到初始位置
// 						this.leftHand['Hand'].firstState();
// 					} else {
// 						this.targetHand = this.leftHand;
// 						//另一只手回到初始位置
// 						this.rightHand['Hand'].firstState();
// 					}

// 					// 修正手的位置和角度
// 					let x = this.outs[i].point.x;
// 					let y = this.outs[i].point.y;
// 					let z = this.outs[i].point.z;
// 					this.targetHand.transform.localPositionX = x;
// 					this.targetHand.transform.localPositionY = y + 0.1;
// 					this.targetHand.transform.localPositionZ = z;

// 					// 手心的偏移修正
// 					let e = this.targetHand['Hand'].palm.transform.localRotationEuler;
// 					e.x = 90;
// 					this.targetHand['Hand'].palm.transform.localRotationEuler = e;

// 					// if (this.targetHand.name === 'rightHand') {
// 					// 	this.targetHand['Hand'].palm.transform.localPositionZ = this.targetHand['Hand'].palmLPz - 10;
// 					// } else {
// 					// 	this.targetHand['Hand'].palm.transform.localPositionZ = this.targetHand['Hand'].palmLPz + 6;
// 					// }

// 					this.targetHand['Hand'].lopState = false;
// 				}
// 			}
// 		}
// 	}

// 	/**
// 	 * 滑动屏幕
// 	 */
// 	private onMouseMove(): void {
// 		if (!this.moveSwitch) {
// 			return;
// 		}
// 		let x = Laya.MouseManager.instance.mouseX;
// 		let y = Laya.MouseManager.instance.mouseY;
// 		let differenceX;
// 		let differenceY;
// 		if (this.firstX && this.firstY) {
// 			differenceX = this.firstX - x;
// 			differenceY = this.firstY - y;
// 		} else {
// 			this.firstX = Laya.MouseManager.instance.mouseX;
// 			this.firstY = Laya.MouseManager.instance.mouseY;
// 			return;
// 		}
// 		let moveX = differenceX / 900;
// 		let moveY = differenceY / 900;
// 		this.firstX = x;
// 		this.firstY = y;

// 		//平移
// 		let handPosition = new Laya.Vector3(moveX, moveY, 0);
// 		let transformhand = this.targetHand.transform;
// 		transformhand.translate(handPosition);

// 		let connectSWicth = this.targetHand['Hand'].connectSWicth;
// 		if (connectSWicth) {
// 			let handX = this.targetHand.transform.localPositionX;
// 			let besomX = this.besom.transform.localPositionX;
// 			// let differenceX = this.targetHand['Hand'].palm.transform.localScaleX * 2 / 5;//二分之一宽度

// 			// 方向和位置矫正
// 			if (moveX > 0) {
// 				this.besomRig.angularVelocity = (new Laya.Vector3(0, 0, -0.4));
// 				this.besomRig.gravity = new Laya.Vector3(0.1, -2, 0);

// 			} else if (moveX < 0) {

// 				this.besomRig.angularVelocity = (new Laya.Vector3(0, 0, 0.4));
// 				this.besomRig.gravity = new Laya.Vector3(-0.1, -2, 0);
// 			} else if (moveX === 0) {

// 				this.besomRig.angularVelocity = new Laya.Vector3(0, 0, 0);
// 				this.besomRig.gravity = new Laya.Vector3(0, -2, 0);
// 			}
// 			// this.targetHand['Hand'].bottomPosition();
// 		}
// 	}

// 	/**
// 	 * 抬起
// 	 */
// 	private onMouseUp(): void {
// 		this.moveSwitch = false;
// 	}

// 	/**
// 	 * 抬起
// 	 */
// 	private onMouseOut(): void {
// 		this.moveSwitch = false;
// 	}
// }