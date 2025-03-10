declare module 'wellknown' {
    function parse(wkt: string): any;
    function stringify(geojson: any): string;
    export { parse, stringify };
}
