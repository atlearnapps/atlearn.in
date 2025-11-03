import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';

// Security Imports
import { 
    limiter, 
    authLimiter, 
    corsOptions, 
    securityHeaders 
} from './middleware/security.js';

// Error Handler
import { errorHandler } from './middleware/errorHandler.js';

// Database
import sequelize from './database.js';
import { Data } from './data.js';

// Routes
import userRouter from './routes/userRoutes.js';
import bigbluebuttonRouter from './routes/bigbluebuttonRoutes.js';
import siteSettingsRouter from './routes/siteSettingsRoutes.js';
import roomConfigRouter from './routes/roomConfigRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import rolePermissionRouter from './routes/rolePermissionRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import externalUerRouter from './controller/externalUserController.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import pricingRouter from './routes/pricingRoutes.js';
import checkoutRouter from './routes/checkoutRoutes.js';
import zoomRouters from './routes/zoomRoutes.js';
import analyticsDashboardRoutes from './routes/analyticsDashboardRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import oauthClientsRoutes from './routes/oauthClientsRoutes.js';
import aiAssistantRouter from './routes/aiAssistantRoutes.js';
import auth0Router from './routes/auth0Routes.js';

const app = express();
dotenv.config();

// Define Swagger configuration
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'atlearn API',
        version: '1.0.0',
        description: 'A atlearn API Documentation',
      },
      components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
      },
      security: [
          {
              BearerAuth: [],
          },
      ],
    },
    apis: ['./routes/*.js'],
  };

  var swaaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "atlearn",
    customfavIcon: "./assets/farlanesIcon.ico",
    explorer: true,
    displayOperationId: true, 
    showUndocumentedResponses: true, //it needs change false, now temportemporarilyarly enabled
  };
  
const specs = swaggerJsdoc(options);

// Apply security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use('/api', limiter);
app.use('/api/auth', authLimiter);

// Apply general middleware
app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

async function initializeDatabase() {
    try {
        console.log('Authenticating database connection...');
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database schema synchronized.');
            await Data();
            console.log('Initial data seeded.');
        }
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

async function startServer() {
    await initializeDatabase();

    const HTTP_PORT = process.env.HTTP_PORT || 3000;
    app.listen(HTTP_PORT, () => {
        console.log(`Server running on port ${HTTP_PORT} in ${process.env.NODE_ENV} mode`);
    });
}


// Schedule to run every minute
// cron.schedule("* * * * *", checkScheduleMeeting);

// Schedule the function to run every day at midnight
// cron.schedule("0 0 * * *", processExpiredUsers);


// Static file serving
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use('/static', express.static('upload', {
    maxAge: '1d',
    etag: true
}));
app.use('/api/images', express.static(path.join(__dirname, 'upload/Images'), {
    maxAge: '1d',
    etag: true
}));

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaaggerUiOptions));

// API Routes
const apiRoutes = [
    { path: '/user', router: userRouter },
    { path: '/room', router: roomRouter },
    { path: '/site_settings', router: siteSettingsRouter },
    { path: '/room_configuration', router: roomConfigRouter },
    { path: '/role_permission', router: rolePermissionRouter },
    { path: '/bbb', router: bigbluebuttonRouter },
    { path: '/session', router: sessionRoutes },
    { path: '/dashboard', router: dashboardRouter },
    { path: '/pricing', router: pricingRouter },
    { path: '/checkout', router: checkoutRouter },
    { path: '/notification', router: notificationRouter },
    { path: '/analytics_dashboard', router: analyticsDashboardRoutes },
    { path: '/zoom', router: zoomRouters },
    { path: '/oauth', router: oauthClientsRoutes },
    { path: '/ai_assistant', router: aiAssistantRouter },
    { path: '/auth0/users', router: auth0Router }
];

// Register all routes with /api prefix
apiRoutes.forEach(({ path, router }) => {
    app.use(`/api${path}`, router);
});

// Register external user routes
app.use('/api', externalUerRouter);

// Error Handling
app.use((req, res, next) => {
    next(new APIError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

// Start the server
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});



