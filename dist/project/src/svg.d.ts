import type { Settings } from './settings';
import Symbols from './symbols';
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
declare class SVG {
    settings: Settings;
    _paperElementId: string;
    DOMElement: SVGSVGElement;
    root: Element;
    document: any;
    symbols: Symbols;
    width: number;
    height: number;
    context: this;
    constructor(document: any, elementId: string, width: number, height: number, settings: Settings);
    _getSymbol(name: string, x: number, y: number, color?: string): Element;
    /**
     * Get a required symbol.
     *
     * @param {String} name
     * @param {int} x
     * @param {int} y
     *
     * @return {SVGElement g}
     */
    getSymbol(name: string, x: number, y: number, color?: string): Element;
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
    createRectForClick(x: number, y: number): Element;
    /**
     * Get ID for sign wrapper.
     *
     * @param {String} sign
     *
     * @return {String id}
     */
    getSignWrapperId(sign: string): string;
    /**
     * Get ID for house wrapper.
     *
     * @param {String} house
     *
     * @return {String id}
     */
    getHouseIdWrapper(house: string): string;
    setPointColor(node: Element): void;
    setSignColor(node: Element, color: string): void;
    setAxisColor(node: Element): void;
    setNumberColor(node: Element): void;
    sun(x: number, y: number): Element;
    sirius(x: number, y: number): Element;
    moon(x: number, y: number): Element;
    mercury(x: number, y: number): Element;
    venus(x: number, y: number): Element;
    mars(x: number, y: number): Element;
    jupiter(x: number, y: number): Element;
    saturn(x: number, y: number): Element;
    uranus(x: number, y: number): Element;
    neptune(x: number, y: number): Element;
    pluto(x: number, y: number): Element;
    chiron(x: number, y: number): Element;
    lilith(x: number, y: number): Element;
    nnode(x: number, y: number): Element;
    snode(x: number, y: number): Element;
    fortune(x: number, y: number): Element;
    addZodiacSymbol(x: number, y: number, symbol: any, color: string): Element;
    aries(x: number, y: number, color: string): Element;
    taurus(x: number, y: number, color: string): Element;
    gemini(x: number, y: number, color: string): Element;
    cancer(x: number, y: number, color: string): Element;
    leo(x: number, y: number, color: string): Element;
    virgo(x: number, y: number, color: string): Element;
    libra(x: number, y: number, color: string): Element;
    scorpio(x: number, y: number, color: string): Element;
    sagittarius(x: number, y: number, color: string): Element;
    capricorn(x: number, y: number, color: string): Element;
    aquarius(x: number, y: number, color: string): Element;
    pisces(x: number, y: number, color: string): Element;
    /**
     * Draw As symbol
     */
    ascendant(x: number, y: number): Element;
    /**
     * Draw Ds symbol
     */
    descendant(x: number, y: number): Element;
    /**
     * Draw MC symbol
     */
    mediumCoeli(x: number, y: number): Element;
    /**
     * Draw IC symbol
     */
    immumCoeli(x: number, y: number): Element;
    number1(x: number, y: number): Element;
    number2(x: number, y: number): Element;
    number3(x: number, y: number): Element;
    number4(x: number, y: number): Element;
    number5(x: number, y: number): Element;
    number6(x: number, y: number): Element;
    number7(x: number, y: number): Element;
    number8(x: number, y: number): Element;
    number9(x: number, y: number): Element;
    number10(x: number, y: number): Element;
    number11(x: number, y: number): Element;
    number12(x: number, y: number): Element;
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
    segment(x: number, y: number, radius: number, a1: number, a2: number, thickness: number, lFlag?: number, sFlag?: number): Element;
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
    line(x1: number, y1: number, x2: number, y2: number): Element;
    /**
     * Draw a circle
     *
     * @param {int} cx
     * @param {int} cy
     * @param {int} radius
     *
     * @return {SVGElement} circle
     */
    circle(cx: number, cy: number, radius: number): Element;
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
    text(txt: string, x: number, y: number, size: string, color: string): Element;
}
export default SVG;
