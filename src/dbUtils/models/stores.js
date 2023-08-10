const { Schema, model, models } = require('mongoose');

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
            spend: { type: Array },
        },
    },
    { versionKey: false },
    { collection: 'stores' },
);

const Stores = models.Stores || model('Stores', StoresSchema);

module.exports = Stores;
