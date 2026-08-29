import { Document } from 'mongoose';
export type DemoSessionDocument = DemoSession & Document;
export declare class DemoSession {
    userId: string;
    currentScenario: string;
    disasterMode: string;
    lastSwitchedAt: Date;
}
export declare const DemoSessionSchema: import("mongoose").Schema<DemoSession, import("mongoose").Model<DemoSession, any, any, any, Document<unknown, any, DemoSession, any, {}> & DemoSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DemoSession, Document<unknown, {}, import("mongoose").FlatRecord<DemoSession>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DemoSession> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
