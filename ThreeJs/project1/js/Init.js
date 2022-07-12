class Init {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.setRender();
    }

    // 渲染器設定
    setRender() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 設定陰影
    setRenderShadow() {
        // 設定需渲染陰影效果
        this.renderer.shadowMap.enabled = true;
        // 陰影的毛邊優化
        // THREE.BasicShadowMap = 0
        // THREE.PCFShadowMap = 1
        // THREE.PCFSoftShadowMap = 2
        this.renderer.shadowMap.type = 2;
    }

    // 取得渲染器
    getRender() {
        return this.renderer;
    }

    // 建立監測器(FPS)
    useFPS() {
        this.stats = new Stats();
        // FPS mode
        this.stats.setMode(0);
        document.getElementById('stats').appendChild(this.stats.domElement);
    }

    // 取得監測器物件
    getStats() {
        return this.stats;
    }

    // 使用旋轉視角
    useCameraControl() {
        this.cameraControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // 啟用阻尼效果
        this.cameraControl.enableDamping = true;
        // 阻尼系數
        this.cameraControl.dampingFactor = 0.25;
        // 啟用自動旋轉
        // this.cameraControl.autoRotate = true;
    }

    // 取得旋轉視角的控制器
    getCameraControl() {
        return this.cameraControl;
    }

    // 三軸座標輔助
    useAxesHelper() {
        const axes = new THREE.AxesHelper(20);
        this.scene.add(axes);
    }
}