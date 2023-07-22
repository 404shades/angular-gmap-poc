export interface LocationTrackingRequest {
    response_data?: ResponseData;
    status_code?:   number;
    messages?:      Messages;
    response_meta?: ResponseMeta;
}

export interface Messages {
    success_message?: string;
}

export interface ResponseData {
    data?:     Datum[];
    dto_type?: string;
}

export interface Datum {
    staff_location_tracking_id?: number;
    unique_id?:                  string;
    staff_id?:                   StaffID;
    latitude?:                   number;
    longitude?:                  number;
    accuracy?:                   number;
    altitude?:                   number;
    ellipsoidalAltitude?:        number;
    heading?:                    number;
    headingAccuracy?:            number;
    speed?:                      number;
    speedAccuracy?:              number;
    altitudeAccuracy?:           number;
    location?:                   Location;
    timestamp?:                  Date;
    location_event?:             LocationEvent | null;
    isMoving?:                   boolean;
    location_uuid?:              string;
    battery_percentage?:         number;
    is_charging?:                boolean;
    location_activity?:          LocationActivity;
    activity_confidence?:        number;
    odometer?:                   number;
    is_active?:                  boolean;
    created_on?:                 Date;
    created_by?:                 null;
    modified_on?:                Date;
    modified_by?:                null;
}

export enum Location {
    Def = "DEF",
}

export enum LocationActivity {
    InVehicle = "in_vehicle",
    Still = "still",
    Walking = "walking",
}

export enum LocationEvent {
    Motionchange = "motionchange",
    Providerchange = "providerchange",
}

export enum StaffID {
    Emp03 = "EMP03",
}

export interface ResponseMeta {
    inflight_time?: number;
}
