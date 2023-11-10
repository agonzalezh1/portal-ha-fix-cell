const fs = require('fs');
const csv = require('csv-parse');
const writeStream = fs.createWriteStream('inventarioIDs.csv');

const productsList = [];

const generalCounter = {
    1: {
        brand: '1Hora',
        1: { productType: 'Accesorios computación', count: 0 },
        2: { productType: 'Accesorios telefonía', count: 0 },
        3: { productType: 'Fundas', count: 0 },
        4: { productType: 'Micas', count: 0 },
        5: { productType: 'Reparaciones', count: 0 },
        6: { productType: 'Servicios', count: 0 },
        7: { productType: 'Otro', count: 0 },
    },
    2: {
        brand: 'Acteck',
        1: { productType: 'Accesorios computación', count: 0 },
        2: { productType: 'Accesorios telefonía', count: 0 },
        3: { productType: 'Fundas', count: 0 },
        4: { productType: 'Micas', count: 0 },
        5: { productType: 'Reparaciones', count: 0 },
        6: { productType: 'Servicios', count: 0 },
        7: { productType: 'Otro', count: 0 },
    },
    3: {
        brand: 'Stylos',
        1: { productType: 'Accesorios computación', count: 0 },
        2: { productType: 'Accesorios telefonía', count: 0 },
        3: { productType: 'Fundas', count: 0 },
        4: { productType: 'Micas', count: 0 },
        5: { productType: 'Reparaciones', count: 0 },
        6: { productType: 'Servicios', count: 0 },
        7: { productType: 'Otro', count: 0 },
    },
    4: {
        brand: 'Kingson',
        1: { productType: 'Accesorios computación', count: 0 },
        2: { productType: 'Accesorios telefonía', count: 0 },
        3: { productType: 'Fundas', count: 0 },
        4: { productType: 'Micas', count: 0 },
        5: { productType: 'Reparaciones', count: 0 },
        6: { productType: 'Servicios', count: 0 },
        7: { productType: 'Otro', count: 0 },
    },
    5: {
        brand: 'Adata',
        1: { productType: 'Accesorios computación', count: 0 },
        2: { productType: 'Accesorios telefonía', count: 0 },
        3: { productType: 'Fundas', count: 0 },
        4: { productType: 'Micas', count: 0 },
        5: { productType: 'Reparaciones', count: 0 },
        6: { productType: 'Servicios', count: 0 },
        7: { productType: 'Otro', count: 0 },
    },
    6: {
        brand: 'Otro',
        1: { productType: 'Accesorios computación', count: 0 },
        2: { productType: 'Accesorios telefonía', count: 0 },
        3: { productType: 'Fundas', count: 0 },
        4: { productType: 'Micas', count: 0 },
        5: { productType: 'Reparaciones', count: 0 },
        6: { productType: 'Servicios', count: 0 },
        7: { productType: 'Otro', count: 0 },
    },
};

const writeFileCSV = () => {
    productsList.forEach(product => {
        const newLine = [];
        newLine.push(product.nombre);
        newLine.push(product.tipo);
        newLine.push(product.marca);
        newLine.push(product.precioPublico);
        newLine.push(product.precioMayoreo);
        newLine.push(product.precioMedioMayoreo);
        newLine.push(product.costo);
        newLine.push(product.tiendas[0]);
        newLine.push(product.tiendas[1]);
        newLine.push(product.tiendas[2]);
        newLine.push(product.tiendas[3]);
        newLine.push(product.tiendas[4]);
        newLine.push(product.tiendas[5]);
        newLine.push(product.tiendas[6]);
        newLine.push(product.id);

        writeStream.write(`${newLine.join(',')}\n`);

        writeStream.on('finish', () => {
        }).on('error', err => {
            console.log(err);
        });
    });
    writeStream.end();
};

const createIDs = async () => {
    fs.createReadStream('inventario.csv')
        .pipe(csv.parse({ delimiter: ',', headers: false }))
        .on('data', async data => {
            const counterBrand = generalCounter[data[2]];
            const counterProduct = counterBrand[data[1]];
            counterProduct.count += 1;

            const product = {
                nombre: data[0],
                tipo: data[1],
                marca: data[2],
                precioPublico: data[3],
                precioMayoreo: data[4],
                precioMedioMayoreo: data[5],
                costo: data[6],
                tiendas: [data[7], data[8], data[9], data[10], data[11], '0', '0'],
                id: `0${data[2]}0${data[1]}${String(counterProduct.count).padStart(4, '0')}`,
            };
            productsList.push(product);
        })
        .on('error', async err => {
            console.log(err);
        })
        .on('end', async () => {
            console.log('Se acabo la lectura');
            writeFileCSV();
        });
    };

createIDs();
