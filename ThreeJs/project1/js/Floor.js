class Floor {
    constructor(scene) {
        this.scene = scene;
    }

    // 建立地板
    createFloor() {
        const planeGeometry = new THREE.PlaneGeometry(60, 60);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.set(0, -7, 0);
        this.scene.add(this.plane);
    }

    // 設定地板接收陰影
    setFloorShadow() {
        this.plane.receiveShadow = true;
    }
}