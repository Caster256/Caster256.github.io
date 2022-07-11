class Camera {
    constructor(scene) {
        this.scene = scene;
    }

    // 建立 3D 適用的相機
    createPerspectiveCamera(fov, near = 0.1, far = 1000) {
        // 摄像机视锥体的长宽比
        const aspect = window.innerWidth / window.innerHeight;

        // 參數：視角、長寬比、近面距離(可以拉多近)、遠面距離(拉多遠)
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // 忘了
        this.camera.position.set(30, 30, 30);
        this.camera.lookAt(this.scene.position);
    }

    // 回傳相機物件
    getCamera() {
        return this.camera;
    }
}