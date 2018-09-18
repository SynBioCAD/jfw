
import almostEqual from './almostEqual'

import assert from 'power-assert'

function degreesToRadians(deg:number): number {
    return Math.sin(deg * Math.PI / 180.0)
}

export default class Vec2 {

    private _x: number
    private _y: number

    constructor(x:number, y:number) {
        this._x = x
        this._y = y
    }

    get x():number {
        return this._x;
    }

    get y():number {
        return this._y;
    }

    static fromXY(x:number, y:number):Vec2 {
        return new Vec2(x, y)
    }

    static zero():Vec2 {
        return new Vec2(0, 0)
    }

    static fromScalar(n:number):Vec2 {
        return new Vec2(n, n)
    }

    add(rhs:Vec2): Vec2 {
        return Vec2.fromXY(this.x + rhs.x, this.y + rhs.y)
    }

    addScalar(rhs:number): Vec2 {
        return Vec2.fromXY(this.x + rhs, this.y + rhs)
    }

    subtract(rhs:Vec2): Vec2 {
        return Vec2.fromXY(this.x - rhs.x, this.y - rhs.y)
    }

    subtractScalar(rhs:number): Vec2 {
        return Vec2.fromXY(this.x - rhs, this.y - rhs)
    }

    multiply(rhs:Vec2): Vec2 {
        return Vec2.fromXY(this.x * rhs.x, this.y * rhs.y)
    }

    multiplyScalar(rhs:number): Vec2 {
        return Vec2.fromXY(this.x * rhs, this.y * rhs)
    }

    divide(rhs:Vec2): Vec2 {
        return Vec2.fromXY(this.x / rhs.x, this.y / rhs.y)
    }

    divideScalar(rhs:number): Vec2 {
        return Vec2.fromXY(this.x / rhs, this.y / rhs)
    }

    min(rhs:Vec2): Vec2 {
        return Vec2.fromXY(Math.min(this.x, rhs.x), Math.min(this.y, rhs.y))
    }

    max(rhs:Vec2): Vec2 {
        return Vec2.fromXY(Math.max(this.x, rhs.x), Math.max(this.y, rhs.y))
    }

    abs(): Vec2 {
        return Vec2.fromXY(Math.abs(this.x), Math.abs(this.y))
    }

    difference(rhs): Vec2 {
        return this.subtract(rhs).abs()
    }

    toPathString():string {
        return this.x + ',' + this.y
    }

    direction(rhs:Vec2): Vec2 {

        if(rhs.x > this.x) {
            return Vec2.fromXY(1, 0)
        } else if(rhs.x < this.x) {
            return Vec2.fromXY(-1, 0)
        } else if(rhs.y > this.y) {
            return Vec2.fromXY(0, 1)
        } else if(rhs.y < this.y) {
            return Vec2.fromXY(0, -1)
        } else {
            return Vec2.fromXY(0, 0)
        }
    }

    equals(rhs:Vec2): boolean {
        return almostEqual(this.x, rhs.x) && almostEqual(this.y, rhs.y)
    }

    round(): Vec2 {
        return Vec2.fromXY(Math.round(this.x), Math.round(this.y))
    }

    ceil(): Vec2 {
        return Vec2.fromXY(Math.ceil(this.x), Math.ceil(this.y))
    }

    floor(): Vec2 {
        return Vec2.fromXY(Math.floor(this.x), Math.floor(this.y))
    }

    magnitudeSquared(): number {
        return (this.x * this.x) + (this.y * this.y)
    }

    magnitude(): number {
        return Math.sqrt(this.magnitudeSquared())
    }

    scalarProduct(rhs): number {
        return (this.x * rhs.x) + (this.y * rhs.y)
    }

    crossProduct(rhs): number {
        return (this.x * rhs.y) - (rhs.x * this.y)
    }

    distanceTo(rhs): number {

        const d:Vec2 = this.difference(rhs)

        return Math.sqrt((d.x * d.x) + (d.y * d.y))

    }

    rotate(p, deg): Vec2 {

        const angle: number = degreesToRadians(deg)

        const s:number = Math.sin(angle)
        const c:number = Math.cos(angle)

        const originPoint:Vec2 = this.subtract(p)

        return Vec2.fromXY(
            (this.x * c) - (this.y * s),
            (this.x * s) + (this.y * c)
        ).add(originPoint)
    }

    normalise() {

        const magnitude = this.magnitude()

        if(magnitude === 0)
            return Vec2.fromXY(0, 0)

        return Vec2.fromXY(
            this.x / magnitude,
            this.y / magnitude
        )
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')'
    }

    midPointTo(b) {
        return this.add(b).multiplyScalar(0.5)
    }

    toPOD():any {

        return {
            x: this.x,
            y: this.y
        }

    }

    static fromPOD(pod:any):Vec2 {
        return Vec2.fromXY(pod.x, pod.y)
    }

}




