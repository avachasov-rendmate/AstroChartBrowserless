import Zodiac from './zodiac'
import AspectCalculator from './aspect'
import type { FormedAspect } from './aspect'
import { validate, getEmptyWrapper, getPointPosition, getRulerPositions, getDescriptionPosition, assemble, radiansToDegree } from './utils'
import type { AstroData, LocatedPoint, Points } from './radix'
import type Radix from './radix'
import type SVG from './svg'
import type { Settings } from './settings'

/**
   * Transit charts.
   *
   * @class
   * @public
   * @constructor
    * @param {this.settings.Radix} radix
   * @param {Object} data
   */
class Transit {
  document: any
  data: AstroData
  paper: SVG
  cx: number
  cy: number
  toPoints: Points
  radius: number
  settings: Settings
  rulerRadius: number
  pointRadius: number
  shift: number
  universe: Element
  context: this
  locatedPoints: LocatedPoint[]
  constructor(document: any, radix: Radix, data: AstroData, settings: Settings) {
    // Validate data
    const status = validate(data)
    if (status.hasError) {
      throw new Error(status.messages.join(' | '))
    }

    this.document = document
    this.data = data
    this.paper = radix.paper
    this.cx = radix.cx
    this.cy = radix.cy
    this.toPoints = radix.toPoints
    this.radius = radix.radius
    this.settings = settings

    this.rulerRadius = ((this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / this.settings.RULER_RADIUS)
    this.pointRadius = this.radius + (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + (this.settings.PADDING * this.settings.SYMBOL_SCALE))

    this.shift = radix.shift

    this.universe = this.document.createElementNS(this.paper.root.namespaceURI, 'g')
    this.universe.setAttribute('id', this.paper._paperElementId + '-' + this.settings.ID_TRANSIT)
    this.paper.root.appendChild(this.universe)

    this.context = this
  }

  /**
   * Draw background
   */
  drawBg(): void {
    if (!this.settings.showGradient) {
      const universe = this.universe

      const wrapper = getEmptyWrapper(this.document, universe, this.paper._paperElementId + '-' + this.settings.ID_BG, this.paper._paperElementId)

      const LARGE_ARC_FLAG = 1
      const start = 0 // degree
      const end = 359.99 // degree
      const hemisphere = this.paper.segment(this.cx, this.cy, this.radius + this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO, start, end, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, LARGE_ARC_FLAG)
      hemisphere.setAttribute('fill', this.settings.STROKE_ONLY ? 'none' : this.settings.COLOR_BACKGROUND)
      wrapper.appendChild(hemisphere)
    }
  }

  /**
   * Draw planets
   *
   * @param{undefined | Object} planetsData, posible data planets to draw
   */
  drawPoints(planetsData?: Points): void {
    if (this.settings.OUTER_SYMBOLS) {
      const planets = (planetsData == null) ? this.data.planets : planetsData
      if (planets == null) {
        return
      }

      const universe = this.universe
      const wrapper = getEmptyWrapper(this.document, universe, this.paper._paperElementId + '-' + this.settings.ID_TRANSIT + '-' + this.settings.ID_POINTS, this.paper._paperElementId)

      const gap = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO)
      const step = (gap - 2 * (this.settings.PADDING * this.settings.SYMBOL_SCALE)) / Object.keys(planets).length

      const pointerRadius = this.radius + (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO)
      let startPosition
      let endPosition

      this.locatedPoints = []
      for (const planet in planets) {
        if (planets.hasOwnProperty(planet)) {
          const position = getPointPosition(this.cx, this.cy, this.pointRadius, planets[planet][0] + this.shift, this.settings)
          const point = { name: planet, x: position.x, y: position.y, r: (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE), angle: planets[planet][0] + this.shift, pointer: planets[planet][0] + this.shift }
          this.locatedPoints = assemble(this.locatedPoints, point, { cx: this.cx, cy: this.cy, r: this.pointRadius }, this.settings)
        }
      }

      if (this.settings.DEBUG) console.log('Transit count of points: ' + this.locatedPoints.length)
      if (this.settings.DEBUG) console.log('Transit located points:\n' + JSON.stringify(this.locatedPoints))
      this.locatedPoints.forEach(function (point) {
        // draw pointer
        startPosition = getPointPosition(this.cx, this.cy, pointerRadius, planets[point.name][0] + this.shift, this.settings)
        endPosition = getPointPosition(this.cx, this.cy, pointerRadius + this.rulerRadius / 2, planets[point.name][0] + this.shift, this.settings)
        const pointer = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
        if (this.settings.showGradient) {
          pointer.setAttribute('fill', 'none')
        } else {
          pointer.setAttribute('stroke', this.settings.COLOR_CIRCLES)
        }
        pointer.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
        wrapper.appendChild(pointer)

        // draw pointer line
        if (!this.settings.STROKE_ONLY && (planets[point.name][0] + this.shift) !== point.angle) {
          startPosition = endPosition
          endPosition = getPointPosition(this.cx, this.cy, this.pointRadius - (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE), point.angle, this.settings)
          const line = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
          if (this.settings.showGradient) {
            line.setAttribute('fill', 'none')
          } else {
            line.setAttribute('stroke', this.settings.COLOR_LINES)
          }
          line.setAttribute('stroke-width', 0.5 * (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
          wrapper.appendChild(line)
        }

        // draw symbol
        const symbol = this.paper.getSymbol(point.name, point.x, point.y)
        symbol.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_TRANSIT + '-' + this.settings.ID_POINTS + '-' + point.name)
        wrapper.appendChild(symbol)

        // draw point descriptions
        let textsToShow = [(Math.floor(planets[point.name][0]) % 30).toString()]

        const zodiac = new Zodiac(this.data.cusps, this.settings)
        if (planets[point.name][1] && zodiac.isRetrograde(planets[point.name][1])) {
          textsToShow.push('R')
        } else {
          textsToShow.push('')
        }
        textsToShow = textsToShow.concat(zodiac.getDignities({ name: point.name, position: planets[point.name][0] }, this.settings.DIGNITIES_EXACT_EXALTATION_DEFAULT).join(','))

        const pointDescriptions = getDescriptionPosition(point, textsToShow, this.settings)
        pointDescriptions.forEach(function (dsc) {
          wrapper.appendChild(this.paper.text(dsc.text, dsc.x, dsc.y, this.settings.POINTS_TEXT_SIZE, this.settings.COLOR_NUMBERS))
        }, this)
      }, this)
    }
  }

  /**
 * Draw circles
 */
  drawCircles(): void {
    const universe = this.universe
    const wrapper = getEmptyWrapper(this.document, universe, this.paper._paperElementId + '-' + this.settings.ID_TRANSIT + '-' + this.settings.ID_CIRCLES, this.paper._paperElementId)
    const radius = this.radius + this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO

    const circle = this.paper.circle(this.cx, this.cy, radius)
    if(this.settings.showGradient) {
      circle.setAttribute('fill', 'none')
    } else {
      circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
    }
    circle.setAttribute('stroke-width', (this.settings.CIRCLE_STROKE_OUTER * this.settings.SYMBOL_SCALE).toString())
    wrapper.appendChild(circle)
  }

  /**
 * Draw cusps
 * @param{undefined | Object} cuspsData, posible data cusps to draw
 */
  drawCusps(cuspsData?: number[]): void {
    const cusps = (cuspsData == null) ? this.data.cusps : cuspsData
    if (cusps == null) {
      return
    }

    let bottomPosition
    const universe = this.universe
    const wrapper = getEmptyWrapper(this.document, universe, this.paper._paperElementId + '-' + this.settings.ID_TRANSIT + '-' + this.settings.ID_CUSPS, this.paper._paperElementId)
    const numbersRadius = this.radius + ((this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO - this.rulerRadius) / 2)

    const AS = 0
    const IC = 3
    const DC = 6
    const MC = 9
    const mainAxis = [AS, IC, DC, MC]

    // Cusps
    for (let i = 0, ln = cusps.length; i < ln; i++) {
      // Lines
      const startPosition = bottomPosition = getPointPosition(this.cx, this.cy, this.radius, cusps[i] + this.shift, this.settings)
      const endPosition = getPointPosition(this.cx, this.cy, this.radius + this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO - this.rulerRadius, cusps[i] + this.shift, this.settings)
      const line = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
      if (this.settings.showGradient) {
        line.setAttribute('fill', 'none')
      } else {
        line.setAttribute('stroke', this.settings.COLOR_LINES)
      }
      line.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())

      wrapper.appendChild(line)

      // Cup number
      const deg360 = radiansToDegree(2 * Math.PI)
      const startOfCusp = cusps[i]
      const endOfCusp = cusps[(i + 1) % 12]
      const gap = endOfCusp - startOfCusp > 0 ? endOfCusp - startOfCusp : endOfCusp - startOfCusp + deg360
      const textPosition = getPointPosition(this.cx, this.cy, numbersRadius, ((startOfCusp + gap / 2) % deg360) + this.shift, this.settings)
      wrapper.appendChild(this.paper.getSymbol((i + 1).toString(), textPosition.x, textPosition.y))
    }
  }

  drawRuler(): void {
    const universe = this.universe
    const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_TRANSIT + '-' + this.settings.ID_RULER, this.paper._paperElementId)

    const startRadius = (this.radius + (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO))
    const rays = getRulerPositions(this.cx, this.cy, startRadius, startRadius - this.rulerRadius, this.shift, this.settings)

    rays.forEach(function (ray) {
      const line = this.paper.line(ray.startX, ray.startY, ray.endX, ray.endY)
      if (this.settings.showGradient) {
        line.setAttribute('fill', 'none')
      } else {
        line.setAttribute('stroke', this.settings.COLOR_CIRCLES)
      }
      line.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
      wrapper.appendChild(line)
    }, this)

    const circle = this.paper.circle(this.cx, this.cy, startRadius - this.rulerRadius)
    if (this.settings.showGradient) {
      circle.setAttribute('fill', 'none')
    } else {
      circle.setAttribute('stroke', this.settings.COLOR_CIRCLES)
    }
    circle.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    wrapper.appendChild(circle)
  }

  /**
 * Draw aspects
 * @param{Array<Object> | null} customAspects - posible custom aspects to draw;
 */
  aspects(customAspects: FormedAspect[]): Transit {
    const aspectsList = customAspects != null && Array.isArray(customAspects)
      ? customAspects
      : new AspectCalculator(this.toPoints, this.settings).transit(this.data.planets)

    const universe = this.universe
    const wrapper = getEmptyWrapper(this.document, universe, this.paper.root.id + '-' + this.settings.ID_ASPECTS, this.paper._paperElementId)

    for (let i = 0, ln = aspectsList.length; i < ln; i++) {
      const startPoint = getPointPosition(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, aspectsList[i].toPoint.position + this.shift, this.settings)
      const endPoint = getPointPosition(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, aspectsList[i].point.position + this.shift, this.settings)

      const line = this.paper.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
      if (this.settings.showGradient) {
        line.setAttribute('fill', 'none')
      } else {
        line.setAttribute('stroke', this.settings.STROKE_ONLY ? this.settings.COLOR_LINES : aspectsList[i].aspect.color)
      }
      line.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())

      line.setAttribute('data-name', aspectsList[i].aspect.name)
      line.setAttribute('data-degree', aspectsList[i].aspect.degree.toString())
      line.setAttribute('data-point', aspectsList[i].point.name)
      line.setAttribute('data-toPoint', aspectsList[i].toPoint.name)
      line.setAttribute('data-precision', aspectsList[i].precision.toString())

      wrapper.appendChild(line)
    }

    // this
    return this.context
  }
}

export default Transit
