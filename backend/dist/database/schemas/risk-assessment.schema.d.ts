import { Document } from 'mongoose';
export type RiskAssessmentDocument = RiskAssessment & Document;
export declare class RiskAssessment {
    userId: string;
    status: string;
    riskType: string;
    riskScore: number;
    confidence: number;
    reasons: string[];
    recommendedActions: string[];
    factors: Record<string, number>;
    timestamp: Date;
}
export declare const RiskAssessmentSchema: import("mongoose").Schema<RiskAssessment, import("mongoose").Model<RiskAssessment, any, any, any, Document<unknown, any, RiskAssessment, any, {}> & RiskAssessment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RiskAssessment, Document<unknown, {}, import("mongoose").FlatRecord<RiskAssessment>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<RiskAssessment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
