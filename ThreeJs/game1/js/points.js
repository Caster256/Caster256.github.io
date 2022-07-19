/**
 * 粒子系統練習
 */

/* 場景 */
const scene = new THREE.Scene();
// 霧化
scene.fog = new THREE.FogExp2(0x000000, 0.0008);

/* 相機 */
// 參數：視角、長寬比、近面距離(可以拉多近)、遠面距離(拉多遠)
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);

/* 渲染器設定 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// THREE.BasicShadowMap = 0
// THREE.PCFShadowMap = 1
// THREE.PCFSoftShadowMap = 2
renderer.shadowMap.type = 2;

/* 啟用 FPS */
const stats = new Stats();
stats.setMode(0);
document.getElementById('stats').appendChild(stats.domElement);

/* 建立 OrbitControls,可以轉換視角 */
const cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
// 啟用阻尼效果
cameraControl.enableDamping = true;
// 阻尼系數
cameraControl.dampingFactor = 0.25;

/* 建立光源 */
let spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10, 40, 30);
scene.add(spotLight);

document.body.appendChild(renderer.domElement);

// 自訂頂點創建粒子系統
function createVerticesPoints() {
    // 先宣告一個空的幾何體 .Geometry 被移除了，需要使用更低的版本
    const geometry = new THREE.Geometry();
    // 利用 PointsMaterial 決定材質
    const material = new THREE.PointsMaterial({
        size: 4,
        color: 0xff00ff
    });

    for (let x = -5; x < 5; x++) {
        for (let y = -5; y < 5; y++) {
            // 每一個粒子為一個 Vector3 頂點物件
            const point = new THREE.Vector3(x * 10, y * 10, 0);
            geometry.vertices.push(point);
        }
    }

    // 用前面的幾何體與材質建立一個粒子系統
    let points = new THREE.Points(geometry, material);
    points.position.set(-45, 0, 0);
    scene.add(points);
}

// 利用球體的頂點創建粒子系統
function createSpherePoints() {
    const geometry = new THREE.SphereGeometry(40, 20, 20);
    const material = new THREE.PointsMaterial({
        size: 2,
        color: 0x00ff00
    });
    // 用球體與材質建立一個粒子系統
    let spherePoints = new THREE.Points(geometry, material);
    spherePoints.position.set(45, 0, 0);
    scene.add(spherePoints);
}

// 自訂頂點創建雪花粒子系統
let points;
const particleCount = 15000;
function createSnowFlakePoints() {
    const geometry = new THREE.BufferGeometry();
    const texture = new THREE.TextureLoader().load('images/snowflake.png');
    const material = new THREE.PointsMaterial({
        size: 5,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7
    });

    const range = 500;
    let vertices = [];
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * range - range / 2;
        const y = Math.random() * range - range / 2;
        const z = Math.random() * range - range / 2;

        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    points = new THREE.Points(geometry, material);

    console.log(points);

    scene.add(points);
}

// 下雪動畫
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

function render() {
    // 有使用旋轉視角在更新
    if(cameraControl !== undefined) { cameraControl.update(); }
    // 若有使用 FPS 套件在耕莘
    if(stats !== undefined) { stats.update(); }

    // 下雪動畫-會卡卡的尚未處理
    pointsAnimation();

    // 開始渲染
    renderer.render(scene, camera);
    // 重複執行
    requestAnimationFrame(render);
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
});

// 創建粒子系統
// createVerticesPoints();
// createSpherePoints();
// 雪花粒子系統
createSnowFlakePoints();
render();