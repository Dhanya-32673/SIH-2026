import { Document } from 'mongoose';
export type HealthReadingDocument = HealthReading & Document;
export declare class HealthReading {
    userId: string;
    heartRate: number;
    spo2: number;
    bodyTemperature: number;
    activity: string;
    timestamp: Date;
}
export declare const HealthReadingSchema: import("mongoose").Schema<HealthReading, import("mongoose").Model<HealthReading, any, any, any, Document<unknown, any, HealthReading, any, {}> & HealthReading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, HealthReading, Document<unknown, {}, import("mongoose").FlatRecord<HealthReading>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<HealthReading> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
