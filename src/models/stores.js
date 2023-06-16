import { Schema, model, models } from 'mongoose';

const StoresSchema = new Schema(
    {
        name: { type: String, required: true},
        sales: { type: Array },
        dailySales: {
            products: { type: Number },
            fixes: { type: Number },
            airtime: { type: Number },
        },
    },
    { versionKey: false },
    { collection: 'stores' },
);


StoresSchema.statics.create = async body => {
    const store = new Stores({
        name: body.name,
        sales: [{ period: body.period, products: 0, fixes: 0, airtime: 0 }],
        dailySales: { products: 0, fixes: 0, airtime: 0 },
    });
    return store.save();
};


const Stores = models.Stores || model('Stores', StoresSchema);

export default Stores;
