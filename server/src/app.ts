import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';
import { ensureXsrfCookie, requireCsrfForCookieAuth } from './middlewares/csrf';
const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: [env.FRONTEND_ORIGIN],
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// CSRF protection for cookie-authenticated requests
app.use(ensureXsrfCookie);
app.use(requireCsrfForCookieAuth);
app.use('/api', routes);

app.use(errorHandler);

export default app;
