import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Pie de pagina de la aplicacion
 * Muestra el total de las ventas por dia de una tienda
 */
const Footer = () => {

    const sales = useSelector(state => state.sales);
    const [productsSales, setProductsSale] = useState(0);
    const [fixesSales, setfixesSale] = useState(0);
    const [airtimeSales, setAirtimeSale] = useState(0);
    const [total, setTotal] = useState(0);

    /**
     * Por cada venta agregada al store, se actualizan los valores en la pantalla
     */
    useEffect(() => {
        setProductsSale(sales.products);
        setfixesSale(sales.fixes);
        setAirtimeSale(sales.airtime);
        setTotal(sales.products + sales.fixes + sales.airtime);
    },[sales]);

    return (<div className='total-sales-container'>
        <div className='total'>
            <h2>Venta total</h2>
            <h3 className='numeric'>{`$ ${total}.00`}</h3>
        </div>
        <table>
            <tbody>
                <tr>
                    <td>Productos:</td>
                    <td className='numeric bold'>{`$ ${productsSales}.00`}</td>
                </tr>
                <tr>
                    <td>Servicios / Reparaciones:</td>
                    <td className='numeric bold'>{`$ ${fixesSales}.00`}</td>
                </tr>
                <tr>
                    <td>Recargas:</td>
                    <td className='numeric bold'>{`$ ${airtimeSales}.00`}</td>
                </tr>
            </tbody>
        </table>
    </div>);
};

export default Footer;
