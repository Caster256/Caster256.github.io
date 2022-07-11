class Light {
    constructor(scene) {
        this.scene = scene;
    }

    // 使用光源
    useLight() {
        // soft white light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 5, 100);
        spotLight.position.set(10, 20, 20);
        this.scene.add(spotLight);
    }
}