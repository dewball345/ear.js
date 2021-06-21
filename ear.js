import {xywh2xyxy, xyxy2xywh} from './generalutils/xywh.js';
import {padImage, resizePad} from './generalutils/pad.js';
import {tfScaleCoords, tfClipCoords, oneHalfShift} from './generalutils/scaling.js';
import {drawToCanvas} from './generalutils/canvas.js';
import {tfNms} from './generalutils/nms.js';

export class GeneralUtils{
    static xywh2xyxy = xywh2xyxy;
    static xyxy2xywh = xyxy2xywh;
    static tfNms = tfNms;
    static padImage = padImage;
    static resizePad = resizePad;
    static tfScaleCoords = tfScaleCoords;
    static tfClipCoords = tfClipCoords;
    static oneHalfShift = oneHalfShift;
    static drawToCanvas = drawToCanvas;
}

export class EarModel{
    async loadModel(){
        console.log("Loading here")
        const model = await tf.loadGraphModel(
            "https://raw.githubusercontent.com/dewball345/ear.js-model/main/model.json")
        console.log("finished loading")
        this.model = model
    }

    async pred(/*canvas, ctx,*/ imgElem){
        let im0s = tf.browser.fromPixels(imgElem)
        let img = im0s.div(tf.scalar(255.0))
        console.log(im0s.shape)
        let pad_spec = await GeneralUtils.padImage(img, 640, 640)
        img = pad_spec.pd
        console.log(img.shape)
        // await tf.browser.toPixels(im0s, canvas);
    
        let prediction = await this.model.predict(img.expandDims(0))
        let processed = await GeneralUtils.tfNms(prediction)
        
        let outputDets = []

        for(let det of processed){
            det = [det]
            for(let dt of det){
                let scaled = await GeneralUtils.tfScaleCoords(
                    img.shape.slice(0, 2),
                    [dt.slice(0, 4)],
                    im0s.shape.slice(0, 2),
                    pad_spec.padm,
                    pad_spec.mode
                )

                scaled = scaled[0]
                dt[0] = scaled[0]
                dt[1] = scaled[1]
                dt[2] = scaled[2]
                dt[3] = scaled[3]
            }

            det = GeneralUtils.xyxy2xywh(det)[0]
            det = GeneralUtils.oneHalfShift(det)
            
            outputDets.push(det)
            // GeneralUtils.drawToCanvas(det, ctx)    
        }

        return outputDets
    }
}