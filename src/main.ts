import "../src/style/reset.less";
import "../src/style/index.less";
const imgList = document.querySelector('#img-list')
const trackContainer = <HTMLElement>document.querySelector('#track-container')
const imgTrack = <HTMLElement>document.querySelector('#img-track')
// console.log(trackContainer.offsetWidth, trackContainer.offsetHeight, trackContainer.offsetTop)
let cloneEl: HTMLElement
let dragging = false
let flag = true
let currentPosIndex = 0 // 克隆后索引
let targetIndex = 0 //当前索引
let img: HTMLElement | undefined
imgList?.addEventListener('mousedown', (e: Event) => {
    e.preventDefault() //阻止默认事件
    let img = <HTMLElement>e.target
    if (!img.classList.contains("photo")) {
        return;
    }
    cloneEl = img.cloneNode(true) as HTMLElement
    cloneEl.classList.add('clone-img')
    document.body.appendChild(cloneEl)
    dragging = true
    flag = true
})
imgTrack.addEventListener('mousedown', (e: Event) => {
    e.preventDefault() //阻止默认事件
    let img = <HTMLElement>e.target
    if (!img.classList.contains("img")) {
        return;
    }
    cloneEl = img.cloneNode(true) as HTMLElement
    console.log(cloneEl)
    cloneEl.classList.add('clone-img', 'clone-Img')
    document.body.appendChild(cloneEl)
    dragging = true
    flag = true
})
window.addEventListener("mousemove", (e) => {
    const cloneImg = <HTMLElement>document.querySelector('.clone-img')
    if (dragging && cloneImg) {
        //获取鼠标位置
        let X = (e as MouseEvent).pageX
        let Y = (e as MouseEvent).pageY
        cloneImg.style.left = X - 20 + "px"
        cloneImg.style.top = Y - 20 + "px"
        if (Y > trackContainer.offsetTop - 80 && Y < trackContainer.offsetTop + trackContainer.offsetHeight) {
            if (flag) {
                img = document.createElement('div')
                img.style.backgroundImage = `url(${cloneImg.getAttribute('src')})`
                img.style.width = cloneImg.offsetWidth + "px"
                img.classList.add('img')
                imgTrack.appendChild(img)
                console.log(cloneImg.style.backgroundImage, "2222222")
                console.log(img, '111111111111')
                currentPosIndex = imgTrack.children.length - 1 // 克隆后索引
                targetIndex = imgTrack.children.length - 1 //当前索引
                flag = false
            }
            if (showWith() < cloneImg.offsetLeft + 50) {
                img!.style.left = X + 30 + "px"
            } else {
                handleTransitionEnd()
            }
        } else {
            img && img.remove() //超出克隆位置删除克隆元素
            flag = true
        }
    }
})
//鼠标离开视窗处理
document.addEventListener("mouseleave", () => {
    const cloneImg = <HTMLElement>document.querySelector('.clone-img')
    cloneImg && img && img.remove() //在鼠标抬起前离开视窗，删除克隆元素
})
//鼠标抬起事件处理
window.addEventListener("mouseup", () => {
    const cloneImg = <HTMLElement>document.querySelector('.clone-img')
    cloneImg && cloneImg.remove() //鼠标停止移动删除拖拽图片
    img?.classList.add('sort')
    img = undefined
    let left = 0
    for (let i = 0; i < imgTrack.children.length; i++) {
        (imgTrack.children[i] as HTMLElement).style.left = left + 'px'
        left += (imgTrack.children[i] as HTMLElement).offsetWidth
    }
})


function showWith(): number {
    let width = 0
    for (let i = 0; i < imgTrack.children.length - 1; i++) {
        width += (imgTrack.children[i] as HTMLElement).offsetWidth
    }
    return width
}

function handleTransitionEnd() {
    const cloneImg = <HTMLElement>document.querySelector('.clone-img')
    const all = document.querySelectorAll(".img");

    if (targetIndex !== 0 && cloneImg.offsetLeft < (imgTrack.children[targetIndex - 1] as HTMLElement).offsetLeft + (imgTrack.children[targetIndex - 1] as HTMLElement).offsetWidth / 2) {
        currentPosIndex -= 1
    } else if ( targetIndex < imgTrack.children.length -1 && cloneImg.offsetLeft > (imgTrack.children[targetIndex + 1] as HTMLElement).offsetLeft + (imgTrack.children[targetIndex + 1] as HTMLElement).offsetWidth / 2) {
        currentPosIndex += 1
    } else if( cloneImg.offsetLeft > (imgTrack.children[imgTrack.children.length -2] as HTMLElement).offsetLeft + (imgTrack.children[imgTrack.children.length -2] as HTMLElement).offsetWidth * 2 / 3) {
        currentPosIndex = imgTrack.children.length -1
    }
    if (currentPosIndex < targetIndex) {
        (img as HTMLElement).parentNode!.insertBefore(<HTMLElement>img, all[currentPosIndex]);
    } else {
       if(currentPosIndex < imgTrack.children.length -1){
        (img as HTMLElement).parentNode!.insertBefore(<HTMLElement>img, all[currentPosIndex + 1]);
       } else {
        // console.log(img, '33333333333')
        imgTrack.appendChild(img as HTMLElement)
       }
    }
    let left = 0
    for (let i = 0; i < imgTrack.children.length; i++) {
       if(i > 0){
        left += (imgTrack.children[i - 1] as HTMLElement).offsetWidth;
       }
        (imgTrack.children[i] as HTMLElement).style.left = left + 'px'
    }
    targetIndex = currentPosIndex
}
