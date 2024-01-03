import { Schema, model, models } from 'mongoose';

const StoresSchema = new Schema(
    {
        name: { type: String, required: true},
        cashFund: { type: Number },
        sales: { type: Array },
        dailySales: {
            products: {
                cashPayment: { type: Number },
                cardPayment: { type: Number },
                list: { type: Array },
            },
            fixes: {
                cashPayment: { type: Number },
                cardPayment: { type: Number },
            },
            airtime: { type: Number },
            spend: { type: Array },
        },
    },
    { versionKey: false },
    { collection: 'stores' },
);


StoresSchema.statics.create = async body => {
    const store = new Stores({
        name: body.name,
        cashFund: 0,
        sales: [{
            period: body.period,
            products: { cashPayment: 0, cardPayment: 0 },
            fixes: { cashPayment: 0, cardPayment: 0 },
            airtime: 0,
            spend: 0,
        }],
        dailySales: {
            products: { cashPayment: 0, cardPayment: 0, list: [] },
            fixes: { cashPayment: 0, cardPayment: 0 },
            airtime: 0,
            spend: [],
        },
    });
    return store.save();
};


const Stores = models.Stores || model('Stores', StoresSchema);

export default Stores;
