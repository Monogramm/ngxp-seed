export class GisLocation {
    constructor(
        public lat: number,
        public lon: number,
        public boundingbox: Array<number> = [],
        public osm_type: string = null,
        public osm_id: string = null,
        public place_id: number = null,
        public licence: string = null,
        public display_name: string = null,
        public locClass: string = null,
        public type: string = null,
        public importance: string = null
    ) { }
}
