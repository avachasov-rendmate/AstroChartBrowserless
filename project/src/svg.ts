import type {Settings} from './settings'
import Symbols from './symbols'
import symbols from "./symbols";

/**
 * SVG tools.
 *
 * @class
 * @public
 * @constructor
 * @param {String} elementId - root DOM Element
 * @param {int} width
 * @param {int} height
 */
class SVG {
    settings: Settings
    _paperElementId: string
    DOMElement: SVGSVGElement
    root: Element
    document: any
    symbols: Symbols
    width: number
    height: number
    context: this

    constructor(document: any, elementId: string, width: number, height: number, settings: Settings) {
        this.settings = settings
        this.document = document
        this.symbols = new Symbols(this.settings)

        const rootElement = this.document.getElementById(elementId)
        if (rootElement == null) throw new Error('Root element not found')

        const svg = this.document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        svg.setAttribute('id', elementId + '-svg')
        svg.setAttribute('style', 'position: relative; overflow: hidden;')
        svg.setAttribute('version', '1.1')
        svg.setAttribute('width', width.toString())
        svg.setAttribute('height', height.toString())
        svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height)
        rootElement.appendChild(svg)
        this._paperElementId = elementId + '-' + this.settings.ID_CHART

        const wrapper = this.document.createElementNS(svg.namespaceURI, 'g')
        wrapper.setAttribute('id', this._paperElementId)

        if (this.settings.showGradient) {
            const
                defs = this.document.createElementNS(svg.namespaceURI, 'defs'),
                gradientDefId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                gradientMaskId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                gradientDef = this.document.createElementNS(svg.namespaceURI, `${this.settings.GRADIENT.type}Gradient`),
                gradientMask = this.document.createElementNS(svg.namespaceURI, `${this.settings.GRADIENT.type}Gradient`),
                start = this.document.createElementNS(svg.namespaceURI, 'stop'),
                stop = this.document.createElementNS(svg.namespaceURI, 'stop')

            gradientDef.setAttribute('id', gradientDefId)
            gradientDef.setAttribute('gradientUnits', 'userSpaceOnUse')

            // x1="0" y1="0" x2="200" y2="200"
            gradientDef.setAttribute('x1', 0)
            gradientDef.setAttribute('y1', 0)
            gradientDef.setAttribute('x2', width)
            gradientDef.setAttribute('y2', height)


            gradientDef.setAttribute('gradientTransform', `rotate(${this.settings.GRADIENT.rotation || 0})`)
            start.setAttribute('stop-color', this.settings.GRADIENT.start)
            start.setAttribute('offset', '0')
            start.setAttribute('stop-opacity', '1')
            stop.setAttribute('stop-color', this.settings.GRADIENT.stop)
            stop.setAttribute('offset', '1')
            stop.setAttribute('stop-opacity', '1')
            gradientDef.appendChild(start)
            gradientDef.appendChild(stop)

            // gradientMask.setAttribute('id', gradientMaskId)
            // gradientMask.setAttribute('xlink:href', `#${gradientDefId}`)
            // gradientMask.setAttribute('gradientUnits', 'userSpaceOnUse')
            //
            // gradientDef.appendChild(start)
            // gradientDef.appendChild(stop)

            defs.appendChild(gradientDef)
            // defs.appendChild(gradientMask)
            svg.appendChild(defs)
            wrapper.setAttribute('style', `fill:url('#${gradientDefId}');fill-opacity:1; stroke:url('#${gradientDefId}')`)
        }
        svg.appendChild(wrapper)

        this.DOMElement = svg
        this.root = wrapper
        this.width = width
        this.height = height

        this.context = this
    }

    _getSymbol(name: string, x: number, y: number, color?: string): Element {
        switch (name) {
            case this.settings.SYMBOL_SUN:
                return this.sun(x, y)
            case this.settings.SYMBOL_MOON:
                return this.moon(x, y)
            case this.settings.SYMBOL_MERCURY:
                return this.mercury(x, y)
            case this.settings.SYMBOL_SIRIUS:
                return this.sirius(x, y)
            case this.settings.SYMBOL_VENUS:
                return this.venus(x, y)
            case this.settings.SYMBOL_MARS:
                return this.mars(x, y)
            case this.settings.SYMBOL_JUPITER:
                return this.jupiter(x, y)
            case this.settings.SYMBOL_SATURN:
                return this.saturn(x, y)
            case this.settings.SYMBOL_URANUS:
                return this.uranus(x, y)
            case this.settings.SYMBOL_NEPTUNE:
                return this.neptune(x, y)
            case this.settings.SYMBOL_PLUTO:
                return this.pluto(x, y)
            case this.settings.SYMBOL_CHIRON:
                return this.chiron(x, y)
            case this.settings.SYMBOL_LILITH:
                return this.lilith(x, y)
            case this.settings.SYMBOL_NNODE:
                return this.nnode(x, y)
            case this.settings.SYMBOL_SNODE:
                return this.snode(x, y)
            case this.settings.SYMBOL_FORTUNE:
                return this.fortune(x, y)
            case this.settings.SYMBOL_ARIES:
                return this.aries(x, y, color as string)
            case this.settings.SYMBOL_TAURUS:
                return this.taurus(x, y, color as string)
            case this.settings.SYMBOL_GEMINI:
                return this.gemini(x, y, color as string)
            case this.settings.SYMBOL_CANCER:
                return this.cancer(x, y, color as string)
            case this.settings.SYMBOL_LEO:
                return this.leo(x, y, color as string)
            case this.settings.SYMBOL_VIRGO:
                return this.virgo(x, y, color as string)
            case this.settings.SYMBOL_LIBRA:
                return this.libra(x, y, color as string)
            case this.settings.SYMBOL_SCORPIO:
                return this.scorpio(x, y, color as string)
            case this.settings.SYMBOL_SAGITTARIUS:
                return this.sagittarius(x, y, color as string)
            case this.settings.SYMBOL_CAPRICORN:
                return this.capricorn(x, y, color as string)
            case this.settings.SYMBOL_AQUARIUS:
                return this.aquarius(x, y, color as string)
            case this.settings.SYMBOL_PISCES:
                return this.pisces(x, y, color as string)
            case this.settings.SYMBOL_AS:
                return this.ascendant(x, y)
            case this.settings.SYMBOL_DS:
                return this.descendant(x, y)
            case this.settings.SYMBOL_MC:
                return this.mediumCoeli(x, y)
            case this.settings.SYMBOL_IC:
                return this.immumCoeli(x, y)
            case this.settings.SYMBOL_CUSP_1:
                return this.number1(x, y)
            case this.settings.SYMBOL_CUSP_2:
                return this.number2(x, y)
            case this.settings.SYMBOL_CUSP_3:
                return this.number3(x, y)
            case this.settings.SYMBOL_CUSP_4:
                return this.number4(x, y)
            case this.settings.SYMBOL_CUSP_5:
                return this.number5(x, y)
            case this.settings.SYMBOL_CUSP_6:
                return this.number6(x, y)
            case this.settings.SYMBOL_CUSP_7:
                return this.number7(x, y)
            case this.settings.SYMBOL_CUSP_8:
                return this.number8(x, y)
            case this.settings.SYMBOL_CUSP_9:
                return this.number9(x, y)
            case this.settings.SYMBOL_CUSP_10:
                return this.number10(x, y)
            case this.settings.SYMBOL_CUSP_11:
                return this.number11(x, y)
            case this.settings.SYMBOL_CUSP_12:
                return this.number12(x, y)
            default: {
                const unknownPoint = this.circle(x, y, 8)
                unknownPoint.setAttribute('stroke', '#ffff00')
                unknownPoint.setAttribute('stroke-width', '1')
                unknownPoint.setAttribute('fill', '#ff0000')
                return unknownPoint
            }
        }
    }

    /**
     * Get a required symbol.
     *
     * @param {String} name
     * @param {int} x
     * @param {int} y
     *
     * @return {SVGElement g}
     */
    getSymbol(name: string, x: number, y: number, color?: string): Element {
        if (this.settings.CUSTOM_SYMBOL_FN == null) return this._getSymbol(name, x, y, color)

        const symbol = this.settings.CUSTOM_SYMBOL_FN(name, x, y, this.context)
        if (symbol == null || symbol === undefined) return this._getSymbol(name, x, y, color)

        return symbol
    }

    /**
     * Create transparent rectangle.
     *
     * Used to improve area click, @see this.settings.ADD_CLICK_AREA
     *
     * @param {Number} x
     * @param {Number} y
     *
     * @return {Element} rect
     */
    createRectForClick(x: number, y: number): Element {
        const rect = this.document.createElementNS(this.context.root.namespaceURI, 'rect')
        rect.setAttribute('x', (x - this.settings.SIGNS_STROKE).toString())
        rect.setAttribute('y', (y - this.settings.SIGNS_STROKE).toString())
        rect.setAttribute('width', '20px')
        rect.setAttribute('height', '20px')
        rect.setAttribute('fill', 'transparent')
        return rect
    }

    /**
     * Get ID for sign wrapper.
     *
     * @param {String} sign
     *
     * @return {String id}
     */
    getSignWrapperId(sign: string): string {
        return this._paperElementId + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_SIGNS + '-' + sign
    }

    /**
     * Get ID for house wrapper.
     *
     * @param {String} house
     *
     * @return {String id}
     */
    getHouseIdWrapper(house: string): string {
        return this._paperElementId + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CUSPS + '-' + house
    }

    setPointColor(node: Element): void {
        if (!this.settings.showGradient) {
            node.setAttribute('stroke', this.settings.COLOR_POINTS)
        }
        node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
        node.setAttribute('fill', 'none')
    }

    setSignColor(node: Element, color: string): void {
        if (!this.settings.showGradient) {
            node.setAttribute('stroke', color)
            node.setAttribute('fill', color)
        }
        node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    }
    setAxisColor(node: Element): void {
        if (!this.settings.showGradient) {
            node.setAttribute('stroke', this.settings.COLOR_AXIS_FONT)
        }
        node.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE).toString())
        node.setAttribute('fill', 'none')
    }
    setNumberColor(node: Element): void {
        if (!this.settings.showGradient) {
            node.setAttribute('stroke', this.settings.COLOR_NUMBERS)
            node.setAttribute('fill', this.settings.COLOR_NUMBERS)
        }
        node.setAttribute('stroke-width', (this.settings.NUMBER_STROKE * this.settings.SYMBOL_SCALE).toString())
    }

    /*
     * Sun path
     * @private
     *
     * @param {int} x
     * @param {int} y
     *
     * @return {SVG g}
     */
    sun(x: number, y: number): Element {
        // center symbol
        const xShift = -1 // px
        const yShift = -8 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    sirius(x: number, y: number): Element { // todo: implement when designer will draw icon
        // center symbol
        const xShift = -1 // px
        const yShift = -8 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + '')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Moon path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    moon(x: number, y: number): Element {
        // center symbol
        const xShift = -2 // px
        const yShift = -7 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Mercury path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    mercury(x: number, y: number): Element {
        // center symbol
        const xShift = -2 // px
        const yShift = 7 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const body = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        body.setAttribute('d', 'm' + x + ', ' + y + ' 4.26011,0 m -2.13005,-2.98207 0,5.11213 m 4.70312,-9.7983 a 4.70315,4.70315 0 0 1 -4.70315,4.70314 4.70315,4.70315 0 0 1 -4.70314,-4.70314 4.70315,4.70315 0 0 1 4.70314,-4.70315 4.70315,4.70315 0 0 1 4.70315,4.70315 z')
        this.setPointColor(body)
        wrapper.appendChild(body)

        const crownXShift = 6 // px
        const crownYShift = -16 // px
        const crown = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        crown.setAttribute('d', 'm' + (x + crownXShift) + ', ' + (y + crownYShift) + ' a 3.9717855,3.9717855 0 0 1 -3.95541,3.59054 3.9717855,3.9717855 0 0 1 -3.95185,-3.59445')
        this.setPointColor(crown)
        wrapper.appendChild(crown)

        return wrapper
    }

    /*
   * Venus path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    venus(x: number, y: number): Element {
        // center symbol
        const xShift = 2 // px
        const yShift = 7 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Mars path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    mars(x: number, y: number): Element {
        // center symbol
        const xShift = 2 // px
        const yShift = -2 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Jupiter path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    jupiter(x: number, y: number): Element {
        // center symbol
        const xShift = -5 // px
        const yShift = -2 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279')
        this.setPointColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y - 3))

        return wrapper
    }

    /*
   * Saturn path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    saturn(x: number, y: number): Element {
        // center symbol
        const xShift = 5 // px
        const yShift = 10 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Uranus path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    uranus(x: number, y: number): Element {
        // center symbol
        const xShift = -5 // px
        const yShift = -7 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const horns = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        horns.setAttribute('d', 'm' + x + ', ' + y + '  0,10.23824 m 10.23633,-10.32764 0,10.23824 m -10.26606,-4.6394 10.23085,0 m -5.06415,-5.51532 0,11.94985')
        this.setPointColor(horns)
        wrapper.appendChild(horns)

        const bodyXShift = 7 // px
        const bodyYShift = 14.5 // px
        const body = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        body.setAttribute('d', 'm' + (x + bodyXShift) + ', ' + (y + bodyYShift) + ' a 1.8384377,1.8384377 0 0 1 -1.83844,1.83843 1.8384377,1.8384377 0 0 1 -1.83842,-1.83843 1.8384377,1.8384377 0 0 1 1.83842,-1.83844 1.8384377,1.8384377 0 0 1 1.83844,1.83844 z')
        this.setPointColor(body)
        wrapper.appendChild(body)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))

        return wrapper
    }

    /*
   * Neptune path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    neptune(x: number, y: number): Element {
        // center symbol
        const xShift = 3 // px
        const yShift = -5 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Pluto path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    pluto(x: number, y: number): Element {
        // center symbol
        const xShift = 5 // px
        const yShift = -5 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const body = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        body.setAttribute('d', 'm' + x + ', ' + y + ' a 5.7676856,5.7676856 0 0 1 -2.88385,4.99496 5.7676856,5.7676856 0 0 1 -5.76768,0 5.7676856,5.7676856 0 0 1 -2.88385,-4.99496 m 5.76771,13.93858 0,-8.17088 m -3.84512,4.32576 7.69024,0')
        this.setPointColor(body)
        wrapper.appendChild(body)

        const headXShift = -2.3 // px
        const headYShift = 0 // px
        const head = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        head.setAttribute('d', 'm' + (x + headXShift) + ', ' + (y + headYShift) + ' a 3.3644834,3.3644834 0 0 1 -3.36448,3.36449 3.3644834,3.3644834 0 0 1 -3.36448,-3.36449 3.3644834,3.3644834 0 0 1 3.36448,-3.36448 3.3644834,3.3644834 0 0 1 3.36448,3.36448 z')
        this.setPointColor(head)
        wrapper.appendChild(head)

        return wrapper
    }

    /*
   * Chiron path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    chiron(x: number, y: number): Element {
        // center symbol
        const xShift = 3 // px
        const yShift = 5 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const body = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        body.setAttribute('d', 'm' + x + ', ' + y + ' a 3.8764725,3.0675249 0 0 1 -3.876473,3.067525 3.8764725,3.0675249 0 0 1 -3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876473,3.067525 z')
        this.setPointColor(body)
        wrapper.appendChild(body)

        const headXShift = 0 // px
        const headYShift = -13 // px
        const head = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        head.setAttribute('d', 'm' + (x + headXShift) + ', ' + (y + headYShift) + '   -3.942997,4.243844 4.110849,3.656151 m -4.867569,-9.009468 0,11.727251')
        this.setPointColor(head)
        wrapper.appendChild(head)

        return wrapper
    }

    /*
   * Lilith path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    lilith(x: number, y: number): Element {
        // center symbol
        const xShift = 2 // px
        const yShift = 4 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * NNode path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    nnode(x: number, y: number): Element {
        // center symbol
        const xShift = -2 // px
        const yShift = 3 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * SNode path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    snode(x: number, y: number): Element {
        // center symbol
        const xShift = 0
        const yShift = -5

        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm' + x + ', ' + y + ' l1.3333282470703125,0.666656494140625l0.6666717529296875,0l1.3333282470703125,-0.666656494140625l0.6666717529296875,-1.333343505859375l0,-0.666656494140625l-0.6666717529296875,-1.333343505859375l-1.3333282470703125,-0.666656494140625l-0.6666717529296875,0l-1.3333282470703125,0.666656494140625l-0.6666717529296875,1.333343505859375l0,0.666656494140625l0.6666717529296875,1.333343505859375l2,2.666656494140625l0.6666717529296875,2l0,1.333343505859375l-0.6666717529296875,2l-1.3333282470703125,1.333343505859375l-2,0.666656494140625l-2.6666717529296875,0l-2,-0.666656494140625l-1.3333282470703125,-1.333343505859375l-0.6666717529296875,-2l0,-1.333343505859375l0.6666717529296875,-2l2,-2.666656494140625l0.666656494140625,-1.333343505859375l0,-0.666656494140625l-0.666656494140625,-1.333343505859375l-1.333343505859375,-0.666656494140625l-0.666656494140625,0l-1.333343505859375,0.666656494140625l-0.666656494140625,1.333343505859375l0,0.666656494140625l0.666656494140625,1.333343505859375l1.333343505859375,0.666656494140625l0.666656494140625,0l1.333343505859375,-0.666656494140625m8,6l-0.6666717529296875,1.333343505859375l-1.3333282470703125,1.33331298828125l-2,0.66668701171875l-2.6666717529296875,0l-2,-0.66668701171875l-1.3333282470703125,-1.33331298828125l-0.6666717529296875,-1.333343505859375')
        this.setPointColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /*
   * Fortune path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    fortune(x: number, y: number): Element {
        // center symbol
        const xShift = -10
        const yShift = -8
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')

        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const path1 = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        path1.setAttribute('d', 'M15.971322059631348,8.000000953674316A7.971322252863855,7.971322252863855,0,0,1,8,15.97132396697998A7.971322252863855,7.971322252863855,0,0,1,0.028678132221102715,8.000000953674316A7.971322252863855,7.971322252863855,0,0,1,8,0.028677448630332947A7.971322252863855,7.971322252863855,0,0,1,15.971322059631348,8.000000953674316Z')
        const path2 = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        path2.setAttribute('d', 'M2.668839454650879,2.043858766555786C6.304587364196777,5.906839370727539,9.94033432006836,9.769822120666504,13.576082229614258,13.632804870605469')
        const path3 = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        path3.setAttribute('d', 'm2.5541272163391113,13.747519493103027c3.635746955871582,-3.8629846572875977,7.271494388580322,-7.72596549987793,10.90724229812622,-11.588947772979736')
        const fortuneGroup = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        fortuneGroup.setAttribute('transform', 'translate(' + x + ',' + y + ')')
        fortuneGroup.appendChild(path1)
        fortuneGroup.appendChild(path2)
        fortuneGroup.appendChild(path3)
        this.setPointColor(fortuneGroup)
        wrapper.appendChild(fortuneGroup)


        return wrapper
    }
    addZodiacSymbol(x: number, y: number, symbol: any, color: string): Element {
        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        // wrapper.style.transformOrigin = 'center'
        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        const
            cx = symbol.shift.x + x,
            cy = symbol.shift.y + y

        node.style.transformOrigin = `${cx}px ${cy}px`
        node.setAttribute('transform', `scale(${this.settings.SYMBOL_SCALE})`)
        this.setSignColor(node, color)
        wrapper.appendChild(node)

        wrapper.setAttribute('transform',
            this.symbols.getRotation(x, y)
        )

        return wrapper
    }
    /*
   * Aries symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    aries(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_ARIES
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Taurus symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    taurus(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_TAURUS
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Gemini symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    gemini(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_GEMINI
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Cancer symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    cancer(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_CANCER
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Leo symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    leo(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_LEO
            )

        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Virgo symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    virgo(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_VIRGO
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Libra symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    libra(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_LIBRA
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Scorpio symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    scorpio(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_SCORPIO
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Sagittarius symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    sagittarius(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_SAGITTARIUS
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Capricorn symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    capricorn(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_CAPRICORN
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Aquarius symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    aquarius(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_AQUARIUS
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /*
   * Pisces symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
    pisces(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'zodiac',
                this.settings.STYLE_ZODIAC_SIGNS,
                this.settings.SYMBOL_PISCES
            )
        return this.addZodiacSymbol(x, y, symbol, color)
    }

    /**
     * Draw As symbol
     */
    ascendant(x: number, y: number): Element {
        // center symbol
        const xShift = 12 // px
        const yShift = -2 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm ' + x + ', ' + y + ' -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0')
        this.setAxisColor(node)

        wrapper.appendChild(node)

        return wrapper
    }

    /**
     * Draw Ds symbol
     */
    descendant(x: number, y: number): Element {
        // center symbol
        const xShift = 22 // px
        const yShift = -1 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm ' + x + ', ' + y + ' -0.5625,-1.125 -1.6875,-0.5625 -1.6875,0 -1.6875,0.5625 -0.5625,1.125 0.5625,1.125 1.125,0.5625 2.8125,0.5625 1.125,0.5625 0.5625,1.125 0,0.5625 -0.5625,1.125 -1.6875,0.5625 -1.6875,0 -1.6875,-0.5625 -0.5625,-1.125 m -11.25,-10.125 0,11.8125 m 0,-11.8125 3.9375,0 1.6875,0.5625 1.125,1.125 0.5625,1.125 0.5625,1.6875 0,2.8125 -0.5625,1.6875 -0.5625,1.125 -1.125,1.125 -1.6875,0.5625 -3.9375,0')
        this.setAxisColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /**
     * Draw MC symbol
     */
    mediumCoeli(x: number, y: number): Element {
        // center symbol
        const xShift = 19 // px
        const yShift = -4 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm ' + x + ', ' + y + ' -1.004085,-1.0040845 -1.004084,-0.5020423 -1.506127,0 -1.004085,0.5020423 -1.004084,1.0040845 -0.502043,1.50612689 0,1.00408458 0.502043,1.50612683 1.004084,1.0040846 1.004085,0.5020423 1.506127,0 1.004084,-0.5020423 1.004085,-1.0040846 m -17.57148,-9.0367612 0,10.5428881 m 0,-10.5428881 4.016338,10.5428881 m 4.016338,-10.5428881 -4.016338,10.5428881 m 4.016338,-10.5428881 0,10.5428881')
        this.setAxisColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    /**
     * Draw IC symbol
     */
    immumCoeli(x: number, y: number): Element {
        // center symbol
        const xShift = 19 // px
        const yShift = 2 // px
        x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
        y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', 'm ' + x + ', ' + y + ' -1.208852,-1.2088514 -1.208851,-0.6044258 -1.813278,0 -1.208852,0.6044258 -1.20885,1.2088514 -0.604426,1.81327715 0,1.20885135 0.604426,1.8132772 1.20885,1.2088513 1.208852,0.6044259 1.813278,0 1.208851,-0.6044259 1.208852,-1.2088513 m -11.4840902,-10.8796629 0,12.6929401')
        this.setAxisColor(node)
        wrapper.appendChild(node)

        return wrapper
    }

    number1(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '1'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_1))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number2(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '2'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_2))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number3(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '3'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_3))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number4(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '4'
            )
        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_4))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number5(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '5'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_5))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number6(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '6'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_6))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number7(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '7'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_7))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number8(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '8'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_8))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number9(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '9'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_9))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number10(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '10'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_9))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number11(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '11'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_9))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    number12(x: number, y: number): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'digits',
                this.settings.STYLE_DIGITS,
                '12'
            )

        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_9))
        wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setNumberColor(node)
        wrapper.appendChild(node)

        if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
        return wrapper
    }

    /**
     * Draw circular sector
     *
     * @param {int} x - circle x center position
     * @param {int} y - circle y center position
     * @param {int} radius - circle radius in px
     * @param {int} a1 - angleFrom in degree
     * @param {int} a2 - angleTo in degree
     * @param {int} thickness - from outside to center in px
     *
     * @return {SVGElement} segment
     *
     * @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
     */
    segment(x: number, y: number, radius: number, a1: number, a2: number, thickness: number, lFlag?: number, sFlag?: number): Element {
        // @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
        const LARGE_ARC_FLAG = lFlag || 0
        const SWEET_FLAG = sFlag || 0

        a1 = ((this.settings.SHIFT_IN_DEGREES - a1) % 360) * Math.PI / 180
        a2 = ((this.settings.SHIFT_IN_DEGREES - a2) % 360) * Math.PI / 180

        const segment = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        segment.setAttribute('d', 'M ' + (x + thickness * Math.cos(a1)) + ', ' + (y + thickness * Math.sin(a1)) + ' l ' + ((radius - thickness) * Math.cos(a1)) + ', ' + ((radius - thickness) * Math.sin(a1)) + ' A ' + radius + ', ' + radius + ',0 ,' + LARGE_ARC_FLAG + ', ' + SWEET_FLAG + ', ' + (x + radius * Math.cos(a2)) + ', ' + (y + radius * Math.sin(a2)) + ' l ' + ((radius - thickness) * -Math.cos(a2)) + ', ' + ((radius - thickness) * -Math.sin(a2)) + ' A ' + thickness + ', ' + thickness + ',0 ,' + LARGE_ARC_FLAG + ', ' + 1 + ', ' + (x + thickness * Math.cos(a1)) + ', ' + (y + thickness * Math.sin(a1)))
        segment.setAttribute('fill', 'none')
        return segment
    }

    /**
     * Draw line in circle
     *
     * @param {int} x1
     * @param {int} y2
     * @param {int} x2
     * @param {int} y2
     * @param {String} color - HTML rgb
     *
     * @return {SVGElement} line
     */
    line(x1: number, y1: number, x2: number, y2: number): Element {
        const line = this.document.createElementNS(this.context.root.namespaceURI, 'line')
        line.setAttribute('x1', x1.toString())
        line.setAttribute('y1', y1.toString())
        line.setAttribute('x2', x2.toString())
        line.setAttribute('y2', y2.toString())
        return line
    }

    /**
     * Draw a circle
     *
     * @param {int} cx
     * @param {int} cy
     * @param {int} radius
     *
     * @return {SVGElement} circle
     */
    circle(cx: number, cy: number, radius: number): Element {
        const circle = this.document.createElementNS(this.context.root.namespaceURI, 'circle')
        circle.setAttribute('cx', cx.toString())
        circle.setAttribute('cy', cy.toString())
        circle.setAttribute('r', radius.toString())
        circle.setAttribute('fill', 'none')
        return circle
    }

    /**
     * Draw a text
     *
     * @param {String} text
     * @param {int} x
     * @param {int} y
     * @param {String} size - etc. "13px"
     * @param {String} color - HTML rgb
     *
     * @return {SVGElement} text
     */
    text(txt: string, x: number, y: number, size: string, color: string): Element {
        const text = this.document.createElementNS(this.context.root.namespaceURI, 'text')
        text.setAttribute('x', x.toString())
        text.setAttribute('y', y.toString())
        text.setAttribute('font-size', size)
        this.settings.showGradient ? text.setAttribute('fill', 'none') : text.setAttribute('fill', color)
        text.setAttribute('font-family', 'serif')
        text.setAttribute('dominant-baseline', 'central')
        text.appendChild(this.document.createTextNode(txt))
        text.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')
        return text
    }
}

export default SVG
