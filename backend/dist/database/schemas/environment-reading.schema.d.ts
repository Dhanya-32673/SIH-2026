import { Document } from 'mongoose';
export type EnvironmentReadingDocument = EnvironmentReading & Document;
export declare class EnvironmentReading {
    userId: string;
    temperature: number;
    humidity: number;
    pressure: number;
    airQuality: {
        aqi: number;
        pm25: number;
        status: string;
    };
    timestamp: Date;
}
export declare const EnvironmentReadingSchema: import("mongoose").Schema<EnvironmentReading, import("mongoose").Model<EnvironmentReading, any, any, any, Document<unknown, any, EnvironmentReading, any, {}> & EnvironmentReading & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EnvironmentReading, Document<unknown, {}, import("mongoose").FlatRecord<EnvironmentReading>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<EnvironmentReading> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
