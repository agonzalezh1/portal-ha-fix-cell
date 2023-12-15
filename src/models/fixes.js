import { Schema, model, models } from 'mongoose';

const FixesSchema = new Schema(
    {
        folio: { type: Number, required: true},
        customerName: { type: String, required: true },
        fixType: { type: Array },
        store: { type: String, required: true },
        comments: { type: Array },
        total: { type: Number },
        advancePayment: { type: Array },
        date: { type: Date, required: true},
        deliveryDate:{ type: Date },
        status: { type: Number, required: true},
    },
    { versionKey: false },
    { collection: 'fixes' },
);

FixesSchema.statics.create = async body => {

    const comment = [];
    comment.push(body.comments);
    const fixes = new Fixes({
        folio: body.folio,
        customerName: body.customerName,
        fixType: body.fixes,
        store: body.store,
        comments: comment,
        total: body.total,
        advancePayment: body.advancePayment,
        date: body.date,
        deliveryDate: body.date,
        status: 1,
    });
    return fixes.save();
};

FixesSchema.index({ folio: 1 }, { unique: true });

const Fixes = models.Fixes || model('Fixes', FixesSchema);

export default Fixes;
