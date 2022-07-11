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

    // 使用旋轉視角
    useCameraControl() {
        this.cameraControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // 啟用阻尼效果
        this.cameraControl.enableDamping = true;
        // 阻尼系數
        this.cameraControl.dampingFactor = 0.25;
        // 啟用自動旋轉
        this.cameraControl.autoRotate = true;
    }

    // 三軸座標輔助
    useAxesHelper() {
        const axes = new THREE.AxesHelper(20);
        this.scene.add(axes);
    }

    // 渲染
    render() {
        // 重複執行
        requestAnimationFrame(() => this.render());
        // 有使用旋轉視角在更新
        if(this.cameraControl !== undefined) {
            this.cameraControl.update();
        }
        // 若有使用 FPS 套件在耕莘
        if(this.stats !== undefined) {
            this.stats.update();
        }
        // 開始渲染
        this.renderer.render(this.scene, this.camera);
    }
}