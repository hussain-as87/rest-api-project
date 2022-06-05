import { Sequelize, DataTypes, Op } from 'sequelize';
import { _app } from '../../config.mjs';


export const sequelize = new Sequelize(
    _app.db_name,
    _app.connection_user,
    _app.connection_password,
    {
        host: `${_app.connection_host}`,
        dialect: `${_app.connection_type}`
    });


 /* const books = await sequelize.query('SELECT * FROM users');
 console.log(books); */