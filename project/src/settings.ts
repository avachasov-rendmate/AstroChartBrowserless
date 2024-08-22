import type SVG from './svg'

export interface AspectData {
    degree: number;
    orbit: number;
    color: string
}

export type Aspect = Record<string, AspectData>

export interface Dignity {
    name: string
    position: number
    orbit: number
}

export interface Gradient {
    start: string
    stop: string
    type: string
    rotation?: number
}

export interface Settings {
    showBackground: boolean
    showAxis: boolean
    showGradient: boolean
    GRADIENT: Gradient
    SYMBOL_SCALE: number
    COLOR_BACKGROUND: string
    COLOR_POINTS: string
    POINTS_TEXT_SIZE: number
    POINTS_STROKE: number
    SIGNS_STROKE: number
    MARGIN: number
    PADDING: number
    ID_CHART: string
    ID_RADIX: string
    ID_TRANSIT: string
    ID_ASPECTS: string
    ID_POINTS: string
    ID_SIGNS: string
    ID_CIRCLES: string
    ID_AXIS: string
    ID_CUSPS: string
    ID_RULER: string
    ID_BG: string
    COLOR_CIRCLES: string
    COLOR_LINES: string
    INDOOR_CIRCLE_RADIUS_RATIO: number
    INNER_CIRCLE_RADIUS_RATIO: number
    RULER_RADIUS: number
    SYMBOL_SUN: string
    SYMBOL_MOON: string
    SYMBOL_MERCURY: string
    SYMBOL_VENUS: string
    SYMBOL_MARS: string
    SYMBOL_JUPITER: string
    SYMBOL_SATURN: string
    SYMBOL_URANUS: string
    SYMBOL_NEPTUNE: string
    SYMBOL_PLUTO: string
    SYMBOL_CHIRON: string
    SYMBOL_LILITH: string
    SYMBOL_NNODE: string
    SYMBOL_SNODE: string
    SYMBOL_FORTUNE: string
    SYMBOL_AS: string
    SYMBOL_DS: string
    SYMBOL_MC: string
    SYMBOL_IC: string
    COLOR_AXIS_FONT: string
    SYMBOL_AXIS_STROKE: number
    SYMBOL_CUSP_1: string
    SYMBOL_CUSP_2: string
    SYMBOL_CUSP_3: string
    SYMBOL_CUSP_4: string
    SYMBOL_CUSP_5: string
    SYMBOL_CUSP_6: string
    SYMBOL_CUSP_7: string
    SYMBOL_CUSP_8: string
    SYMBOL_CUSP_9: string
    SYMBOL_CUSP_10: string
    SYMBOL_CUSP_11: string
    SYMBOL_CUSP_12: string
    CUSPS_STROKE: number
    COLOR_NUMBERS: string
    SYMBOL_ARIES: string
    SYMBOL_TAURUS: string
    SYMBOL_GEMINI: string
    SYMBOL_CANCER: string
    SYMBOL_LEO: string
    SYMBOL_VIRGO: string
    SYMBOL_LIBRA: string
    SYMBOL_SCORPIO: string
    SYMBOL_SAGITTARIUS: string
    SYMBOL_CAPRICORN: string
    SYMBOL_AQUARIUS: string
    SYMBOL_PISCES: string
    SYMBOL_SIRIUS: string
    SYMBOL_SIGNS: string[]
    COLOR_SIGN_LIGHT: string
    COLOR_SIGN_DARK: string
    COLOR_SIGN_BG_LIGHT: string
    COLOR_SIGN_BG_DARK: string
    CUSTOM_SYMBOL_FN: null | ((name: string, x: number, y: number, context: SVG) => Element)
    SHIFT_IN_DEGREES: number
    STROKE_ONLY: boolean
    ADD_CLICK_AREA: boolean
    COLLISION_RADIUS: number
    ASPECTS: Aspect
    OUTER_SYMBOLS: boolean
    DIGNITIES_RULERSHIP: string
    DIGNITIES_DETRIMENT: string
    DIGNITIES_EXALTATION: string
    DIGNITIES_EXACT_EXALTATION: string
    DIGNITIES_FALL: string
    DIGNITIES_EXACT_EXALTATION_DEFAULT: Dignity[]
    DEBUG: boolean
    NUMBER_STROKE: number
    CIRCLE_RULER_STROKE: number
    RULER_RAY_STROKE: number
    CIRCLE_STROKE_CENTRAL: number
    CIRCLE_STROKE_OUTER: number
    CIRCLE_STROKE_SIGNS_DISK_OUTER: number
    CIRCLE_STROKE_SIGNS_DISK_INNER: number
    showCentralOuterCircle: boolean
    CIRCLE_OUTER_SHIFT: number
    showOuterCircle: boolean
    showPointsPointer: boolean
    showRulerRays: boolean
    CUSPS_DASHARRAY: string
    ASPECTS_CIRCLE_RADIUS_RATIO: number
    CIRCLE_DASHARRAY_CENTRAL: string
    CIRCLE_DASHARRAY_OUTER: string
    CIRCLE_DASHARRAY_SIGNS_DISK_OUTER: string
    CIRCLE_DASHARRAY_SIGNS_DISK_INNER: string
    CIRCLE_DASHARRAY_RULER: string
    showPointDescription: boolean
    showAspectPoints: boolean
    SIGN_BG_STROKE: number
    CIRCLE_DASHARRAY_CENTRAL_OUTER: string
    STYLE_ZODIAC_SIGNS: string
    STYLE_DIGITS: string
    OFFSET_CENTER_OUTER_CIRCLE: number
    OFFSET_NUMBERS: number
    STROKE_ASPECTS: number
    BG_PADDING: number
    signsDiskStrokeOnly: boolean
    COLOR_ASPECTS: string
    ASPECT_POINT_SCALE: number
}

const settings: Settings = {
    COLOR_ASPECTS: '#333',
    ASPECT_POINT_SCALE: 0.5,
    signsDiskStrokeOnly: false,
    STROKE_ASPECTS: 1,
    STYLE_DIGITS: 'arabic',
    CIRCLE_DASHARRAY_CENTRAL_OUTER: '0',
    CIRCLE_DASHARRAY_RULER: '0',
    SIGN_BG_STROKE: 1,
    showAspectPoints: false,
    showPointDescription: false,
    CUSPS_DASHARRAY: '5,5',
    showRulerRays: true,
    showOuterCircle: true,
    showPointsPointer: false,
    showCentralOuterCircle: false,
    CIRCLE_OUTER_SHIFT: 10,
    CIRCLE_STROKE_SIGNS_DISK_INNER: 1,
    CIRCLE_STROKE_SIGNS_DISK_OUTER: 1,
    CIRCLE_STROKE_CENTRAL: 1,
    CIRCLE_STROKE_OUTER: 1,
    CIRCLE_DASHARRAY_CENTRAL: '0',
    CIRCLE_DASHARRAY_OUTER: '0',
    CIRCLE_DASHARRAY_SIGNS_DISK_OUTER: '0',
    CIRCLE_DASHARRAY_SIGNS_DISK_INNER: '0',
    CIRCLE_RULER_STROKE: 1,
    RULER_RAY_STROKE: 1,
    showAxis: true,
    NUMBER_STROKE: 1.5,
    // Enable / Disable gradient
    showGradient: false,
    GRADIENT: {
        start: '#e00909',
        stop: '#000000',
        type: 'linear',
        rotation: 0
    },

    // Scale of symbols
    SYMBOL_SCALE: 1,

    // BG color
    COLOR_BACKGROUND: '#939090',

    // Color of planet's symbols
    COLOR_POINTS: '#000',
    BG_PADDING: 0,

    // Size of description text next to the planet: angle, retrograde, dignities, ...
    POINTS_TEXT_SIZE: 8,

    // Points strength of lines
    POINTS_STROKE: 1.8,

    // Signs strength of lines
    SIGNS_STROKE: 1.5,

    // Chart margin
    MARGIN: 50, // px

    // Chart Padding
    PADDING: 18, // px

    // Module wrapper element ID
    ID_CHART: 'astrology',

    // Radix chart element ID
    ID_RADIX: 'radix',

    // Transit chart element ID
    ID_TRANSIT: 'transit',

    // Aspects wrapper element ID
    ID_ASPECTS: 'aspects',

    // Aspects wrapper element ID
    ID_POINTS: 'planets',

    // Signs wrapper element ID
    ID_SIGNS: 'signs',

    // Circles wrapper element ID
    ID_CIRCLES: 'circles',

    // Axis wrapper element ID
    ID_AXIS: 'axis',

    // Cusps wrapper element ID
    ID_CUSPS: 'cusps',

    // Cusps wrapper element ID
    ID_RULER: 'ruler',

    // Background wrapper element ID
    ID_BG: 'bg',
    showBackground: true,
    STYLE_ZODIAC_SIGNS:'text',
    // Color of circles in charts
    COLOR_CIRCLES: '#333',
    // Color of lines in charts
    COLOR_LINES: '#333',

    // radius / INDOOR_CIRCLE_RADIUS_RATIO
    INDOOR_CIRCLE_RADIUS_RATIO: 2,
    ASPECTS_CIRCLE_RADIUS_RATIO: 2,

    // radius - radius/INNER_CIRCLE_RADIUS_RATIO
    INNER_CIRCLE_RADIUS_RATIO: 8,

    // ( radius / INNER_CIRCLE_RADIUS_RATIO ) / RULER_RADIUS
    RULER_RADIUS: 4,

    // Points
    SYMBOL_SUN: 'Sun',
    SYMBOL_MOON: 'Moon',
    SYMBOL_MERCURY: 'Mercury',
    SYMBOL_VENUS: 'Venus',
    SYMBOL_MARS: 'Mars',
    SYMBOL_JUPITER: 'Jupiter',
    SYMBOL_SATURN: 'Saturn',
    SYMBOL_URANUS: 'Uranus',
    SYMBOL_NEPTUNE: 'Neptune',
    SYMBOL_PLUTO: 'Pluto',
    SYMBOL_CHIRON: 'Chiron',
    SYMBOL_LILITH: 'Lilith',
    SYMBOL_NNODE: 'NNode',
    SYMBOL_SNODE: 'SNode',
    SYMBOL_FORTUNE: 'Fortune',

    // Axis
    SYMBOL_AS: 'As',
    SYMBOL_DS: 'Ds',
    SYMBOL_MC: 'Mc',
    SYMBOL_IC: 'Ic',

    COLOR_AXIS_FONT: '#333',
    SYMBOL_AXIS_STROKE: 1.6,

    // Cusps
    SYMBOL_CUSP_1: '1',
    SYMBOL_CUSP_2: '2',
    SYMBOL_CUSP_3: '3',
    SYMBOL_CUSP_4: '4',
    SYMBOL_CUSP_5: '5',
    SYMBOL_CUSP_6: '6',
    SYMBOL_CUSP_7: '7',
    SYMBOL_CUSP_8: '8',
    SYMBOL_CUSP_9: '9',
    SYMBOL_CUSP_10: '10',
    SYMBOL_CUSP_11: '11',
    SYMBOL_CUSP_12: '12',

    // Cusps strength of lines
    CUSPS_STROKE: 1,
    COLOR_NUMBERS: '#000',
    COLOR_SIGN_DARK: '#f0f0f0',
    COLOR_SIGN_LIGHT: '#838080',
    COLOR_SIGN_BG_LIGHT: '#f0f0f0',
    COLOR_SIGN_BG_DARK: '#838080',

    // Signs
    SYMBOL_ARIES: 'Aries',
    SYMBOL_TAURUS: 'Taurus',
    SYMBOL_GEMINI: 'Gemini',
    SYMBOL_CANCER: 'Cancer',
    SYMBOL_LEO: 'Leo',
    SYMBOL_VIRGO: 'Virgo',
    SYMBOL_LIBRA: 'Libra',
    SYMBOL_SCORPIO: 'Scorpio',
    SYMBOL_SAGITTARIUS: 'Sagittarius',
    SYMBOL_CAPRICORN: 'Capricorn',
    SYMBOL_AQUARIUS: 'Aquarius',
    SYMBOL_PISCES: 'Pisces',
    SYMBOL_SIRIUS: 'Sirius',
    SYMBOL_SIGNS: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    CUSTOM_SYMBOL_FN: null,

    // 0 degree is on the West
    SHIFT_IN_DEGREES: 180,
    OFFSET_NUMBERS: 5,
    OFFSET_CENTER_OUTER_CIRCLE: 20,

    // No fill, only stroke
    STROKE_ONLY: false,

    ADD_CLICK_AREA: false,

    // Planets collision circle radius for SYMBOL_SCALE : 1
    // Scaling changes the collision radius
    COLLISION_RADIUS: 10, // px

    // Aspects
    ASPECTS: {
        conjunction: {degree: 0, orbit: 10, color: '#27AE60'},
        square: {degree: 90, orbit: 8, color: '#FF4500'},
        trine: {degree: 120, orbit: 8, color: '#27AE60'},
        opposition: {degree: 180, orbit: 10, color: '#27AE60'}
    },
    OUTER_SYMBOLS: false,
    // Dignities
    DIGNITIES_RULERSHIP: 'r',
    DIGNITIES_DETRIMENT: 'd',
    DIGNITIES_EXALTATION: 'e',
    DIGNITIES_EXACT_EXALTATION: 'E',
    DIGNITIES_FALL: 'f',

    // Source: Aleister Crowley
    DIGNITIES_EXACT_EXALTATION_DEFAULT: [
        {name: 'Sun', position: 19, orbit: 2}, // 19 Arise
        {name: 'Moon', position: 33, orbit: 2}, // 3 Taurus
        {name: 'Mercury', position: 155, orbit: 2}, // 15 Virgo
        {name: 'Venus', position: 357, orbit: 2}, // 27 Pisces
        {name: 'Mars', position: 298, orbit: 2}, // 28 Capricorn
        {name: 'Jupiter', position: 105, orbit: 2}, // 15 Cancer
        {name: 'Saturn', position: 201, orbit: 2}, // 21 Libra
        {name: 'NNode', position: 63, orbit: 2} // 3 Geminy
    ],
    DEBUG: false
}

const default_settings = settings
export default default_settings
