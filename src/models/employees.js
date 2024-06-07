import { Schema, model, models } from 'mongoose';

const EmployeesSchema = new Schema(
    {
        username: { type: String, required: true},
        password: { type: String, required: true },
        name: { type: String, required: true },
        store: { type: String, required: true },
        grants: { type: Array },
        profile: { type: Number },
        attendance: { type: Array },
    },
    { versionKey: false },
    { collection: 'employees' },
);

EmployeesSchema.index({ username: 1 }, { unique: true });

const Employees = models.Employees || model('Employees', EmployeesSchema);

export default Employees;
