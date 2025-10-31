import express from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRouter from './routes/userRoutes.js';
import bigbluebuttonRouter from './routes/bigbluebuttonRoutes.js';
import siteSettingsRouter from './routes/siteSettingsRoutes.js';
import roomConfigRouter from './routes/roomConfigRoutes.js';
import sequelize from './database.js';
import { Data } from './data.js';
import roomRouter from "./routes/roomRoutes.js";
import rolePermissionRouter from './routes/rolePermissionRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import externalUerRouter from './controller/externalUserController.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import pricingRouter from './routes/pricingRoutes.js';
import checkoutRouter from './routes/checkoutRoutes.js';
import zoomRouters from './routes/zoomRoutes.js';
import path from 'path';
import analyticsDashboardRoutes from './routes/analyticsDashboardRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import oauthClientsRoutes from './routes/oauthClientsRoutes.js';
// import { checkScheduleMeeting } from './services/Notifications/notifications.js';
// import { processExpiredUsers } from './services/Subscription/Subscription.js';
// import cron from "node-cron";
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
async function initializeDatabase() {
  try {
    console.log('authenticate')
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Create the database if it doesn't exist
    // await sequelize.queryInterface.createDatabase('farlanes', { ifNotExists: true });

    // Synchronize the models with the database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
    Data()
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
// sequelize.sync().then(() => {
//     console.log("db is ready")
//     Data()
// });
initializeDatabase()
const HTTP_PORT = process.env.HTTP_PORT;
app.listen(HTTP_PORT, ()=> {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
})
// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
app.use(cors({
    origin: '*'
}));


// Schedule to run every minute
// cron.schedule("* * * * *", checkScheduleMeeting);

// Schedule the function to run every day at midnight
// cron.schedule("0 0 * * *", processExpiredUsers);


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use(express.static('upload'));
app.use('/api/images', express.static(path.join(__dirname, 'upload/Images')));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs,swaaggerUiOptions));
app.use('/api/user',userRouter);
app.use("/api/room", roomRouter);
app.use('/api/site_settings',siteSettingsRouter);
app.use('/api/room_configuration',roomConfigRouter);
app.use('/api/role_permission',rolePermissionRouter);
app.use('/api/bbb',bigbluebuttonRouter);
app.use('/api/session',sessionRoutes);
app.use('/api',externalUerRouter)
app.use('/api/dashboard',dashboardRouter);
app.use('/api/pricing',pricingRouter);
app.use('/api/checkout',checkoutRouter);
app.use('/api/notification',notificationRouter);
app.use('/api/analytics_dashboard',analyticsDashboardRoutes);
app.use('/api/zoom',zoomRouters);
app.use('/api/oauth', oauthClientsRoutes);
app.use('/api/ai_assistant', aiAssistantRouter);
app.use('/api/auth0/users',auth0Router);



