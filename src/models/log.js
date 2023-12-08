import { Schema, model, models } from 'mongoose';

const LogsSchema = new Schema(
    {
        t: { type: Date, required: true }, // Hora
        s: { type: String, required: true }, // Severidad
        id: { type: String, required: true }, // Identificador
        c: { type: String, required: true }, // Componente
        ctx: { // Informacion adicional
            store: { type: String, required: true },
        },
        msg: { type: String, required: true }, // Mensaje
    },
    { versionKey: false },
    { collection: 'logs' },
);

LogsSchema.statics.create = async body => {
    const log = new Logs({
        t: body.time,
        s: body.severity,
        id: body.uuid,
        c: body.component,
        ctx: {
            store: body.context.store,
        },
        msg: body.message,
    });
    return log.save();
};

const Logs = models.Logs || model('Logs', LogsSchema);

export default Logs;
