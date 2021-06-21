import {EarModel, GeneralUtils} from './ear.js';

console.log("ENTERED")
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var img = document.getElementById("img");

async function main(){
    let im0s = tf.browser.fromPixels(img)
    await tf.browser.toPixels(im0s, canvas);

    let em = new EarModel()
    await em.loadModel()

    let pred;
    tf.engine().startScope()
    pred = await em.pred(canvas, ctx, img);
    tf.engine().endScope()

    // console.log(fpscheck + " FPS")
    pred.forEach(det => {
        GeneralUtils.drawToCanvas(det, ctx)
    })
}

// img.onload = async () => {
//     console.log("image loaded")
//     await main()
// }

main()
