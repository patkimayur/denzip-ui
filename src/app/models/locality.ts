export class LocalityResource {
    name: string;
    distance: number;
    duration: string;
    latitude: number;
    longitude: number;
}

export class LocalityCategory {
    name: string;
    resources: LocalityResource[];
}

export class LocalityData {
    categories: LocalityCategory[];
}
