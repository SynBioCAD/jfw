
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

    chop(oldRange:LinearRange, newLength:number):LinearRange|null {

        let ourRange = this.normalise()
        let toChop = oldRange.normalise()

        let len = toChop.end - toChop.start
        let ourLen = this.end - this.start

        if(toChop.start >= ourRange.end) {
            // outside right, nothing to do
            return new LinearRange(ourRange.start, ourRange.end)
        }

        if(ourRange.start >= toChop.start && ourRange.end <= toChop.end) {
            // contained by toChop - whole range is gone
            return null
        }

        if(toChop.start >= ourRange.start && toChop.end <= ourRange.end) {
            // inside, shorten and add new length
            return new LinearRange(ourRange.start, ourRange.end - len + newLength)
        }

        if(toChop.end <= ourRange.start) {
            // outside left, move left and then right again by new length
            return new LinearRange(ourRange.start - len + newLength, ourRange.end - len + newLength)
        }

        if(toChop.start <= ourRange.start && toChop.end >= ourRange.start) {
            // contains left

            // trim to the end of the chop
            let start = toChop.end

            // subtract the length of the chop
            start -= len

            // add the new length
            start += newLength

            return new LinearRange(start, start + (toChop.end - ourRange.start))
        }

        if(toChop.start <= ourRange.end && toChop.end >= ourRange.end) {
            // contains right, trim
            return new LinearRange(ourRange.start, toChop.start)
        }

        console.log('ourRange', ourRange, 'toChop', toChop, 'newLength', newLength)

        throw new Error('not sure how to chop that')
    }

    toString():string {
        return '(' + this.start + ' -> ' + this.end + ')'
    }
}

