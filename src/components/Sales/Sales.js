import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { SALES_TYPE } from '../../utils/constants';
import ProductsSales from './ProductsSales';
import ServicesSales from './ServicesSales';
import AirtimeSales from './AirtimeSales';
import { useNotification } from '../../hooks/useNotification';
import Modal from '../Modal/Modal';
import RadioButton from '../Controllers/RadioButton';

/**
 * Muestra el menu para el tipo de venta
 * Las ventas de productos y servicios son por medio de un radio
 * La venta por recargas es por un modal
 */
const Sales = () => {

    const { control } = useForm({ mode: 'onChange' });
    const [openModal, setOpenModal] = useState(false);
    const [setNotification] = useNotification();
    const [saleType, setSaleType] = useState(SALES_TYPE.PRODUCTS);

    /**
     * Recibe la respuesta de la venta de tiempor aire
     * @param {object} result respuesta del api POST /sales
     */
    const paymentValidate = result => {
        setOpenModal(false);
        setNotification(result);
    };

    return (<div className='sales-container'>
        <div className='sale-type-container'>
            <RadioButton
                id={`radio-button-${SALES_TYPE.PRODUCTS}`}
                label={SALES_TYPE.PRODUCTS}
                control={control}
                changeEvent={e => setSaleType(e.value)}
                value={SALES_TYPE.PRODUCTS}
                state={saleType}
                name={SALES_TYPE.PRODUCTS}
            />
            <RadioButton
                id={`radio-button-${SALES_TYPE.SERVICES}`}
                label={SALES_TYPE.SERVICES}
                control={control}
                changeEvent={e => setSaleType(e.value)}
                value={SALES_TYPE.SERVICES}
                state={saleType}
                name={SALES_TYPE.SERVICES}
            />
            <div className='airtime' onClick={() => setOpenModal(true)}>
                <Image src={'/img/airtime.png'} width={25} height={25} alt={'logo'}/>
                <p>Recargas</p>
            </div>
        </div>
        { saleType === SALES_TYPE.PRODUCTS && <ProductsSales /> }
        { saleType === SALES_TYPE.SERVICES && <ServicesSales /> }
        <Modal open={openModal} title={'Recargas tiempo aire'} onClose={() => setOpenModal(false)}>
            <AirtimeSales onFinish={e => paymentValidate(e)} />
        </Modal>
    </div>);
};

export default Sales;
