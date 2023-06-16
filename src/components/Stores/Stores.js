import React, { useState } from 'react';
import Action from '../Controllers/Action';
import Modal from '../Modal/Modal';
import AddStore from './AddStore';
import { ACTION_TYPES } from '../../utils/constants';
import { useStores } from '../../hooks/useStores';
import { useNotification } from '../../hooks/useNotification';
import { restartSales } from '../../utils/apiRequest/apiStoresSales';
import SalesByStore from './SalesByStore';


/**
 * Muestra el dashboard de las tiendas
 * Carga la informacion inicial con el custom hook useStores
 */
const Stores = () => {

    const [stores, udpateStores] = useStores();
    const [setNotification] = useNotification();
    const [openModal, setOpenModal] = useState(false);

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
        const apiResp = await restartSales();
        setNotification(apiResp);
        if (apiResp.code === 0) {
            udpateStores();
        }
    };

    return (<div>
        <h1>Tiendas</h1>
        <button className='primary' onClick={() => restartDailySales()}>Realizar corte del día</button>
        <Action label={'Agregar tienda'} type={ACTION_TYPES.INCREASE} action={() => setOpenModal(true)} />
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
