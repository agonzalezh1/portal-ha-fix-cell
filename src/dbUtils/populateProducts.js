const fs = require('fs');
const csv = require('csv-parse');
const mongoose = require('mongoose');
const Products = require('./models/products');

const dbVariables = {
    DB_URL_CONNECTION: 'mongodb+srv://ha_fix_cell:haFixCell01@cluster0.b5uwjuz.mongodb.net/ha_fix_cell',
    //DB_URL_CONNECTION: 'mongodb://localhost:27017/ha_fix_cell',
    DB_CONNECTION_USER: 'ha_fix_cell',
    DB_CONNECTION_PASS: 'haFixCell01',
};

const PRODUCT_TYPES = Object.freeze({
    1: 'Accesorios computación',
    2: 'Accesorios telefonía',
    3: 'Fundas',
    4: 'Micas',
    5: 'Reparaciones',
    6: 'Servicios',
    7: 'Otro',
});

const BRAND_TYPES = Object.freeze({
    1: '1Hora',
    2: 'Acteck',
    3: 'Stylos',
    4: 'Kingston',
    5: 'Adata',
    6: 'Otro',
});

const connectDB = async () => mongoose.connect(dbVariables.DB_URL_CONNECTION);

const disconnectDB = async () => mongoose.disconnect();

const productsList = [];

const createProduct = async() => {
    for (const productTemp of productsList) {

        /**
         * Modificar el arreglo de acuerdo a las sucursales que haya en la base
         */
        const storesArray = [
            { id: '64d44b42249ba6229207e2df', count: Number(productTemp[7]) }, // Puertecito
            { id: '64d44b51249ba6229207e2e4', count: Number(productTemp[8]) }, // Consti
            { id: '64d44b58249ba6229207e2e8', count: Number(productTemp[9]) }, // Macario
            { id: '64d44b7a249ba6229207e2f8', count: Number(productTemp[10]) }, // Bodega
            { id: '64d44b6a249ba6229207e2f0', count: Number(productTemp[11]) }, // Monte Verde
            { id: '64d44b63249ba6229207e2ec', count: 0 }, // Jesus Maria
            { id: '64d44b73249ba6229207e2f4', count: 0 }, // Chairez
        ];

        const newProduct = {
            idProduct: Number(productTemp[14]),
            productName: productTemp[0],
            productType: {
                name: PRODUCT_TYPES[Number(productTemp[1])],
                id: Number(productTemp[1]),
            },
            brand: {
                name: BRAND_TYPES[Number(productTemp[2])],
                id: Number(productTemp[2]),
            },
            publicPrice: Number(productTemp[3]),
            wholesalePrice: Number(productTemp[4]),
            midWholesalePrice: Number(productTemp[5]),
            cost: Number(productTemp[6]),
            stores: storesArray,
        };
        try {
            await connectDB();
            await Products.create(newProduct);
            await disconnectDB();
        } catch (e) {
            await disconnectDB();
            console.log('No se pudo guardar el registro: ', newProduct.productName);
            console.log(e);
            break;
        }
    }
};


const populateProductsCollection = async () => {
    fs.createReadStream('inventario.csv')
        .pipe(csv.parse({ delimiter: ',', headers: false }))
        .on('data', async data => {
            productsList.push(data);
        })
        .on('error', async err => {
            console.log(err);
        })
        .on('end', async () => {
            console.log('Se acabo la lectura');
            createProduct();
        });
};

populateProductsCollection();
