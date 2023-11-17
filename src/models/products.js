import { Schema, model, models } from 'mongoose';
import { upperCase } from '../utils/functions';

const ProductsSchema = new Schema(
    {
        idProduct: { type: Number, required: true },
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
        idProduct: Number(body.idProduct),
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

ProductsSchema.index({ idProduct: 1 }, { unique: true });

const Products = models.Products || model('Products', ProductsSchema);

export default Products;
