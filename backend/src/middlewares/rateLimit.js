import {rateLimit} from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5, // each IP can make up to 5 requests per `windowsMs` (1 minutes)
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});

export default limiter;
  