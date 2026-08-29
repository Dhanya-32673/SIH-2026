"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const health_reading_schema_1 = require("./schemas/health-reading.schema");
const environment_reading_schema_1 = require("./schemas/environment-reading.schema");
const risk_assessment_schema_1 = require("./schemas/risk-assessment.schema");
const alert_schema_1 = require("./schemas/alert.schema");
const emergency_event_schema_1 = require("./schemas/emergency-event.schema");
const demo_session_schema_1 = require("./schemas/demo-session.schema");
const featureSchemas = [
    { name: health_reading_schema_1.HealthReading.name, schema: health_reading_schema_1.HealthReadingSchema },
    { name: environment_reading_schema_1.EnvironmentReading.name, schema: environment_reading_schema_1.EnvironmentReadingSchema },
    { name: risk_assessment_schema_1.RiskAssessment.name, schema: risk_assessment_schema_1.RiskAssessmentSchema },
    { name: alert_schema_1.Alert.name, schema: alert_schema_1.AlertSchema },
    { name: emergency_event_schema_1.EmergencyEvent.name, schema: emergency_event_schema_1.EmergencyEventSchema },
    { name: demo_session_schema_1.DemoSession.name, schema: demo_session_schema_1.DemoSessionSchema },
];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const uri = configService.get('MONGODB_URI') ||
                        'mongodb://127.0.0.1:27017/sih_health_companion';
                    const logger = new common_1.Logger('DatabaseModule');
                    logger.log(`Connecting to MongoDB at: ${uri}`);
                    return {
                        uri,
                        serverSelectionTimeoutMS: 2500,
                        connectTimeoutMS: 2500,
                        retryAttempts: 2,
                        retryDelay: 1000,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature(featureSchemas),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map