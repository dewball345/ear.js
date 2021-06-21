export function xywh2xyxy(x){
    let y = JSON.parse(JSON.stringify(x))

    for(let yi = 0; yi < y.length; yi++){
        y[yi][0] = x[yi][0] - x[yi][2] / 2
        y[yi][1] = x[yi][1] - x[yi][3] / 2
        y[yi][2] = x[yi][0] + x[yi][2] / 2
        y[yi][3] = x[yi][1] + x[yi][3] / 2
    }

    return y
}

export function xyxy2xywh(x){
    let y = JSON.parse(JSON.stringify(x))

    for(let yi = 0; yi < y.length; yi++){
        y[yi][0] = (x[yi][0] + x[yi][2]) / 2
        y[yi][1] = (x[yi][1] + x[yi][3]) / 2
        y[yi][2] = x[yi][2] - x[yi][0]
        y[yi][3] = x[yi][3] - x[yi][1]
    }

    return y
}