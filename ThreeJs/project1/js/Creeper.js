class Creeper {
    constructor() {
        // 走動
        this.walkSpeed = 0;
        // 苦力怕擺頭的弧度值
        this.rotateHeadOffset = 0;
        // 膨脹
        this.scaleHeadOffset = 0;

        // 宣告頭、身體、腳幾何體大小
        const headGeo = new THREE.BoxGeometry(4, 4, 4);
        const bodyGeo = new THREE.BoxGeometry(4, 8, 2);
        const footGeo = new THREE.BoxGeometry(2, 3, 2);

        // 苦力怕臉部貼圖
        const headMap = new THREE.TextureLoader().load('images/creeper_face.png');
        // 苦力怕皮膚貼圖
        const skinMap = new THREE.TextureLoader().load('images/creeper_skin.png');

        // 身體與腳的材質設定
        const skinMat = new THREE.MeshPhongMaterial({
            map: skinMap // 皮膚貼圖
        });

        // 準備頭部與臉的材質
        const headMaterials = [];
        for (let i = 0; i < 6; i++) {
            let map;

            if (i === 4) map = headMap;
            else map = skinMap;

            headMaterials.push(new THREE.MeshPhongMaterial({ map: map }));
        }

        // 頭
        this.head = new THREE.Mesh(headGeo, headMaterials);
        this.head.position.set(0, 6, 0);
        // this.head.rotation.y = 0.5 // 稍微的擺頭

        // 身體
        this.body = new THREE.Mesh(bodyGeo, skinMat);
        this.body.position.set(0, 0, 0);

        // 四隻腳
        this.foot1 = new THREE.Mesh(footGeo, skinMat);
        this.foot1.position.set(-1, -5.5, 2);
        this.foot2 = this.foot1.clone();
        this.foot2.position.set(-1, -5.5, -2);
        this.foot3 = this.foot1.clone();
        this.foot3.position.set(1, -5.5, 2);
        this.foot4 = this.foot1.clone();
        this.foot4.position.set(1, -5.5, -2);

        // 將四隻腳組合為一個 group
        this.feet = new THREE.Group();
        this.feet.add(this.foot1);
        this.feet.add(this.foot2);
        this.feet.add(this.foot3);
        this.feet.add(this.foot4);

        // 將頭、身體、腳組合為一個 group
        this.creeper = new THREE.Group();
        this.creeper.add(this.head);
        this.creeper.add(this.body);
        this.creeper.add(this.feet);

        this.creeper.traverse(function(object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
    }

    // 苦力怕原地走動動畫
    creeperFeetWalk() {
        this.walkSpeed += 0.04;

        // 前腳左
        this.foot1.rotation.x = Math.sin(this.walkSpeed) / 4;
        // 後腳左
        this.foot2.rotation.x = -Math.sin(this.walkSpeed) / 4;
        // 前腳右
        this.foot3.rotation.x = -Math.sin(this.walkSpeed) / 4;
        // 後腳右
        this.foot4.rotation.x = Math.sin(this.walkSpeed) / 4;
    }

    // 苦力怕膨脹
    creeperScaleBody() {
        this.scaleHeadOffset += 0.04;
        let scaleRate = Math.abs(Math.sin(this.scaleHeadOffset)) / 16 + 1;
        this.creeper.scale.set(scaleRate, scaleRate, scaleRate);
    }
}