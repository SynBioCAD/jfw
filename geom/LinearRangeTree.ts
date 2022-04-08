
import LinearRange from "./LinearRange";
import LinearRangeSet from "./LinearRangeSet";

export default class LinearRangeTree {

    static fromSet(set:LinearRangeSet):LinearRangeTree {

        return new LinearRangeTree(set.ranges)

    }

    nodes:LinearRangeTreeNode[]

    private constructor(ranges:Array<LinearRange>) {

        this.nodes = []

        const rangesSortedDescendingLength = ranges.sort((a:LinearRange, b:LinearRange) => {
            return Math.abs(b.end - b.start) - Math.abs(a.end - a.start)
        })

        rangesSortedDescendingLength.forEach((range:LinearRange) => {

            const node:LinearRangeTreeNode = new LinearRangeTreeNode(range)

            for(var i = 0; i < this.nodes.length; ++ i) {

                if(this.nodes[i].range.containsNotEqualsRange(range)) {

                    this.nodes[i].children.push(node)
                    return

                }
            }

            this.nodes.push(node)
        })

    }

}

export class LinearRangeTreeNode {

    constructor(range:LinearRange) {

        this.range = range
        this.children = []

    }

    range:LinearRange
    children:LinearRangeTreeNode[]

}