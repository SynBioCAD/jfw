
export default function flattenArrays(arrs) {

    const res = []

    arrs.forEach((arr) => {

        Array.prototype.push.apply(res, arr)

    })

    return res

}


