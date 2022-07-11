class Light {
    constructor(scene) {
        this.scene = scene;
        this.rotateAngle = 0;
    }

    // 環境光
    useAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(this.ambientLight);
    }

    // 點光源
    usePointLight() {
        // 顏色, 強度, 距離
        this.pointLight = new THREE.PointLight(0xccffcc, 1, 100);
        this.pointLight.position.set(-10, 20, 20);
        this.scene.add(this.pointLight);

        // const pointLightHelper = new THREE.PointLightHelper(this.pointLight);
        // this.scene.add(pointLightHelper);
    }

    // 設定點光源的陰影
    setPointLightShaddow() {
        this.pointLight.castShadow = true;
    }

    // 小球體模擬點光源實體
    useSphereLightMesh() {
        const sphereLightGeo = new THREE.SphereGeometry(0.3);
        const sphereLightMat = new THREE.MeshBasicMaterial({ color: 0xccffcc });
        this.sphereLightMesh = new THREE.Mesh(sphereLightGeo, sphereLightMat);
        this.sphereLightMesh.castShadow = true;
        this.sphereLightMesh.position.y = 16;
        scene.add(this.sphereLightMesh);
    }

    // 聚光燈
    useSpotLight() {
        this.spotLight = new THREE.SpotLight(0xf0f0f0);
        this.spotLight.position.set(-10, 30, 20);
        this.scene.add(this.spotLight);
    }

    // 設定聚光燈的陰影
    setSpotLightShaddow() {
        this.spotLight.castShadow = true;
    }

    // 平行光
    useDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight(0xeeff00);
        this.directionalLight.position.set(-10, 20, 20);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);

        // const directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight);
        // this.scene.add(directionalLightHelper);
    }

    // 點光源繞 Y 軸旋轉動畫
    pointLightAnimation() {
        if (this.rotateAngle > 2 * Math.PI) {
            // 超過 360 度後歸零
            this.rotateAngle = 0;
        } else {
            // 遞增角度
            this.rotateAngle += 0.03;
        }

        // 光源延橢圓軌道繞 Y 軸旋轉
        this.sphereLightMesh.position.x = 8 * Math.cos(this.rotateAngle);
        this.sphereLightMesh.position.z = 4 * Math.sin(this.rotateAngle);

        // 點光源位置與球體同步
        this.pointLight.position.copy(this.sphereLightMesh.position);
    }

}