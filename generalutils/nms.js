import {xywh2xyxy} from './xywh.js';

export async function tfNms(
    prediction,
    conf_thresh=0.25,
    iou_thresh=0.45,
    max_det = 300
){
    const MODEL_INPUT_IMAGE_SIZE = 640;

    let pred = await prediction.array()
    let max_wh = 4096;
    let outputs = []
    
    // console.log(pred)
    for(const predArr of pred){
        let xc = predArr.filter((item) => {
            return item[4] > conf_thresh
        })
        
        xc.forEach(item => {
            item[0] *= MODEL_INPUT_IMAGE_SIZE
            item[1] *= MODEL_INPUT_IMAGE_SIZE
            item[2] *= MODEL_INPUT_IMAGE_SIZE
            item[3] *= MODEL_INPUT_IMAGE_SIZE

            item[5] *= item[4]
        })

        let box = xywh2xyxy(xc.map(arrItem => arrItem.slice(0, 4)))
        let confArr = xc.map(item => item.slice(5))

        let conf = confArr.map(item => item[0] > item[1] ? item[0] : item[1])
        let j = confArr.map(item => item[0] > item[1] ? 0 : 1)
        
        xc = []

        let boxes = []
        let scores = []

        for(let i = 0; i< conf.length; i++){
            xc.push([...box[i], conf[i], j[i]])
            let c = j[i] * max_wh
            // console.log(c)
            boxes.push([
                box[i][0] + c, 
                box[i][1] + c, 
                box[i][2] + c, 
                box[i][3] + c
            ])

            scores.push(conf[i])
        }

        console.log("TF NMSASYNC FUNC")
        console.log(boxes, scores)

        let i = await tf.image.nonMaxSuppressionAsync(
            boxes, scores, max_det, iou_thresh
        )
        i = await i.array()
        // console.log(i)
        i.forEach(ii => {
            outputs.push(xc[ii])
        })
    }

    return outputs
}