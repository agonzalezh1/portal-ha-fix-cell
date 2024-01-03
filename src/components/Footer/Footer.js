import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../Modal/Modal';
import SalesList from './SalesList';

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
    const [cashFund, setCashFund] = useState(0);
    const [total, setTotal] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    /**
     * Por cada venta agregada al store, se actualizan los valores en la pantalla
     */
    useEffect(() => {
        setProductsSale(sales.products);
        setfixesSale(sales.fixes);
        setAirtimeSale(sales.airtime);
        setSpend(sales.spend);
        setCashFund(sales.cashFund);
        setTotal(sales.products.cashPayment + sales.products.cardPayment + sales.fixes.cashPayment + sales.fixes.cardPayment + sales.airtime - sales.spend);
    },[sales]);

    return (<>
        <div className='total-sales-container'>
            <div className='total'>
                <h2 className='total-sales-style' onClick={() => setOpenModal(true)}>Venta total + FC</h2>
                <h3 className='numeric'>{`$ ${total + cashFund}.00`}</h3>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td>Productos:</td>
                        <td className='numeric bold'>{`$ ${productsSales.cashPayment}.00`}</td>
                        <td className='numeric bold'>{`$ ${productsSales.cardPayment}.00`}</td>
                        <td>Gastos:</td>
                        <td className='numeric bold'>{`$ ${spend}.00`}</td>
                    </tr>
                    <tr>
                        <td>Reparaciones:</td>
                        <td className='numeric bold'>{`$ ${fixesSales.cashPayment}.00`}</td>
                        <td className='numeric bold'>{`$ ${fixesSales.cardPayment}.00`}</td>
                        <td>Fondo de Caja:</td>
                        <td className='numeric bold'>{`$ ${cashFund}.00`}</td>
                    </tr>
                    <tr>
                        <td>Recargas:</td>
                        <td className='numeric bold'>{`$ ${airtimeSales}.00`}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Modal open={openModal} title={'Detalle de ventas'} onClose={() => setOpenModal(false)}>
            <SalesList list={sales.products.list}/>
        </Modal>
    </>
    );
};

export default Footer;
