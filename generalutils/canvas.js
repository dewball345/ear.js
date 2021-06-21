export function drawToCanvas(det, ctx){

    // console.log("DET GIVEN")
    // console.log(det)

    ctx.beginPath();
    ctx.rect(det[0], det[1], det[2], det[3])

    if(det[5] === 0){
        ctx.strokeStyle = "red";
    } else {
        ctx.strokeStyle="lightgreen";
    }
    
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.closePath();
}