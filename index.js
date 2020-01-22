const debug = require('debug');
const _ = require('lodash');
const rp = require('request-promise');
const responseTime = require('response-time');

const debugLog = debug('logboard/index');

class LogBoard {
    init(app, {LOGBOARD_DSN, logger}) {
        this.LOGBOARD_DSN = LOGBOARD_DSN;
        this.logger = logger || console;
        if (!LOGBOARD_DSN) {
            this.logger.info('monolog disabled. PLEASE UPDATE LOGBOARD_DSN in .env', {LOGBOARD_DSN});
            return;
        }

        if (!LOGBOARD_DSN.startsWith('http')) {
            this.logger.info('monolog disabled. PLEASE  check LOGBOARD_DSN starts with http', {LOGBOARD_DSN});
            return;
        }
        const parts = LOGBOARD_DSN.trim().split('/');
        this.project = parts.pop().trim();

        if (!this.project) {
            if (!LOGBOARD_DSN.includes('http')) {
                this.logger.info('monolog disabled. PLEASE CHECK LOGBOARD_DSN is correct in .env', {LOGBOARD_DSN});
                return;
            }
        }

        this.URL = parts.join('/');
        debugLog('responseTimeLogger', LOGBOARD_DSN);


        app.use((req, res, next) => {
            res.on('finish', () => this.responseTimeLogger(req, res, next));
            next();
        });
        app.use(responseTime());
    }

    async sessionLogger(session) {
        debugLog('fly', this, this.URL);

        if (!this.URL) {
            this.logger.info('monolog disabled. PLEASE UPDATE URLS_MONOLOG in .env');
            return;
        }

        await rp({
            method: 'POST',
            url: this.URL,
            body: {
                project: this.project,
                type: 'session',
                data: session,
            },
            json: true,
        })
            .catch((err) => {
                debugLog(err);
                this.logger.error('activity', err);
            });
    }

    async responseTimeLogger(req, res) {
        debugLog('fly', this, this.LOGBOARD_DSN);

        if (!this.LOGBOARD_DSN) {
            this.logger.info('monolog disabled. PLEASE UPDATE URLS_MONOLOG in .env');
            return;
        }

        const {
            query, body, method, originalUrl,
        } = req;

        const log = {
            body_bytes_sent: res.get('Content-Length'),
            status: res.statusCode,
            request: originalUrl,
            method,
        };

        if (res.get('X-Response-Time')) {
            log.response_time = res.get('X-Response-Time').replace('ms', '');
        }

        if (req.get('X-Request-Id')) {
            log.request_id = req.get('X-Request-Id');
        }

        if (req.oauth && req.oauth.bearerToken) {
            log.session_id = req.oauth.bearerToken.user.session_id;
            log.user_id = req.oauth.bearerToken.user.id;
        }

        if (!_.isEmpty(req.body)) {
            log.body = _.cloneDeep(body);
        }

        await rp({
            method: 'POST',
            url: this.URL,
            body: {
                project: this.project,
                type: 'api',
                data: log,
            },
            json: true,
        })
            .catch((err) => {
                debugLog(err);
                this.logger.error('activity', err);
            });
    }
}

module.exports = new LogBoard();
