import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Action from '../Controllers/Action';
import Modal from '../Modal/Modal';
import InputText from '../Controllers/InputText';
import AddStore from './AddStore';
import { ACTION_TYPES, TEXT_CONFIG } from '../../utils/constants';
import { useStores } from '../../hooks/useStores';
import { useNotification } from '../../hooks/useNotification';
import { restartSales } from '../../utils/apiRequest/apiStoresSales';
import SalesByStore from './SalesByStore';


/**
 * Muestra el dashboard de las tiendas
 * Carga la informacion inicial con el custom hook useStores
 */
const Stores = () => {

    const { control } = useForm({ mode: 'onChange' });
    const [stores, udpateStores] = useStores();
    const [setNotification] = useNotification();
    const [openModal, setOpenModal] = useState(false);
    const [cashFund, setCashFund] = useState('500');

    /**
     * Recibe la respuesta del modal de crear tiendas
     * Si se agregó correctamente, recarga la informacion
     * @param {object} result Respuesta del api
     * Revisar api PUT /stores
     */
    const validateIsCreated = result => {
        setOpenModal(false);
        setNotification(result);
        if (result.code === 0) {
            udpateStores();
        }
    };

    const restartDailySales = async () => {
        const apiResp = await restartSales({ cashFund: Number(cashFund) });
        setNotification(apiResp);
        if (apiResp.code === 0) {
            udpateStores();
        }
    };

    return (<div className='sales-admin-container'>
        <h1>Tiendas</h1>
        <div className='reset-create-store-container'>
            <button className='primary' onClick={() => restartDailySales()}>Realizar corte del día</button>
            <div className='cash-fund-container'>
                <p>Fondo de caja</p>
                <div className='cash-fund'>
                    <InputText
                        id={'cash-fund'}
                        placeholder={'0000'}
                        maxLength={4}
                        valueIn={String(cashFund)}
                        textFormat={TEXT_CONFIG.NUMBER}
                        control={control}
                        changeEvent={e => {
                            if (e === '') {
                                setCashFund('0');
                            } else {
                                setCashFund(e);
                            }
                        }}
                    />
                </div>
            </div>
            <Action label={'Agregar tienda'} type={ACTION_TYPES.INCREASE} action={() => setOpenModal(true)} />
        </div>
        <div className='store-details-container'>
            {
                stores.map(store => <SalesByStore name={store.name} sales={store.sales} dailySales={store.dailySales} key={store.name}/>)
            }
            {stores.length === 0 && <h3>No hay informacion disponible XD</h3>}
        </div>
        <Modal open={openModal} title={'Agregar nueva tienda'} onClose={() => setOpenModal(false)}>
            <AddStore onFinish={e => validateIsCreated(e)} />
        </Modal>
    </div>);
};

export default Stores;
