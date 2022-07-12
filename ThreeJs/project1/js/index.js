// 建立場景
const scene = new THREE.Scene();

// 建立相機
const camera_obj = new Camera(scene);
camera_obj.createPerspectiveCamera(60);
// 取得相機物件
const camera = camera_obj.getCamera();

// 初始化
const init = new Init(scene, camera);
// 使用 FPS
init.useFPS();
// 使用輔助線(xyz)
init.useAxesHelper();
// 使用轉換視角
init.useCameraControl();
// 設定渲染器陰影
init.setRenderShadow();
// 取得渲染器
const renderer = init.getRender();

// 建立地板
const floor = new Floor(scene);
floor.createFloor();
// 建立弟版的陰影
floor.setFloorShadow();

// 建立光源
const light = new Light(scene);
// 點光源
light.usePointLight();
// 設定點光源的陰影
light.setPointLightShaddow();
// 小球體模擬點光源實體
// light.useSphereLightMesh();
// 環境光
light.useAmbientLight();
// 聚光燈
light.useSpotLight();

// 實體化怪物物件
const creeperObj = new Creeper(scene);
// 新增怪物到畫面上
creeperObj.createCreeper();
// 建立陰影
creeperObj.setCreeperShadow();

// 將渲染出來的畫面放到網頁上的 DOM
document.body.appendChild(renderer.domElement);
// 渲染
const cameraControl = init.getCameraControl();
const stats = init.getStats();
render();

// 渲染的方法
function render() {
    // 有使用旋轉視角在更新
    if(cameraControl !== undefined) { cameraControl.update(); }
    // 若有使用 FPS 套件在耕莘
    if(stats !== undefined) { stats.update(); }
    // 點光源繞 Y 軸旋轉動畫
    // light.pointLightAnimation();
    // 使用擺頭功能
    // creeperObj.creeperHeadRotate();
    // 苦力怕走動
    // creeperObj.creeperFeetWalk();
    // 苦力怕膨脹
    // creeperObj.creeperScaleBody();

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