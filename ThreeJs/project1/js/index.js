// 正反向
let invert = 1;
let startTracking = false;
// 移動
let tweenGo, tweenBack;

/* 場景 */
const scene = new THREE.Scene();

/* 相機 */
// 參數：視角、長寬比、近面距離(可以拉多近)、遠面距離(拉多遠)
const camera = new THREE.PerspectiveCamera(60, (window.innerWidth / window.innerHeight), 0.1, 1000);
camera.position.set(50, 50, 50);
camera.lookAt(scene.position);

/* 三維輔助線 */
const axes = new THREE.AxesHelper(20);
scene.add(axes);

/* 啟用 FPS */
const stats = new Stats();
stats.setMode(0);
document.getElementById('stats').appendChild(stats.domElement);

/* 渲染器設定 */
const renderer = new THREE.WebGLRenderer();
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
const planeGeometry = new THREE.PlaneGeometry(80, 80);
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
scene.add(spotLight);
// 點光源
// 參數：顏色, 強度, 距離
let pointLight = new THREE.PointLight(0xccffcc, 1, 100);
// 投影
pointLight.castShadow = true;
pointLight.position.set(-30, 30, 30);
scene.add(pointLight);

/* 建立讓怪物跟隨相機的開關 */
let datGUIControls = new (function() {
    this.startTracking = false;
})();

document.body.appendChild(renderer.domElement);

/* 產生怪物 */
const creeperObj = new Creeper();
tweenHandler();
scene.add(creeperObj.creeper);

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
        if (camera.position.x > 30) target.x = 20;
        else if (camera.position.x < -30) target.x = -20;
        else target.x = camera.position.x;
        if (camera.position.z > 30) target.z = 20;
        else if (camera.position.z < -30) target.z = -20;
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

    // 朝相機移動
    tweenGo = new TWEEN.Tween(offset)
        .to(target, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
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
gui.add(datGUIControls, 'startTracking').onChange(function(e) {
    startTracking = e;
    if (invert > 0) {
        if (startTracking) {
            tweenGo.start();
        } else {
            tweenGo.stop();
        }
    } else {
        if (startTracking) {
            tweenBack.start();
        } else {
            tweenBack.stop();
        }
    }
});

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