import { Sequelize } from 'sequelize';

const sequelize = new Sequelize (process.env.POSTGRES_DB_NAME, process.env.POSTGRES_DB_USERNAME, process.env.POSTGRES_DB_PASSWORD,
    {
        host: process.env.POSTGRES_DB_HOST,
        port: process.env.POSTGRES_DB_PORT, 
        dialect: "postgres",
        logging: true,
        createDatabaseIfNotExist: true, 
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
      })

export default sequelize;