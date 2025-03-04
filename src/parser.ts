import * as wkt from 'wellknown';
import * as GeoJSON from 'geojson';

export function parseWKT(wktString: string): GeoJSON.GeoJSON {
    const geojson = wkt.parse(wktString);
    if (!geojson) {
        throw new Error('Invalid WKT string');
    }
    return geojson;
}