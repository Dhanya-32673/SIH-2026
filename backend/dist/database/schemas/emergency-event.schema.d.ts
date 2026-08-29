import { Document } from 'mongoose';
export type EmergencyEventDocument = EmergencyEvent & Document;
export declare class EmergencyEvent {
    userId: string;
    riskType: string;
    state: string;
    triggerFactors: string[];
    snapshotTelemetry: Record<string, any>;
    simulatedLocation: Record<string, any>;
    triggeredAt: Date;
    resolvedAt: Date;
    escalatedAt: Date;
}
export declare const EmergencyEventSchema: import("mongoose").Schema<EmergencyEvent, import("mongoose").Model<EmergencyEvent, any, any, any, Document<unknown, any, EmergencyEvent, any, {}> & EmergencyEvent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmergencyEvent, Document<unknown, {}, import("mongoose").FlatRecord<EmergencyEvent>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<EmergencyEvent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
