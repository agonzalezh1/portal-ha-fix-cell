import { Schema, model, models } from 'mongoose';

const StoresSchema = new Schema(
    {
        name: { type: String, required: true},
        sales: { type: Array },
        dailySales: {
            products: {
                cashPayment: { type: Number },
                cardPayment: { type: Number },
            },
            fixes: {
                cashPayment: { type: Number },
                cardPayment: { type: Number },
            },
            airtime: { type: Number },
        },
    },
    { versionKey: false },
    { collection: 'stores' },
);


StoresSchema.statics.create = async body => {
    const store = new Stores({
        name: body.name,
        sales: [{
            period: body.period,
            products: { cashPayment: 0, cardPayment: 0 },
            fixes: { cashPayment: 0, cardPayment: 0 },
            airtime: 0,
        }],
        dailySales: {
            products: { cashPayment: 0, cardPayment: 0 },
            fixes: { cashPayment: 0, cardPayment: 0 },
            airtime: 0,
        },
    });
    return store.save();
};


const Stores = models.Stores || model('Stores', StoresSchema);

export default Stores;
