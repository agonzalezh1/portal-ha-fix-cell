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

/**
 * Query para agregar un nuevo periodo en la base
 */
/*
db.stores.updateOne(
    { "_id": ObjectId("64d44b7a249ba6229207e2f8") },
    { $push: { "sales": { "period": "11/2023", "products": { "cashPayment": 0, "cardPayment": 0 }, "fixes": { "cashPayment": 0, "cardPayment": 0 }, "airtime": 0, "spend": 0 } } }
 )
 
 
 64d44b7a249ba6229207e2f8 -> Bodega
 64d44b73249ba6229207e2f4 -> Chairez
 64d44b6a249ba6229207e2f0 -> Monte Verde
 64d44b63249ba6229207e2ec -> Jesus Maria
 64d44b58249ba6229207e2e8 -> Macario
 64d44b51249ba6229207e2e4 -> Consti
 64d44b42249ba6229207e2df -> Puertecito
*/
