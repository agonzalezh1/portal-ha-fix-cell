import mongoose from 'mongoose';

/**
 * Remover las variables de conexion
 */
const dbVariables = {
    DB_URL_CONNECTION: 'mongodb+srv://ha_fix_cell:haFixCell01@cluster0.b5uwjuz.mongodb.net/ha_fix_cell',
    //DB_URL_CONNECTION: 'mongodb://localhost:27017/ha_fix_cell',
    DB_CONNECTION_USER: 'ha_fix_cell',
    DB_CONNECTION_PASS: 'haFixCell01',
};

export const connectDB = async () => mongoose.connect(dbVariables.DB_URL_CONNECTION);

export const disconnectDB = async () => mongoose.disconnect();

