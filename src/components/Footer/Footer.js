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
    const [spend, setSpend] = useState(0);
    const [total, setTotal] = useState(0);

    /**
     * Por cada venta agregada al store, se actualizan los valores en la pantalla
     */
    useEffect(() => {
        setProductsSale(sales.products);
        setfixesSale(sales.fixes);
        setAirtimeSale(sales.airtime);
        setSpend(sales.spend);
        setTotal(sales.products.cashPayment + sales.products.cardPayment + sales.fixes.cashPayment + sales.fixes.cardPayment + sales.airtime - sales.spend);
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
                    <td className='numeric bold'>{`$ ${productsSales.cashPayment}.00`}</td>
                    <td className='numeric bold'>{`$ ${productsSales.cardPayment}.00`}</td>
                </tr>
                <tr>
                    <td>Servicios / Reparaciones:</td>
                    <td className='numeric bold'>{`$ ${fixesSales.cashPayment}.00`}</td>
                    <td className='numeric bold'>{`$ ${fixesSales.cardPayment}.00`}</td>
                </tr>
                <tr>
                    <td>Recargas:</td>
                    <td className='numeric bold'>{`$ ${airtimeSales}.00`}</td>
                </tr>
                <tr>
                    <td>Gastos:</td>
                    <td className='numeric bold'>{`$ ${spend}.00`}</td>
                </tr>
            </tbody>
        </table>
    </div>);
};

export default Footer;
