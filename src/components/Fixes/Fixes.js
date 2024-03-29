import React, { useState, useRef } from 'react';
import Action from '../Controllers/Action';
import Modal from '../Modal/Modal';
import Search from '../Search/Search';
import CreateFolio from './CreateFolio';
import FixDetails from './FixDetails';
import FixTicket from './FixTicket';
import { ACTION_TYPES } from '../../utils/constants';
import { useNotification } from '../../hooks/useNotification';
import { useSpinner } from '../../hooks/useSpinner';
import { findFolio } from '../../utils/apiRequest/apiFixes';
import { useReactToPrint } from 'react-to-print';

/**
 * Muestra la funcionalidad de Reparaciones
 * Si es una reparacion nueva, abre un modal con el alta del folio
 * Si es una consulta se muestra el resultado de la busqueda en la misma pantalla
 */
const Fixes = () => {

    const [setNotification] = useNotification();
    const [loadingSpinner] = useSpinner();
    const [openModal, setOpenModal] = useState(false);
    const [fixDetails, setFixDetails] = useState({ folio: 0, customerName: '', fixType: [], comments: '', date: '', deliveryDate: '', status: 0, advancePayment: [], total: 0 });
    const [folio, setFolio] = useState(0);
    const [newFolio, setNewFolio] = useState(0);
    const [ticketInfo, setTicketInfo] = useState({folio: 0, customerName: '', customerPhone: '', admissionDate: '', notes: '', services: [], advancePayment: 0, total: 0})
    const componentTicketRef = useRef();
    
    /**
     * Función para imprimir el ticket
     */
    const handlePrint = useReactToPrint({
        content: () => componentTicketRef.current,
    });

    /**
     * Recibe la respuesta del modal de crear folios
     * La respuesta se muestra en el componente de Notificacion
     * @param {object} result Respuesta del api
     * Revisar api PUT /fixes
     */
    const validateIsCreated = result => {
        setOpenModal(false);
        setFixDetails({ folio: 0, customerName: '', fixType: [], comments: '', date: '', deliveryDate: '', status: 0, advancePayment: [], total: 0 });
        setNotification(result);

        if (result.code === 0) {
            setNewFolio(result.response.folio);
            setTicketInfo({
                folio: result.response.folio,
                customerName: result.response.customerName,
                customerPhone: result.response.phoneNumber,
                admissionDate: result.response.date,
                notes: result.response.comments,
                services: result.response.fixes,
                advancePayment: result.response.advancePayment.amount,
                total: result.response.total,
            });
        }
    };

    /**
     * Realiza la busqueda de un folio ya sea por numero o por nombre del cliente
     */
    const searchFolio = async data => {
        let apiResp;
        setNewFolio(0);
        loadingSpinner(true, 'Buscando información...');
        if ( Number(data) ) {
            setFolio(Number(data));
            apiResp = await findFolio({ folio: Number(data) });
        } else {
            setFolio(data);
            apiResp = await findFolio({ folio: data });
        }
        loadingSpinner(false, '');

        if (apiResp.code === 0) {
            if(apiResp.response.length > 1) {
                console.log('Levantar modal para que escoja la reparacion');
            } else {
                setFixDetails({
                    folio: apiResp.response[0].folio,
                    customerName: apiResp.response[0].customerName,
                    phoneNumber: apiResp.response[0].phoneNumber,
                    fixType: apiResp.response[0].fixType,
                    comments: apiResp.response[0].comments,
                    date: apiResp.response[0].date,
                    deliveryDate: apiResp.response[0].deliveryDate,
                    status: apiResp.response[0].status,
                    advancePayment: apiResp.response[0].advancePayment,
                    total: apiResp.response[0].total,
                });
            }
        } else {
            setNotification(apiResp);
        }
    };

    const reloadDetails = () => searchFolio(folio);

    return (<div className='fixes-admin-container'>
        <h1>Reparaciones</h1>
        <div className='folio-container'>
            <Search label={'Folio o nombre del cliente'} eventSearch={e => searchFolio(e)} />
            <Action label={'Nueva reparación'} type={ACTION_TYPES.INCREASE} action={() => setOpenModal(true)} />
        </div>
        <div className='details-container'>
            {Boolean(fixDetails.folio) && <FixDetails {...fixDetails} onFinish={reloadDetails}/>}
            {Boolean(newFolio) && <div className='new-folio'>
                <h3>Se ha guardado correctamente la información con el folio: {newFolio.toString().padStart(4, '0')}</h3>
                <Action type={ACTION_TYPES.PRINT} action={() => handlePrint()} />
            </div>}
        </div>
        <Modal open={openModal} title={'Nuevo folio de reparación'} onClose={() => setOpenModal(false)}>
            <CreateFolio onFinish={e => validateIsCreated(e)} />
        </Modal>
        <div style={{display: 'none'}}>
            <div ref={componentTicketRef}>
                <FixTicket {...ticketInfo}/>
            </div>
        </div>
    </div>);
};

export default Fixes;
