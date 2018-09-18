
export default class LinearRange {

    start:number
    end:number
    
    constructor(start:number, end:number) {
        this.start = start
        this.end = end
    }

    normalise():LinearRange {

        if(this.end < this.start)
            return new LinearRange(this.end, this.start)

        return new LinearRange(this.start, this.end)
    }

    intersectsOffset(offset:number):boolean {

        const rangeN:LinearRange = this.normalise()

        return offset > rangeN.start && offset < rangeN.end
    }

    intersectsOrTouchesOffset(offset:number):boolean {

        const rangeN:LinearRange = this.normalise()

        return offset >= rangeN.start && offset <= rangeN.end
    }

    intersectsRange(range:LinearRange):boolean {

        if(range.start === this.start && range.end === this.end)
            return true

        return this.intersectsOffset(range.start) ||
            this.intersectsOffset(range.end) ||
            range.intersectsOffset(this.start) ||
            range.intersectsOffset(this.end)

    }

    intersectsOrTouchesRange(range:LinearRange):boolean {

        if(range.start === this.start && range.end === this.end)
            return true

        return this.intersectsOrTouchesOffset(range.start) ||
            this.intersectsOrTouchesOffset(range.end) ||
            range.intersectsOrTouchesOffset(this.start) ||
            range.intersectsOrTouchesOffset(this.end)

    }

    // TODO might be wrong!
    //
    intersection(range:LinearRange):LinearRange|null {

        const intersection:LinearRange = new LinearRange(Math.max(this.start, range.start), Math.min(this.end, range.end))

        if(isNaN(intersection.start))
            throw new Error('???')

        if(isNaN(intersection.end))
            throw new Error('???')

        if(intersection.end < intersection.start)
            return null

        return intersection
    }

    containsRange(range:LinearRange):boolean {

        return range.start >= this.start && range.end <= this.end

    }

    containsNotEqualsRange(range:LinearRange):boolean {

        if(range.start === this.start && range.end === this.end)
            return false

        return range.start >= this.start && range.end <= this.end

    }
}

