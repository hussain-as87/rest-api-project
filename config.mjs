import dotenv from "dotenv";
dotenv.config();

export const _app = {
  app_name: process.env.APP_NAME,
  connection_type: process.env.CONNECTION_TYPE,
  connection_user: process.env.CONNECTION_USER,
  connection_password: process.env.CONNECTION_PASSWORD,
  connection_host: process.env.CONNECTION_HOST,
  db_name: process.env.DB_NAME,
  secret_key: process.env.SECRET_KEY,
  port: process.env.PORT,
};
