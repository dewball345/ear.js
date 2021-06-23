import {EarModel, GeneralUtils} from './ear.js';

console.log("ENTERED")
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var img = document.getElementById("img");
var status = document.getElementById("status");



async function main(){
    let im0s = tf.browser.fromPixels(img)
    await tf.browser.toPixels(im0s, canvas);

    let em = new EarModel()
    status.innerText = "Loading model"
    await em.loadModel()

    async function doInference(){
        
        tf.engine().startScope()
        let prediction = await em.pred(canvas, ctx, img);
        tf.engine().endScope()
        return prediction
    }

    status.innerText = "Starting initial inference"
    let pred = await doInference()

    // console.log(fpscheck + " FPS")
    status.innerText = "Image is drawn to canvas!"
    pred.forEach(det => {
        GeneralUtils.drawToCanvas(det, ctx)
    })

    let btn = document.createElement("BUTTON")
    btn.innerText = "FPS Checker"
    btn.onclick = async () => {
        let fpsAmt = 0
        let length = 50;
        status.innerText = "Running FPS Test..."
        for(let i = 0; i<length; i++){
            const START = window.performance.now()
            await doInference()
            const END = window.performance.now()
            fpsAmt += END-START
        }

        fpsAmt /= length
        console.log(1/fpsAmt * 1000)
        status.innerText = `FPS is ${Math.round(1/fpsAmt * 1000)} FPS`
    }

    document.getElementById("btncontainer").appendChild(btn)
}

// img.onload = async () => {
//     console.log("image loaded")
//     await main()
// }
window.onload = async () => {
    await main()
}

