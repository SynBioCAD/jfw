


/// from https://raw.githubusercontent.com/Raynos/main-loop/master/index.js
// added debug stuff for biocad

export default function main(initialState, view, opts) {
    opts = opts || {}

    var currentState = initialState
    var create = opts.create
    var diff = opts.diff
    var patch = opts.patch
    var redrawScheduled = false

    var tree = opts.initialTree || view(currentState, 0);
    var target = opts.target || create(tree, opts)
    var inRenderingTransaction = false

    currentState = null

    var loop = {
        state: initialState,
        target: target,
        update: update
    }
    return loop

    function update(state) {
        if (inRenderingTransaction) {
            throw new Error('InvalidUpdateInRender')
        }

        if (currentState === null && !redrawScheduled) {
            redrawScheduled = true
            requestAnimationFrame(redraw)
        }

        currentState = state
        loop.state = state
    }

    function redraw(time) {

        redrawScheduled = false
        if (currentState === null) {
            return
        }

	let t0 = performance.now()

        inRenderingTransaction = true
        var newTree = view(currentState, time)

        if (opts.createOnly) {
            inRenderingTransaction = false
            create(newTree, opts)
        } else {
            var patches = diff(tree, newTree, opts)
            inRenderingTransaction = false
            target = patch(target, patches, opts)
        }

        tree = newTree
        currentState = null

	let t1 = performance.now()
	let ms = t1 - t0
	
	if(ms > 10) {
		console.log('Slow redraw: took ' + ms + 'ms')
	}
    }
}