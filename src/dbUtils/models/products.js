const { Schema, model, models } = require('mongoose');

const upperCase = valor => valor.toUpperCase();

const ProductsSchema = new Schema(
    {
        productName: { type: String, required: true },
        brand: {
            name: { type: String, required: true },
            id: { type: Number, required: true },
        },
        productType: {
            name: { type: String, required: true },
            id: { type: Number, required: true },
        },
        wholesalePrice: { type: Number, default: 0 },
        midWholesalePrice: { type: Number, default: 0 },
        publicPrice: { type: Number, default: 0 },
        cost: { type: Number, default: 0 },
        stores: { type: Array },
    },
    { versionKey: false },
    { collection: 'employees' },
);

ProductsSchema.statics.create = async body => {
    const products = new Products({
        productName: upperCase(body.productName),
        brand: {
            name: body.brand.name,
            id: body.brand.id,
        },
        productType: {
            name: body.productType.name,
            id: body.productType.id,
        },
        wholesalePrice: body.wholesalePrice,
        midWholesalePrice: body.midWholesalePrice,
        publicPrice: body.publicPrice,
        cost: body.cost,
        stores: body.stores,
    });

    return products.save();
};

const Products = models.Products || model('Products', ProductsSchema);

module.exports = Products;
