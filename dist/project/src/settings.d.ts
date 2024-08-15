import type SVG from './svg';
export interface AspectData {
    degree: number;
    orbit: number;
    color: string;
}
export type Aspect = Record<string, AspectData>;
export interface Dignity {
    name: string;
    position: number;
    orbit: number;
}
export interface Gradient {
    start: string;
    stop: string;
    type: string;
    rotation?: number;
}
export interface Settings {
    showAxis: boolean;
    showGradient: boolean;
    GRADIENT: Gradient;
    SYMBOL_SCALE: number;
    COLOR_BACKGROUND: string;
    COLOR_POINTS: string;
    POINTS_TEXT_SIZE: number;
    POINTS_STROKE: number;
    SIGNS_STROKE: number;
    MARGIN: number;
    PADDING: number;
    ID_CHART: string;
    ID_RADIX: string;
    ID_TRANSIT: string;
    ID_ASPECTS: string;
    ID_POINTS: string;
    ID_SIGNS: string;
    ID_CIRCLES: string;
    ID_AXIS: string;
    ID_CUSPS: string;
    ID_RULER: string;
    ID_BG: string;
    COLOR_CIRCLES: string;
    COLOR_LINES: string;
    INDOOR_CIRCLE_RADIUS_RATIO: number;
    INNER_CIRCLE_RADIUS_RATIO: number;
    RULER_RADIUS: number;
    SYMBOL_SUN: string;
    SYMBOL_MOON: string;
    SYMBOL_MERCURY: string;
    SYMBOL_VENUS: string;
    SYMBOL_MARS: string;
    SYMBOL_JUPITER: string;
    SYMBOL_SATURN: string;
    SYMBOL_URANUS: string;
    SYMBOL_NEPTUNE: string;
    SYMBOL_PLUTO: string;
    SYMBOL_CHIRON: string;
    SYMBOL_LILITH: string;
    SYMBOL_NNODE: string;
    SYMBOL_SNODE: string;
    SYMBOL_FORTUNE: string;
    SYMBOL_AS: string;
    SYMBOL_DS: string;
    SYMBOL_MC: string;
    SYMBOL_IC: string;
    COLOR_AXIS_FONT: string;
    SYMBOL_AXIS_STROKE: number;
    SYMBOL_CUSP_1: string;
    SYMBOL_CUSP_2: string;
    SYMBOL_CUSP_3: string;
    SYMBOL_CUSP_4: string;
    SYMBOL_CUSP_5: string;
    SYMBOL_CUSP_6: string;
    SYMBOL_CUSP_7: string;
    SYMBOL_CUSP_8: string;
    SYMBOL_CUSP_9: string;
    SYMBOL_CUSP_10: string;
    SYMBOL_CUSP_11: string;
    SYMBOL_CUSP_12: string;
    CUSPS_STROKE: number;
    COLOR_NUMBERS: string;
    SYMBOL_ARIES: string;
    SYMBOL_TAURUS: string;
    SYMBOL_GEMINI: string;
    SYMBOL_CANCER: string;
    SYMBOL_LEO: string;
    SYMBOL_VIRGO: string;
    SYMBOL_LIBRA: string;
    SYMBOL_SCORPIO: string;
    SYMBOL_SAGITTARIUS: string;
    SYMBOL_CAPRICORN: string;
    SYMBOL_AQUARIUS: string;
    SYMBOL_PISCES: string;
    SYMBOL_SIRIUS: string;
    SYMBOL_SIGNS: string[];
    COLOR_SIGN_LIGHT: string;
    COLOR_SIGN_DARK: string;
    COLOR_SIGN_BG_LIGHT: string;
    COLOR_SIGN_BG_DARK: string;
    CUSTOM_SYMBOL_FN: null | ((name: string, x: number, y: number, context: SVG) => Element);
    SHIFT_IN_DEGREES: number;
    STROKE_ONLY: boolean;
    ADD_CLICK_AREA: boolean;
    COLLISION_RADIUS: number;
    ASPECTS: Aspect;
    OUTER_SYMBOLS: boolean;
    DIGNITIES_RULERSHIP: string;
    DIGNITIES_DETRIMENT: string;
    DIGNITIES_EXALTATION: string;
    DIGNITIES_EXACT_EXALTATION: string;
    DIGNITIES_FALL: string;
    DIGNITIES_EXACT_EXALTATION_DEFAULT: Dignity[];
    DEBUG: boolean;
    NUMBER_STROKE: number;
    CIRCLE_RULER_STROKE: number;
    RULER_RAY_STROKE: number;
    CIRCLE_STROKE_CENTRAL: number;
    CIRCLE_STROKE_OUTER: number;
    CIRCLE_STROKE_SIGNS_DISK_OUTER: number;
    CIRCLE_STROKE_SIGNS_DISK_INNER: number;
    showCentralOuterCircle: boolean;
    CIRCLE_OUTER_SHIFT: number;
    showOuterCircle: boolean;
    showPointsPointer: boolean;
    showRulerRays: boolean;
    CUSPS_DASHARRAY: string;
    ASPECTS_CIRCLE_RADIUS_RATIO: number;
    CIRCLE_DASHARRAY_CENTRAL: string;
    CIRCLE_DASHARRAY_OUTER: string;
    CIRCLE_DASHARRAY_SIGNS_DISK_OUTER: string;
    CIRCLE_DASHARRAY_SIGNS_DISK_INNER: string;
    CIRCLE_DASHARRAY_RULER: string;
    showPointDescription: boolean;
    showAspectPoints: boolean;
    SIGN_BG_STROKE: number;
    CIRCLE_DASHARRAY_CENTRAL_OUTER: string;
    ZODIAC_SIGNS_STYLE: string;
}
declare const default_settings: Settings;
export default default_settings;
