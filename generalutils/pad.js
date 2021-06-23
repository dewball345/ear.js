
export function padImage(img, w, h){
    //Suppose target size 10x10
    // let t = tf.ones([3, 2, 3])
    let shape = img.shape.slice(0, 2)
    let useW = shape[0] > shape[1] ? false : true
    let padded;
    let pad_amt;

    if(useW){
        let newH = Math.round(shape[0]/shape[1] * h)
        img = img.resizeBilinear([newH, w])
        pad_amt = Math.round((h-newH)/2)
        let padding = [[pad_amt, h-newH-pad_amt], [0, 0], [0, 0]]
        
        padded = tf.pad(img, padding)
    } else {
        let newW = Math.round(shape[1]/shape[0] * w)
        img = img.resizeBilinear([h, newW])
        // console.log(img.shape)
        pad_amt = Math.round((w-newW)/2)

        let padding = [[0, 0], [pad_amt, w-newW-pad_amt], [0, 0]]
        padded = tf.pad(img, padding)
        // console.log(padded.shape)  
    }

    return {pd: padded, mode: useW, padm: pad_amt}
}

export function resizePad(item, pad_amt, useW){
    // console.log(JSON.stringify(item))
    if(useW){
        item[1] += pad_amt
        item[3] += pad_amt
        return;
    }
    item[0] += pad_amt
    item[2] += pad_amt
}