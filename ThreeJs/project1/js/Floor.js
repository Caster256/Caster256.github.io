class Floor {
    constructor(scene) {
        this.scene = scene;
    }

    // 建立地板
    createFloor() {
        const planeGeometry = new THREE.PlaneGeometry(60, 60);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, -7, 0);
        this.scene.add(plane);
    }
}