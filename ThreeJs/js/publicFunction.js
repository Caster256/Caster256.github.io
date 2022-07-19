// 產生 min 到 max 之間的亂數
function getRandom(min,max) {
    return Math.floor(Math.random()*(max-min+1))+min;
}