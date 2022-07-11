class Light {
    constructor(scene) {
        this.scene = scene;
    }

    // 環境光
    useAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
    }

    // 點光源
    usePointLight() {
        const pointLight = new THREE.PointLight(0xeeff00);
        pointLight.position.set(-10, 20, 20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(pointLight);
        this.scene.add(pointLightHelper);
    }

    // 聚光燈
    useSpotLight() {
        const spotLight = new THREE.SpotLight(0xffffff, 5, 100);
        spotLight.position.set(10, 20, 20);
        this.scene.add(spotLight);
    }

    // 平行光
    useDirectionalLight() {
        const directionalLight = new THREE.DirectionalLight(0xeeff00);
        directionalLight.position.set(-10, 20, 20);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        this.scene.add(directionalLightHelper);
    }
}