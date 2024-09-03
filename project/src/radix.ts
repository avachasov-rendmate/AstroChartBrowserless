import Zodiac from './zodiac'
import AspectCalculator from './aspect'
import type {FormedAspect} from './aspect'
import Transit from './transit'
import {
    validate
    , radiansToDegree
    , getEmptyWrapper
    , getPointPosition
    , getRulerPositions
    , getDescriptionPosition
    , getDashedLinesPositions
    , assemble
} from './utils'
import type SVG from './svg'
import type {Settings} from './settings'

export type Points = Record<string, number[]>

export interface LocatedPoint {
    name: string
    x: number
    y: number
    r: number
    angle: number
    pointer?: number
    index?: number
}

export interface AstroData {
    planets: Points
    cusps: number[]
}

/**
 * Radix charts.
 *
 * @class
 * @public
 * @constructor
 * @param {this.settings.SVG} paper
 * @param {int} cx
 * @param {int} cy
 * @param {int} radius
 * @param {Object} data
 */
class Radix {
    settings: Settings
    data: AstroData
    paper: SVG
    document: any
    cx: number
    cy: number
    radius: number
    locatedPoints: LocatedPoint[]
    rulerRadius: number
    pointRadius: number
    toPoints: Points
    shift: number
    universe: Element
    context: this

    constructor(document: any, paper: SVG, cx: number, cy: number, radius: number, data: AstroData, settings: Settings) {
        this.settings = settings
        this.document = document
        // Validate data
        const status = validate(data)
        if (status.hasError) {
            throw new Error(status.messages.join(' | '))
        }

        this.data = data
        this.paper = paper
        this.cx = cx
        this.cy = cy
        this.radius = radius

        // after calling this.drawPoints() it contains current position of point
        this.locatedPoints = []
        this.rulerRadius = ((this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / this.settings.RULER_RADIUS)
        this.pointRadius = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + 2 * this.rulerRadius + (this.settings.PADDING * this.settings.SYMBOL_SCALE))

        // @see aspects()
        // @see setPointsOfInterest()
        this.toPoints = JSON.parse(JSON.stringify(this.data.planets)) // Clone object

        this.shift = 0
        if (this.data.cusps && this.data.cusps[0]) {
            const deg360 = radiansToDegree(2 * Math.PI)
            this.shift = deg360 - this.data.cusps[0]
        }

        this.universe = this.document.createElementNS(this.paper.root.namespaceURI, 'g')
        this.universe.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_RADIX)
        this.paper.root.appendChild(this.universe)


        const divisionForAspects = this.document.createElementNS(this.paper.root.namespaceURI, 'g')
        divisionForAspects.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_ASPECTS)
        this.paper.root.appendChild(divisionForAspects)

        this.context = this
    }

    destroy(): void {
        this.settings = {} as Settings
        this.data = {} as AstroData
        this.paper = {} as SVG
        this.document = {}
        this.cx = 0
        this.cy = 0
        this.radius = 0
        this.locatedPoints = []
        this.rulerRadius = 0
        this.pointRadius = 0
        this.toPoints = {}
        this.shift = 0
        this.universe = {} as Element
    }

    /**
     * Draw background
     */
    drawBg(): void {
        if (!this.settings.showGradient && this.settings.showBackground) {
            const universe = this.universe
            const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_BG, this.paper.root.id)

            const LARGE_ARC_FLAG = 1
            const start = 0 // degree
            const end = 359.99 // degree
            const radius = this.radius - this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.settings.BG_PADDING
            const thickness = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO
            const hemisphere = this.paper.segment(this.cx, this.cy, radius, start, end, thickness, LARGE_ARC_FLAG)
            hemisphere.setAttribute('fill', this.settings.STROKE_ONLY ? 'none' : this.settings.COLOR_BACKGROUND)
            wrapper.appendChild(hemisphere)
        }
    }

    /**
     * Draw universe.
     */
    drawUniverse(): void {
        const universe = this.universe
        const strokeMode = this.settings.STROKE_ONLY || this.settings.showGradient || this.settings.signsDiskStrokeOnly
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_SIGNS, this.paper.root.id)
        // colors
        for (let i = 0, step = 30, start = this.shift, len = 12; i < len; i++) {
            const segment = this.paper.segment(this.cx, this.cy, this.radius, start, start + step, this.radius - this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO)
            const currentColor = i % 2 ? this.settings.COLOR_SIGN_BG_LIGHT : this.settings.COLOR_SIGN_BG_DARK
            segment.setAttribute('fill', strokeMode ? 'none' : currentColor)
            segment.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_SIGNS + '-' + i)
            if (!this.settings.showGradient) {
                segment.setAttribute('stroke', strokeMode ? this.settings.COLOR_CIRCLES : 'none')
            }
            segment.setAttribute('stroke-width', strokeMode ? this.settings.SIGN_BG_STROKE.toString() : '0')
            wrapper.appendChild(segment)

            start += step
        }

        // signs
        for (let i = 0, step = 30, start = 15 + this.shift, len = this.settings.SYMBOL_SIGNS.length; i < len; i++) {
            const position = getPointPosition(this.cx, this.cy, this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / 2, start, this.settings)
            const symbolColor = i % 2 ? this.settings.COLOR_SIGN_LIGHT : this.settings.COLOR_SIGN_DARK
            wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_SIGNS[i], position.x, position.y, symbolColor))
            start += step
        }
    }

    /**
     * Draw points
     */
    drawPoints(): void {
        if (this.data.planets == null) {
            return
        }

        const universe = this.universe
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_POINTS, this.paper.root.id)


        const pointerRadius = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius)
        let startPosition
        let endPosition

        for (const planet in this.data.planets) {
            if (this.data.planets.hasOwnProperty(planet)) {
                const position = getPointPosition(this.cx, this.cy, this.pointRadius, this.data.planets[planet][0] + this.shift, this.settings)
                const point = {
                    name: planet,
                    x: position.x,
                    y: position.y,
                    r: (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE),
                    angle: this.data.planets[planet][0] + this.shift,
                    pointer: this.data.planets[planet][0] + this.shift
                }
                this.locatedPoints = assemble(this.locatedPoints, point, {
                    cx: this.cx,
                    cy: this.cy,
                    r: this.pointRadius
                }, this.settings)
            }
        }

        if (this.settings.DEBUG) console.log('Radix count of points: ' + this.locatedPoints.length)
        if (this.settings.DEBUG) console.log('Radix located points:\n' + JSON.stringify(this.locatedPoints))

        this.locatedPoints.forEach(function (point: LocatedPoint) {
            // draw pointer
            startPosition = getPointPosition(this.cx, this.cy, pointerRadius, this.data.planets[point.name][0] + this.shift, this.settings)
            endPosition = getPointPosition(this.cx, this.cy, pointerRadius - this.rulerRadius / 2, this.data.planets[point.name][0] + this.shift, this.settings)

            if (this.settings.showPointsPointer) {
                const pointer = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
                if (this.settings.showGradient) {
                    pointer.setAttribute('fill', 'none')
                } else {
                    pointer.setAttribute('stroke', this.settings.COLOR_CIRCLES)
                }
                pointer.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
                wrapper.appendChild(pointer)

                // draw pointer line
                if (!this.settings.STROKE_ONLY && (this.data.planets[point.name][0] + this.shift) !== point.angle) {
                    startPosition = endPosition
                    endPosition = getPointPosition(this.cx, this.cy, this.pointRadius + (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE), point.angle, this.settings)
                    const line = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)

                    if (this.settings.showGradient) {
                        line.setAttribute('fill', 'none')
                    } else {
                        line.setAttribute('stroke', this.settings.COLOR_LINES)
                    }
                    line.setAttribute('stroke-width', 0.5 * (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
                    wrapper.appendChild(line)
                }
            }

            // draw symbol
            const symbol = this.paper.getSymbol(point.name, point.x, point.y, this.settings.COLOR_POINTS)
            symbol.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_POINTS + '-' + point.name)
            wrapper.appendChild(symbol)

            // draw point descriptions
            if (this.settings.showPointDescription) {
                let textsToShow = [(Math.floor(this.data.planets[point.name][0]) % 30).toString()]

                const zodiac = new Zodiac(this.data.cusps, this.settings)

                if (this.data.planets[point.name][1] && zodiac.isRetrograde(this.data.planets[point.name][1])) {
                    textsToShow.push('R')
                } else {
                    textsToShow.push('')
                }

                textsToShow = textsToShow.concat(zodiac.getDignities({
                    name: point.name,
                    position: this.data.planets[point.name][0]
                }, this.settings.DIGNITIES_EXACT_EXALTATION_DEFAULT).join(','))

                const pointDescriptions = getDescriptionPosition(point, textsToShow, this.settings)
                pointDescriptions.forEach(function (dsc) {
                    wrapper.appendChild(this.paper.text(dsc.text, dsc.x, dsc.y, this.settings.POINTS_TEXT_SIZE, this.settings.COLOR_NUMBERS))
                }, this)
            }

        }, this)
    }

    drawAxis(): void {
        if (this.data.cusps == null) {
            return
        }

        const universe = this.universe
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_AXIS, this.paper.root.id)

        const axisRadius = this.radius + ((this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / 4)

        const AS = 0
        const IC = 3
        const DC = 6
        const MC = 9
        let overlapLine
        let startPosition
        let endPosition

        [AS, IC, DC, MC].forEach(function (i) {
            let textPosition
            // overlap
            startPosition = getPointPosition(this.cx, this.cy, this.radius, this.data.cusps[i] + this.shift, this.settings)
            endPosition = getPointPosition(this.cx, this.cy, axisRadius, this.data.cusps[i] + this.shift, this.settings)
            overlapLine = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
            if (this.settings.showGradient) {
                overlapLine.setAttribute('fill', 'none')
            } else {
                overlapLine.setAttribute('stroke', this.settings.COLOR_LINES)
            }
            overlapLine.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
            wrapper.appendChild(overlapLine)

            // As
            if (i === AS) {
                // Text
                textPosition = getPointPosition(this.cx, this.cy, axisRadius + (20 * this.settings.SYMBOL_SCALE), this.data.cusps[i] + this.shift, this.settings)
                wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_AS, textPosition.x, textPosition.y))
            }

            // Ds
            if (i === DC) {
                // Text
                textPosition = getPointPosition(this.cx, this.cy, axisRadius + (2 * this.settings.SYMBOL_SCALE), this.data.cusps[i] + this.shift, this.settings)
                wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_DS, textPosition.x, textPosition.y))
            }

            // Ic
            if (i === IC) {
                // Text
                textPosition = getPointPosition(this.cx, this.cy, axisRadius + (10 * this.settings.SYMBOL_SCALE), this.data.cusps[i] - 2 + this.shift, this.settings)
                wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_IC, textPosition.x, textPosition.y))
            }

            // Mc
            if (i === MC) {
                // Text
                textPosition = getPointPosition(this.cx, this.cy, axisRadius + (10 * this.settings.SYMBOL_SCALE), this.data.cusps[i] + 2 + this.shift, this.settings)
                wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_MC, textPosition.x, textPosition.y))
            }
        }, this)
    }

    /**
     * Draw cusps
     */
    drawCusps(): void {
        if (this.data.cusps == null) {
            return
        }

        let lines,
            linesSolid,
            linesStartRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO
        const
            linesEndRadius = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius),
            linesSolidStartRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO,
            linesSolidEndRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO + this.settings.OFFSET_CENTER_OUTER_CIRCLE * this.settings.SYMBOL_SCALE
        const universe = this.universe
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CUSPS, this.paper.root.id)

        const numbersRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO + (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE) + this.settings.OFFSET_NUMBERS

        const AS = 0
        const IC = 3
        const DC = 6
        const MC = 9
        const mainAxis = [AS, IC, DC, MC]

        // Cusps
        for (let i = 0, ln = this.data.cusps.length; i < ln; i++) {
            // Draws a dashed line when an point is in the way

            if (this.settings.showCentralOuterCircle) {
                linesStartRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO + this.settings.OFFSET_CENTER_OUTER_CIRCLE * this.settings.SYMBOL_SCALE
            }

            lines = getDashedLinesPositions(
                this.cx,
                this.cy,
                this.data.cusps[i] + this.shift,
                linesStartRadius,
                linesEndRadius,
                this.pointRadius,
                this.locatedPoints,
                this.settings
            )

            lines.forEach(function (line) {
                const newLine = this.paper.line(line.startX, line.startY, line.endX, line.endY)
                if (this.settings.showGradient) {
                    newLine.setAttribute('fill', 'none')
                } else {
                    newLine.setAttribute('stroke', this.settings.COLOR_LINES)
                }

                newLine.setAttribute('stroke-dasharray', this.settings.CUSPS_DASHARRAY)
                newLine.setAttribute('stroke-linecap', 'round')
                newLine.setAttribute('shape-rendering', 'geometricPrecision')
                newLine.setAttribute('stroke-dashoffset', '5')
                newLine.setAttribute('vector-effect', 'non-scaling-stroke')

                if (mainAxis.includes(i)) {
                    newLine.setAttribute('stroke-width', this.settings.CUSPS_STROKE)
                } else {
                    newLine.setAttribute('stroke-width', this.settings.CUSPS_STROKE)
                }

                wrapper.appendChild(newLine)
            }, this)


            if (this.settings.showCentralOuterCircle) {
                linesSolid = getDashedLinesPositions(
                    this.cx,
                    this.cy,
                    this.data.cusps[i] + this.shift,
                    linesSolidStartRadius,
                    linesSolidEndRadius,
                    this.pointRadius,
                    this.locatedPoints,
                    this.settings,
                    true
                )

                linesSolid.forEach(function (line) {
                    const newLine = this.paper.line(line.startX, line.startY, line.endX, line.endY)
                    if (this.settings.showGradient) {
                        newLine.setAttribute('fill', 'none')
                    } else {
                        newLine.setAttribute('stroke', this.settings.COLOR_LINES)
                    }
                    newLine.setAttribute('stroke-width', this.settings.CUSPS_STROKE_INNER)
                    wrapper.appendChild(newLine)
                }, this)
            }


            // Cup number
            const deg360 = radiansToDegree(2 * Math.PI)
            const startOfCusp = this.data.cusps[i]
            const endOfCusp = this.data.cusps[(i + 1) % 12]
            const gap = endOfCusp - startOfCusp > 0 ? endOfCusp - startOfCusp : endOfCusp - startOfCusp + deg360
            const textPosition = getPointPosition(this.cx, this.cy, numbersRadius, ((startOfCusp + gap / 2) % deg360) + this.shift, this.settings)
            wrapper.appendChild(this.paper.getSymbol((i + 1).toString(), textPosition.x, textPosition.y))
        }
    }

    /**
     * Draw aspects
     * @param{Array<Object> | null} customAspects - posible custom aspects to draw;
     */
    aspects(customAspects?: FormedAspect[] | null): Radix {
        const aspectsList = customAspects != null && Array.isArray(customAspects)
            ? customAspects
            : new AspectCalculator(this.toPoints, this.settings).radix(this.data.planets)

        const universe = this.universe
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_ASPECTS, this.paper.root.id)

        const duplicateCheck: string[] = []

        for (let i = 0, ln = aspectsList.length; i < ln; i++) {
            const key = aspectsList[i].aspect.name + '-' + aspectsList[i].point.name + '-' + aspectsList[i].toPoint.name
            const opositeKey = aspectsList[i].aspect.name + '-' + aspectsList[i].toPoint.name + '-' + aspectsList[i].point.name
            if (!duplicateCheck.includes(opositeKey)) {
                duplicateCheck.push(key)

                const startPoint = getPointPosition(this.cx, this.cy, this.radius / this.settings.ASPECTS_CIRCLE_RADIUS_RATIO, aspectsList[i].toPoint.position + this.shift, this.settings)
                const endPoint = getPointPosition(this.cx, this.cy, this.radius / this.settings.ASPECTS_CIRCLE_RADIUS_RATIO, aspectsList[i].point.position + this.shift, this.settings)

                if (this.settings.showAspectPoints) {
                    const
                        circleStart = this.paper.circle(startPoint.x, startPoint.y, this.settings.STROKE_ASPECTS * this.settings.ASPECT_POINT_SCALE),
                        circleEnd = this.paper.circle(endPoint.x, endPoint.y, this.settings.STROKE_ASPECTS * this.settings.ASPECT_POINT_SCALE)
                    if (this.settings.showGradient) {
                        circleStart.setAttribute('fill', 'none')
                        circleEnd.setAttribute('fill', 'none')
                    } else {
                        circleStart.setAttribute('fill', this.settings.COLOR_ASPECTS)
                        circleEnd.setAttribute('fill', this.settings.COLOR_ASPECTS)
                    }
                    wrapper.appendChild(circleStart)
                    wrapper.appendChild(circleEnd)
                }


                const line = this.paper.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
                if (this.settings.showGradient) {
                    line.setAttribute('fill', 'none')
                } else {
                    line.setAttribute('stroke', this.settings.COLOR_ASPECTS)
                }
                line.setAttribute('stroke-width', (this.settings.STROKE_ASPECTS * this.settings.SYMBOL_SCALE).toString())

                line.setAttribute('data-name', aspectsList[i].aspect.name)
                line.setAttribute('data-degree', aspectsList[i].aspect.degree.toString())
                line.setAttribute('data-point', aspectsList[i].point.name)
                line.setAttribute('data-toPoint', aspectsList[i].toPoint.name)
                line.setAttribute('data-precision', aspectsList[i].precision.toString())

                wrapper.appendChild(line)
            }
        }

        return this.context
    }

    /**
     * Add points of interest for aspects calculation
     * @param {Obect} points, {"As":[0],"Ic":[90],"Ds":[180],"Mc":[270]}
     * @see (this.settings.AspectCalculator( toPoints) )
     */
    addPointsOfInterest(points: Points): Radix {
        for (const point in points) {
            if (points.hasOwnProperty(point)) {
                this.toPoints[point] = points[point]
            }
        }

        return this.context
    }

    drawRuler(): void {
        const universe = this.universe
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_RULER, this.paper.root.id)

        const startRadius = (this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius))

        if (this.settings.showRulerRays) {
            const rays = getRulerPositions(this.cx, this.cy, startRadius, startRadius + this.rulerRadius, this.shift, this.settings)

            rays.forEach(function (ray) {
                const line = this.paper.line(ray.startX, ray.startY, ray.endX, ray.endY)
                if (this.settings.showGradient) {
                    line.setAttribute('fill', 'none')
                } else {
                    line.setAttribute('stroke', this.settings.COLOR_CIRCLES)
                }
                line.setAttribute('stroke-width', this.settings.RULER_RAY_STROKE)
                wrapper.appendChild(line)
            }, this)
        }

        const circle = this.paper.circle(this.cx, this.cy, startRadius)
        if (this.settings.showGradient) {
            circle.setAttribute('fill', 'none')
        } else {
            circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
        }
        circle.setAttribute('stroke-width', (this.settings.CIRCLE_RULER_STROKE * this.settings.SYMBOL_SCALE).toString())
        circle.setAttribute('stroke-dasharray', this.settings.CIRCLE_DASHARRAY_RULER)
        wrapper.appendChild(circle)
    }

    /**
     * Draw circles
     */
    drawCircles(): void {
        const universe = this.universe
        const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CIRCLES, this.paper.root.id)

        // indoor circle
        let circle = this.paper.circle(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO)
        if (this.settings.showGradient) {
            circle.setAttribute('fill', 'none')
        } else {
            circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
        }
        circle.setAttribute('stroke-width', (this.settings.CIRCLE_STROKE_CENTRAL).toString())
        circle.setAttribute('stroke-dasharray', this.settings.CIRCLE_DASHARRAY_CENTRAL)
        wrapper.appendChild(circle)
        if (this.settings.showCentralOuterCircle) {
            // indoor circle 2
            circle = this.paper.circle(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO + this.settings.OFFSET_CENTER_OUTER_CIRCLE * this.settings.SYMBOL_SCALE)
            if (this.settings.showGradient) {
                circle.setAttribute('fill', 'none')
            } else {
                circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
            }
            circle.setAttribute('stroke-width', (this.settings.CIRCLE_STROKE_CENTRAL).toString())
            circle.setAttribute('stroke-dasharray', this.settings.CIRCLE_DASHARRAY_CENTRAL_OUTER)
            wrapper.appendChild(circle)
        }

        // outdoor circle
        circle = this.paper.circle(this.cx, this.cy, this.radius)
        if (this.settings.showGradient) {
            circle.setAttribute('fill', 'none')
        } else {
            circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
        }
        circle.setAttribute('stroke-width', (this.settings.CIRCLE_STROKE_SIGNS_DISK_OUTER).toString())
        circle.setAttribute('stroke-dasharray', this.settings.CIRCLE_DASHARRAY_SIGNS_DISK_OUTER)
        wrapper.appendChild(circle)

        // inner circle
        circle = this.paper.circle(this.cx, this.cy, this.radius - this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO)
        if (this.settings.showGradient) {
            circle.setAttribute('fill', 'none')
        } else {
            circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
        }
        circle.setAttribute('stroke-width', (this.settings.CIRCLE_STROKE_SIGNS_DISK_INNER).toString())
        circle.setAttribute('stroke-dasharray', this.settings.CIRCLE_DASHARRAY_SIGNS_DISK_INNER)
        wrapper.appendChild(circle)

        if (this.settings.showOuterCircle) {
            // indoor circle 2
            circle = this.paper.circle(this.cx, this.cy, this.radius + this.settings.CIRCLE_OUTER_SHIFT)
            if (this.settings.showGradient) {
                circle.setAttribute('fill', 'none')
            } else {
                circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
            }
            circle.setAttribute('stroke-width', (this.settings.CIRCLE_STROKE_OUTER).toString())
            circle.setAttribute('stroke-dasharray', this.settings.CIRCLE_DASHARRAY_OUTER)
            wrapper.appendChild(circle)
        }

    }

    /**
     * Display transit horoscope
     *
     * @param {Object} data
     * @example
     *  {
     *    "planets":{"Moon":[0], "Sun":[30],  ... },
     *    "cusps":[300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274],  *
     *  }
     *
     * @return {Transit} transit
     */
    transit(data: AstroData): Transit {
        // remove axis (As, Ds, Mc, Ic) from radix
        getEmptyWrapper(this.document, this.universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_AXIS, this.paper.root.id)
        const transit = new Transit(this.document, this.context, data, this.settings)
        transit.drawBg()
        transit.drawPoints()
        transit.drawCusps()
        transit.drawRuler()
        transit.drawCircles()
        return transit
    }
}

export default Radix
