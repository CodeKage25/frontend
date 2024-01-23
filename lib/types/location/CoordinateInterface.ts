export interface CoordinateType {
    long: number | undefined;
    lat: number | undefined;
}

export interface LocationType {
    coord: CoordinateType;
    status: "SUCCESS" | "ERROR";
    loaded: boolean;
    message: string;
}