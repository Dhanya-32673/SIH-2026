import { Document } from 'mongoose';
export type AlertDocument = Alert & Document;
export declare class Alert {
    userId: string;
    severity: string;
    type: string;
    message: string;
    reasons: string[];
    recommendedActions: string[];
    acknowledged: boolean;
    acknowledgedAt: Date;
    timestamp: Date;
}
export declare const AlertSchema: import("mongoose").Schema<Alert, import("mongoose").Model<Alert, any, any, any, Document<unknown, any, Alert, any, {}> & Alert & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Alert, Document<unknown, {}, import("mongoose").FlatRecord<Alert>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Alert> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
