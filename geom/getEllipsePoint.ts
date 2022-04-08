
import Vec2 from './Vec2'

const circumferenceRadians = Math.PI * 2

export default function getEllipsePoint(centerPoint, radius, normalizedOffset) {

    const offsetRadians = normalizedOffset * circumferenceRadians

    return new Vec2(
        centerPoint.x + (radius.x * Math.cos(offsetRadians)),
        centerPoint.y + (radius.y * Math.sin(offsetRadians))
    )

}

