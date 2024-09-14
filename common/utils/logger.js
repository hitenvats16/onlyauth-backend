class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    log(...args) {
        if (this.isDevelopment) {
            console.log(...args);
        }
    }

    info(...args) {
        if (this.isDevelopment) {
            console.info(...args);
        }
    }

    warn(...args) {
        if (this.isDevelopment) {
            console.warn(...args);
        }
    }

    error(...args) {
        if (this.isDevelopment) {
            console.error(...args);
        }
    }
}

const logger = new Logger();

export default logger;