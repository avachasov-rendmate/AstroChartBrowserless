import type {Settings} from './settings'
import Symbols from './symbols'

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
        this.symbols = new Symbols(this.settings, width, height)

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
                gradientDef = this.document.createElementNS(svg.namespaceURI, `${this.settings.GRADIENT.type}Gradient`),
                start = this.document.createElementNS(svg.namespaceURI, 'stop'),
                stop = this.document.createElementNS(svg.namespaceURI, 'stop')

            gradientDef.setAttribute('id', gradientDefId)
            gradientDef.setAttribute('gradientUnits', 'userSpaceOnUse')

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
            defs.appendChild(gradientDef)
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
                return this.sun(x, y, color as string)
            case this.settings.SYMBOL_MOON:
                return this.moon(x, y, color as string)
            case this.settings.SYMBOL_MERCURY:
                return this.mercury(x, y, color as string)
            case this.settings.SYMBOL_SIRIUS:
                return this.sirius(x, y, color as string)
            case this.settings.SYMBOL_VENUS:
                return this.venus(x, y, color as string)
            case this.settings.SYMBOL_MARS:
                return this.mars(x, y, color as string)
            case this.settings.SYMBOL_JUPITER:
                return this.jupiter(x, y, color as string)
            case this.settings.SYMBOL_SATURN:
                return this.saturn(x, y, color as string)
            case this.settings.SYMBOL_URANUS:
                return this.uranus(x, y, color as string)
            case this.settings.SYMBOL_NEPTUNE:
                return this.neptune(x, y, color as string)
            case this.settings.SYMBOL_PLUTO:
                return this.pluto(x, y, color as string)
            case this.settings.SYMBOL_CHIRON:
                return this.chiron(x, y, color as string)
            case this.settings.SYMBOL_LILITH:
                return this.lilith(x, y, color as string)
            case this.settings.SYMBOL_NNODE:
                return this.nnode(x, y, color as string)
            case this.settings.SYMBOL_SNODE:
                return this.snode(x, y, color as string)
            case this.settings.SYMBOL_FORTUNE:
                return this.fortune(x, y, color as string)
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
     * Get ID for house wrapper.
     *
     * @param {String} house
     *
     * @return {String id}
     */
    getHouseIdWrapper(house: string): string {
        return this._paperElementId + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CUSPS + '-' + house
    }

    setPointColor(node: Element, color: string): void {
        if (!this.settings.showGradient) {
            node.setAttribute('stroke', color)
            node.setAttribute('fill', color)
        }
        node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
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

    setTransforms(node: Element, x: number, y: number, scale: number, autoRotateDisabled? : boolean): any {
        let
            rotation = { transform: '' , source: 'path' }
        if (!autoRotateDisabled) {
            rotation = this.symbols.getRotation(x, y)
        }
        // node.setAttribute('transform', `scale(${scale}) ${rotation.transform}`)
        // node.setAttribute('transform-origin', `${x}px ${y}px`)
        node.setAttribute('style', `transform: scale(${scale}) ${rotation.transform}; transform-origin: ${x}px ${y}px`)
        return rotation
    }
    addPlanetSymbol(x: number, y: number, symbol: any, color: string): Element {
        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        node.setAttribute('d', symbol.path)
        this.setTransforms(
            wrapper,
            x,
            y,
            this.settings.SCALE_PLANETS,
            true //disable auto rotation
        )
        this.setPointColor(node, color)
        wrapper.appendChild(node)
        return wrapper
    }

    addZodiacSymbol(x: number, y: number, symbol: any, color: string): Element {
        const wrapper = this.document.createElementNS(this.context.root.namespaceURI, 'g')
        const node = this.document.createElementNS(this.context.root.namespaceURI, 'path')
        const
            transforms = this.setTransforms(wrapper, x, y, this.settings.SCALE_ZODIAC_SIGNS)
        node.setAttribute('d', symbol[transforms.source])
        this.setSignColor(node, color)
        wrapper.appendChild(node)
        return wrapper
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
    sun(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'sun'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
    }

    sirius(x: number, y: number, color: string): Element {
        // center symbol
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'sirius'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    moon(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'moon'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    mercury(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'mercury'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    venus(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'venus'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    mars(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'mars'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    jupiter(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'jupiter'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    saturn(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'saturn'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    uranus(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'uranus'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    neptune(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'neptune'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    pluto(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'pluto'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    chiron(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'chiron'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    lilith(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'lilith'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    nnode(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'nnode'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    snode(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'snode'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
    fortune(x: number, y: number, color: string): Element {
        const
            symbol = this.symbols.getSymbol(
                x,
                y,
                'planets',
                'default',
                'fortune'
            )
        return this.addPlanetSymbol(x, y, symbol, color)
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
