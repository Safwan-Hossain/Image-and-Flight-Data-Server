import winston from 'winston';
const { format } = winston;

const TIMESTAMP_FORMAT = 'HH:mm:ss';

const uppercaseLevels = format(info => {
    info.level = info.level.toUpperCase();
    return info;
})();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        uppercaseLevels,
        winston.format.colorize(),
        winston.format.timestamp({
            format: TIMESTAMP_FORMAT
        }),
        winston.format.printf(formatLogMessage)
    ),
    transports: [new winston.transports.Console()]
});

function formatLogMessage(info) {
    // Check if the message is an object and stringify it, otherwise use the message as it is
    const formattedMessage = typeof info.message === 'object'
        ? JSON.stringify(info.message) 
        : info.message; 

    return `[${info.level}][${info.timestamp}]: ${formattedMessage}`;
}

export { logger } ;
