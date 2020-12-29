const opts = {
    errorEventName:'error',
    logDirectory:'logs',
    fileNamePattern:'app-<DATE>.log',
    dateFormat:'YYYY-MM-DD'
};
// export const log = require('simple-node-logger').createRollingFileLogger( opts );
export const log = require('simple-node-logger').createSimpleLogger('app.log');
