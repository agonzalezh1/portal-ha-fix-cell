// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//mongodb+srv://ha_fix_cell:haFixCell01@cluster0.b5uwjuz.mongodb.net/ha_fix_cell_db
//mongodb+srv://ha_fix_cell:haFixCell01@cluster0.b5uwjuz.mongodb.net/
// https://portal-ha-fix-cell.vercel.app/
// Usuario de github y atlas adan.gonzalez0917@gmail.com

/**
{
    stores: {
        id: 12312,
        name: 'sdagfd',
        sales: [{ period: '01/2023', products: 123.12, fixes: 123.12, airtime: 123.12 }]
    },
    "productos": {
        nombre: "dafdsf",
        tipoProducto: 12,
        precioMayoreo: 1312.1231,
        precioMedioMayoreo: 123.12,
        precioPublico": 3123.1321,
        costo: 123.12,
        stores: [{id: 123456, count: 0}]
    },
    "empleados": {
        "usuario": "xxx",
        "pass": "xxx",
        "permisos": [1,2.3],
        "perfil": 1, //Admin o vendedor
        "sucursal": 1234, // Temporal en lo que veo como asociar con la ubicacion
    }
}
 */
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' });
}
