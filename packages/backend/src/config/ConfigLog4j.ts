// import {
//     AbstractLogger,
//     LFService,
//     LogFormat,
//     LoggerFactoryOptions,
//     LoggerType,
//     LogGroupRule,
//     LogLevel,
//     LogMessage
// } from "typescript-logging";
// import {LogGroupRuntimeSettings} from "typescript-logging/dist/commonjs/log/standard/LogGroupRuntimeSettings";
// require('dotenv').config();
//
// class CustomLogger extends AbstractLogger {
//
//     constructor(name: string, settings: LogGroupRuntimeSettings) {
//         super(name, settings);
//     }
//
//     protected doLog(msg: LogMessage): void {
//         let message = msg.logData ? msg.logData.msg : msg.message;
//         let data = msg.logData ? JSON.stringify(msg.logData.data) : undefined;
//         let json = {
//             level: LogLevel[msg.level].toUpperCase(),
//             source: msg.loggerName,
//             time: msg.date.toISOString(),
//             message: message,
//             errorMessage: msg.error?.message || undefined,
//             errorStack: msg.errorAsStack || undefined,
//             data: data,
//         };
//         console.log(JSON.stringify(json));
//     }
//
// }
//
// const options = new LoggerFactoryOptions()
//     .addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Debug));
//
// const customLoggerOptions = new LoggerFactoryOptions()
//     .addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Debug, new LogFormat(), LoggerType.Custom,
//         (name: string, logGroupRuntimeSettings: LogGroupRuntimeSettings) => new CustomLogger(name, logGroupRuntimeSettings)
//     ));
//
//
// export const factory = process.env.FORMAT_KIBANA_LOGS === 'true' ? LFService.createNamedLoggerFactory("CustomLoggerOptions", customLoggerOptions) : LFService.createNamedLoggerFactory("LoggerFactory", options);
