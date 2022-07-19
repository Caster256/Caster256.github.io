// 正反向
let invert = 1;
// 移動
let tweenGo, tweenBack;
// 是否開始移動
let startTracking = false;
// 粒子的頂點集合
let points;
// 粒子的樣式
let material;
// 粒子的數量
const particleCount = 15000;
// 設定粒子的 skin
const textureLoader = new THREE.TextureLoader();
// 雪花
const snowTexture = textureLoader.load('images/snowflake.png');
// 雨滴
const rainTexture = textureLoader.load('images/raindrop-3.png');
// 播放音樂 DOM
const sound = document.querySelector('audio')
// 是否播放音樂
let musicPlayback = false;

/* 場景 */
const scene = new THREE.Scene();
// 霧化場景
scene.fog = new THREE.FogExp2(0x000000, 0.0008);

/* 相機 */
// 參數：視角、長寬比、近面距離(可以拉多近)、遠面距離(拉多遠)
const camera = new THREE.PerspectiveCamera(70, (window.innerWidth / window.innerHeight), 0.1, 2000);
camera.position.set(-100, 100, 200);
camera.lookAt(scene.position);

/* 三維輔助線 */
// const axes = new THREE.AxesHelper(20);
// scene.add(axes);

/* 啟用 FPS */
const stats = new Stats();
stats.setMode(0);
document.getElementById('stats').appendChild(stats.domElement);

/* 渲染器設定 */
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x111111, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// THREE.BasicShadowMap = 0
// THREE.PCFShadowMap = 1
// THREE.PCFSoftShadowMap = 2
renderer.shadowMap.type = 2;

/* 建立 OrbitControls,可以轉換視角 */
const cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
// 啟用阻尼效果
cameraControl.enableDamping = true;
// 阻尼系數
cameraControl.dampingFactor = 0.25;

/* 建立地板 */
const planeGeometry = new THREE.PlaneGeometry(300, 300);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, -7, 0);
// 陰影
plane.receiveShadow = true;
plane.name = 'floor';
scene.add(plane);

/* 建立光源 */
// 設置環境光提供輔助柔和白光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
// 設置聚光燈幫忙照亮物體
let spotLight = new THREE.SpotLight(0xf0f0f0);
spotLight.position.set(-10, 30, 20);
// scene.add(spotLight);
// 點光源
// 參數：顏色, 強度, 距離
let pointLight = new THREE.PointLight(0xf0f0f0, 1, 100);
// 投影
pointLight.castShadow = true;
pointLight.position.set(-30, 30, 30);
scene.add(pointLight);

/* 建立讓怪物跟隨相機的開關 */
let datGUIControls = new (function() {
    // 移動判斷
    this.startTracking = false
    // 音樂判斷
    this.togglePlayMusic = function() {
        if (musicPlayback) {
            sound.pause();
            musicPlayback = false;
        } else {
            sound.play();
            musicPlayback = true;
        }
    }
    // skin 判斷
    this.changeScene = function() {
        if (sceneType === 'SNOW') {
            material.map = rainTexture;
            material.size = 2;
            sceneType = 'RAIN';
        } else {
            material.map = snowTexture;
            material.size = 5;
            sceneType = 'SNOW';
        }
    }
})();

/* 建立雪花 */
createPoints();

/* 產生怪物 */
const creeperObj = new Creeper();
tweenHandler();
scene.add(creeperObj.creeper);

document.body.appendChild(renderer.domElement);

function tweenHandler() {
    let offset = { x: 0, z: 0, rotateY: 0 };
    // 目標值
    let target = { x: 20, z: 20, rotateY: 0.7853981633974484 };

    // 苦力怕走動及轉身補間動畫
    const onUpdate = () => {
        // 移動
        creeperObj.feet.position.x = offset.x;
        creeperObj.feet.position.z = offset.z;
        creeperObj.head.position.x = offset.x;
        creeperObj.head.position.z = offset.z;
        creeperObj.body.position.x = offset.x;
        creeperObj.body.position.z = offset.z;

        // 轉身
        if (target.x > 0) {
            creeperObj.feet.rotation.y = offset.rotateY;
            creeperObj.head.rotation.y = offset.rotateY;
            creeperObj.body.rotation.y = offset.rotateY;
        } else {
            creeperObj.feet.rotation.y = -offset.rotateY;
            creeperObj.head.rotation.y = -offset.rotateY;
            creeperObj.body.rotation.y = -offset.rotateY;
        }
    }

    // 計算新的目標值
    const handleNewTarget = () => {
        // 限制苦力怕走路邊界
        const range = 100;
        if (camera.position.x > range) target.x = range;
        else if (camera.position.x < -range) target.x = -range;
        else target.x = camera.position.x;
        if (camera.position.z > range) target.z = range;
        else if (camera.position.z < -range) target.z = -range;
        else target.z = camera.position.z;

        // 原點面向方向
        const v1 = new THREE.Vector2(0, 1);
        // 苦力怕面向新相機方向
        const v2 = new THREE.Vector2(target.x, target.z);

        // 內積除以純量得兩向量 cos 值
        let cosValue = v1.dot(v2) / (v1.length() * v2.length());

        // 防呆，cos 值區間為（-1, 1）
        if (cosValue > 1) cosValue = 1;
        else if (cosValue < -1) cosValue = -1;

        // cos 值求轉身角度
        target.rotateY = Math.acos(cosValue);
    }

    // 計算新的目標值
    const handleNewTweenBackTarget = () => {
        // 限制苦力怕走路邊界
        const range = 150;
        const tmpX = target.x;
        const tmpZ = target.z;

        target.x = THREE.Math.randFloat(-range, range);
        target.z = THREE.Math.randFloat(-range, range);

        const v1 = new THREE.Vector2(tmpX, tmpZ);
        const v2 = new THREE.Vector2(target.x, target.z);

        // 內積除以純量得兩向量 cos 值
        let cosValue = v1.dot(v2) / (v1.length() * v2.length());

        // 防呆，cos 值區間為（-1, 1）
        if (cosValue > 1) cosValue = 1;
        else if (cosValue < -1) cosValue = -1;

        // cos 值求轉身角度
        target.rotateY = Math.acos(cosValue);
    }

    // 朝相機移動
    tweenGo = new TWEEN.Tween(offset)
        .to(target, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
            handleNewTweenBackTarget();
            invert = -1;
            tweenBack.start();
        });

    // 回原點
    tweenBack = new TWEEN.Tween(offset)
        .to({ x: 0, z: 0, rotateY: 0 }, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
            // 計算新的目標值
            handleNewTarget();
            invert = 1;
            tweenGo.start();
        });
}

/* 建立開關 */
const gui = new dat.GUI();
gui.add(datGUIControls, 'togglePlayMusic');
gui.add(datGUIControls, 'changeScene');
gui.add(datGUIControls, 'startTracking').onChange(function(e) {
    startTracking = e
    if (invert > 0) {
        if (startTracking) {
            tween.start();
        } else {
            tween.stop();
        }
    } else {
        if (startTracking) {
            tweenBack.start();
        } else {
            tweenBack.stop();
        }
    }
});

// 粒子系統初始化
function createPoints() {
    const geometry = new THREE.BufferGeometry();
    material = new THREE.PointsMaterial({
        size: 5,
        map: snowTexture,
        blending: THREE.AdditiveBlending,
        // depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.5
    });

    const range = 600;
    let vertices = [];
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * range - range / 2;
        const y = Math.random() * range - range / 2;
        const z = Math.random() * range - range / 2;

        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    points = new THREE.Points(geometry, material);

    scene.add(points);
}

// 粒子系統動畫
function pointsAnimation() {
    const array = points.geometry.attributes['position'].array;
    let offset = 1;
    for (let i = 0; i < particleCount; i++) {
        array[offset] -= getRandom(0.1, 1);
        if (array[offset] < -250) array[offset] = 250;
        offset += 3;
    }

    // 告訴渲染器需更新頂點位置
    points.geometry.attributes.position.needsUpdate = true;
}

// 渲染的方法
function render() {
    // 有使用旋轉視角在更新
    if(cameraControl !== undefined) { cameraControl.update(); }
    // 若有使用 FPS 套件在耕莘
    if(stats !== undefined) { stats.update(); }

    // 追蹤功能更新
    TWEEN.update();
    // 怪物走路
    creeperObj.creeperFeetWalk();

    // 粒子系統動畫
    pointsAnimation();

    // 開始渲染
    renderer.render(scene, camera);
    // 重複執行
    requestAnimationFrame(render);
}

// 監聽螢幕寬高變化來做簡單 RWD 設定
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

render();