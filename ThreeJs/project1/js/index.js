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
// 取得渲染器
const renderer = init.getRender();

// 建立地板
const floor = new Floor(scene);
floor.createFloor();

// 建立光源
const light = new Light(scene);
light.useLight();

// 實體化怪物物件
const creeperObj = new Creeper(scene);
// 新增怪物到畫面上
creeperObj.createCreeper();

// 將渲染出來的畫面放到網頁上的 DOM
document.body.appendChild(renderer.domElement);
// 渲染
init.render();

// 監聽螢幕寬高變化來做簡單 RWD 設定
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});