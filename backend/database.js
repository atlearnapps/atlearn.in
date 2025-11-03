import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'POSTGRES_DB_NAME',
    'POSTGRES_DB_USERNAME',
    'POSTGRES_DB_PASSWORD',
    'POSTGRES_DB_HOST',
    'POSTGRES_DB_PORT'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const sequelize = new Sequelize(
    process.env.POSTGRES_DB_NAME,
    process.env.POSTGRES_DB_USERNAME,
    process.env.POSTGRES_DB_PASSWORD,
    {
        host: process.env.POSTGRES_DB_HOST,
        port: process.env.POSTGRES_DB_PORT,
        dialect: "postgres",
        logging: process.env.NODE_ENV === 'development',
        pool: {
            max: 10,               // Maximum number of connection in pool
            min: 0,               // Minimum number of connection in pool
            acquire: 30000,       // Maximum time (ms) that pool will try to get connection before throwing error
            idle: 10000          // Maximum time (ms) that a connection can be idle before being released
        },
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production',
            keepAlive: true,
        },
        define: {
            timestamps: true,    // Automatically add createdAt and updatedAt
            underscored: true,  // Use snake_case for fields
        }
    }

);

export default sequelize;