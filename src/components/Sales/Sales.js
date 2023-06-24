import React, { useState } from 'react';
import Image from 'next/image';
import ProductsSales from './ProductsSales';
import AirtimeSales from './AirtimeSales';
import Spend from './Spend';
import { useNotification } from '../../hooks/useNotification';
import Modal from '../Modal/Modal';

/**
 * Muestra el fomulario para capturar una venta
 * La venta puede ser en efectivo o con tarjeta
 * La venta por recargas es por un modal
 * Agregar un gasto es por modal
 */
const Sales = () => {

    const [openModal, setOpenModal] = useState(false);
    const [openModalSpend, setOpenModalSpend] = useState(false);
    const [setNotification] = useNotification();

    /**
     * Recibe la respuesta de la venta de tiempor aire
     * @param {object} result respuesta del api POST /sales
     */
    const paymentValidate = result => {
        setOpenModal(false);
        setNotification(result);
    };

    /**
     * Muestra el modal para agregar un gasto
     * @param {*} result 
     */
    const spendValidate = result => {
        setOpenModalSpend(false);
        setNotification(result);
    };

    return (<div className='sales-container'>
        <h1>Ventas</h1>
        <div className='sale-type-container'>
            <div className='airtime' onClick={() => setOpenModalSpend(true)}>
                <Image src={'/img/spend.png'} width={25} height={25} alt={'spend'}/>
                <p>Gastos</p>
            </div>
            <div className='airtime' onClick={() => setOpenModal(true)}>
                <Image src={'/img/airtime.png'} width={25} height={25} alt={'airtime'}/>
                <p>Recargas</p>
            </div>
        </div>
        <ProductsSales />
        <Modal open={openModalSpend} title={'Agregar un gasto'} onClose={() => setOpenModalSpend(false)}>
            <Spend onFinish={e => spendValidate(e)} />
        </Modal>
        <Modal open={openModal} title={'Recargas tiempo aire'} onClose={() => setOpenModal(false)}>
            <AirtimeSales onFinish={e => paymentValidate(e)} />
        </Modal>
    </div>);
};

export default Sales;
