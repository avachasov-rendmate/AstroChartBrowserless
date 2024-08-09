import default_settings from './settings' 
import type { Settings } from './settings'
import Radix from './radix'
import type { AstroData } from './radix'
import SVG from './svg'
import { getPointPosition } from './utils'
/**
 * Displays astrology charts.
 *
 * @class
 * @public
 * @constructor
 * @param {String} elementId - root DOMElement
 * @param {int} width
 * @param {int} height
 * @param {Object} settings
 */

class Chart {
  paper: SVG
  document: any
  cx: number
  cy: number
  radius: number
  settings: Settings
  constructor (document: any, elementId: string, width: number, height: number, settings?: Partial<Settings>) {
    this.document = document
    this.settings = {
      ...default_settings,
      ...settings
    }
    if ((elementId !== '') && (this.document.getElementById(elementId) == null)) {
      const paper = this.document.createElement('div')
      paper.setAttribute('id', elementId)
      this.document.body.appendChild(paper)
    }

    this.paper = new SVG(this.document, elementId, width, height, this.settings)
    this.cx = this.paper.width / 2
    this.cy = this.paper.height / 2
    this.radius = this.paper.height / 2 - this.settings.MARGIN
  }

  destroy (): void {
    this.settings = default_settings
  }

  /**
 * Display radix horoscope
 *
 * @param {Object} data
 * @example
 *  {
 *    "points":{"Moon":[0], "Sun":[30],  ... },
 *    "cusps":[300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274]
 *  }
 *
 * @return {Radix} radix
 */
  radix (data: AstroData): Radix {
    const radix = new Radix(this.document, this.paper, this.cx, this.cy, this.radius, data, this.settings)

    radix.drawBg()
    radix.drawUniverse()
    radix.drawRuler()
    radix.drawPoints()
    radix.drawCusps()
    radix.drawAxis()
    radix.drawCircles()

    return radix
  }

  /**
   * Scale chart
   *
   * @param {int} factor
   */
  scale (factor: number): void {
    this.paper.root.setAttribute('transform', 'translate(' + (-this.cx * (factor - 1)) + ',' + (-this.cy * (factor - 1)) + ') scale(' + factor + ')')
  }

  /**
   * Draw the symbol on the axis.
   * For debug only.
   *
   */
  calibrate (): Chart {
    let positions
    let circle
    let line
    const startRadius = 60

    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'Lilith', 'NNode']

    for (let planet = 0; planet < planets.length; planet++) {
      positions = getPointPosition(this.cx, this.cy, this.radius * 2, planet * 30, this.settings)

      line = this.paper.line(this.cx, this.cy, positions.x, positions.y)
      if (this.settings.GRADIENT_ENABLED) {
        line.setAttribute('fill', 'none')
      } else {
        line.setAttribute('stroke', this.settings.COLOR_LINES)
      }
      this.paper.root.appendChild(line)

      circle = this.paper.circle(this.cx, this.cy, startRadius + startRadius * planet)
      if (this.settings.GRADIENT_ENABLED) {
        circle.setAttribute('fill', 'none')
      } else {
        circle.setAttribute('stroke', this.settings.COLOR_LINES)
      }
      circle.setAttribute('stroke-width', '1')
      this.paper.root.appendChild(circle)
    }

    for (let n = 0, ln = planets.length; n < ln; n++) {
      const radius = startRadius + startRadius * n

      for (let i = 0; i < 12; i++) {
        positions = getPointPosition(this.cx, this.cy, radius, i * 30, this.settings)

        circle = this.paper.circle(positions.x, positions.y, this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE)
        circle.setAttribute('stroke', 'red')
        circle.setAttribute('stroke-width', '1')
        this.paper.root.appendChild(circle)

        this.paper.root.appendChild(this.paper.getSymbol(planets[n], positions.x, positions.y))
      }
    }

    return this
  }
}

export default Chart
