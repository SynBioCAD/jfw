
import { Vec2 } from "../geom";

const cachedGrids = {}

export function createGrid(size:Vec2) {

    size = size.round()

    if(cachedGrids[size.toString()] !== undefined) {

        return cachedGrids[size.toString()]

    }

    const canvas = document.createElement('canvas')
    canvas.width = size.x
    canvas.height = size.y

    const ctx = canvas.getContext('2d')

    if(ctx === null) {
        throw new Error('Failed to create canvas context')
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
    ctx.fillRect(0, 0, size.x, size.y)

    ctx.strokeStyle = '#ccc'

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(size.x, 0)
    ctx.moveTo(0, 0)
    ctx.lineTo(0, size.y)
    ctx.stroke()

    //console.log(size)

    const res = [
        'url(',
        canvas.toDataURL(),
        ')'
    ].join('')

    cachedGrids[size.toString()] = res

    return res
}


