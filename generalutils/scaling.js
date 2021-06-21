import {resizePad} from './pad.js';

export async function tfScaleCoords(img1_shape, coords, img0_shape, pad_amt, useW){
    let gain = Math.min(
        img1_shape[0]/img0_shape[0], 
        img1_shape[1]/img0_shape[1]
    )

    let pad = [
        (img1_shape[1] - img0_shape[1] * gain) /2,
        (img1_shape[0] - img0_shape[0] * gain) /2
    ]

    coords.forEach(item => {
        item[0] -= pad[0]
        item[2] -= pad[0]
        item[0] -= pad[0]
        item[2] -= pad[0]

        item[1] -= pad[1]
        item[3] -= pad[1]
        item[1] -= pad[1]
        item[3] -= pad[1]
        
        resizePad(item, pad_amt, useW)

        item[0] /= gain
        item[1] /= gain
        item[2] /= gain
        item[3] /= gain
    });

    
    await tfClipCoords(coords, img0_shape)
    return coords
}

export async function tfClipCoords(boxes, img_shape){
    // console.log("REACHED")
    // console.log(JSON.stringify(boxes))
    for(let box of boxes){
        // console.log(JSON.stringify(box))
        box[0] = await (tf.clipByValue(box[0], 0, img_shape[1]).array())
        box[1] = await (tf.clipByValue(box[1], 0, img_shape[0]).array())
        box[2] = await (tf.clipByValue(box[2], 0, img_shape[1]).array())
        box[3] = await (tf.clipByValue(box[3], 0, img_shape[0]).array())
        // console.log(JSON.stringify(box))
    }
    // boxes.forEach(box => {

    // })
}

export function oneHalfShift(det){
    return [det[0] - det[2]/2, det[1] - det[3]/2, det[2], det[3], det[4], det[5]]
}