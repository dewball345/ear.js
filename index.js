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

    let pred;
    status.innerText = "Starting inference"
    tf.engine().startScope()
    pred = await em.pred(canvas, ctx, img);
    tf.engine().endScope()

    // console.log(fpscheck + " FPS")
    status.innerText = "Image is drawn to canvas!"
    pred.forEach(det => {
        GeneralUtils.drawToCanvas(det, ctx)
    })
}

// img.onload = async () => {
//     console.log("image loaded")
//     await main()
// }

main()
