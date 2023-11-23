import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import TextArea from '../Controllers/TextArea';
import InputText from '../Controllers/InputText';
import Picker from '../Controllers/Picker';
import AdvancePayment from './AdvancePayment';
import FixPayment from './FixPayment';
import Modal from '../Modal/Modal';
import { createCatalog, capitalize } from '../../utils/functions';
import { STATUS_FIXES_TYPES, MONTHS, TEXT_CONFIG, PAYMENT_TYPE } from '../../utils/constants';
import { useSpinner } from '../../hooks/useSpinner';
import { useNotification } from '../../hooks/useNotification';
import { updateFix } from '../../utils/apiRequest/apiFixes';
import PropTypes from 'prop-types';

/**
 * Consulta de información de un folio de reparación
 * @param {number} folio Identificador de la reparación
 * @param {string} customerName Nombre del cliente
 * @param {array} fixType Lista de las reparaciones a realizar
 * @param {array} comments Historial de comentarios de la reparación
 * @param {string} date Fecha de ingreso del equipo
 * @param {string} deliveryDate Fecha de entrega del equipo
 * @param {number} status Estatus de la reparación
 * @param {array} advancePayment Lista de abonos del cliente
 * @param {number} total Costo total de la reparación
 * @param {func} onFinish Funcion que se detona cuando termina el proceso de guardar cambios, agregar abono o liquidar reparación
 */
const FixDetails = ({ folio, customerName, fixType, comments, date, deliveryDate, status, advancePayment, total, onFinish }) => {

    const { handleSubmit, control, formState, formState: { errors } } = useForm({ mode: 'onChange' });
    const [loadingSpinner] = useSpinner();
    const [setNotification] = useNotification();
    const [openModalAdvancePay, setOpenModalAdvancePay] = useState(false);
    const [openModalPayFix, setOpenModalPayFix] = useState(false);
    const [payType, setPayType] = useState('');
    const [disabledComponent, setDisabledComponent] = useState(status === 5 ? true : false);
    const [statusOptions, setStatusOptions] = useState([]);
    const requiredField = { required: true };

    /**
     * Transformala fecha de entrada a un formato legible
     * @param {string} inputDate Fecha completa
     */
    const toLocalDateString = inputDate => {

        const inDate = new Date(inputDate);
        const timezoneOffset = inDate.getTimezoneOffset() * 60000;
        const newDate = new Date(inDate.getTime() + timezoneOffset);
        const day = newDate.getDate();
        const month = MONTHS[newDate.getMonth()];

        return `${day} de ${month}`;
    };

    /**
     * Calcula la garantia de la reparacion
     * La constante esta a 30 dias en milisegundos
     */
    const getWarranty = () => {
        const warranty = 2592000000;

        const inDate = new Date(deliveryDate);
        const currentDate = new Date();
        const diff = currentDate - inDate;

        return diff < warranty ? true : false;
    };

    /**
     * Actualiza el folio de reparación con nuevos comentarios, nuevo estus o cambio en el total
     * @param {object} form Objeto con los campos del formulario (cnuevo comentario, estatus o total)
     */
    const updateFixDetails = async form => {
        loadingSpinner(true, 'Guardando información...');
        const apiResp = await updateFix({ folio, comments: form.comments ? form.comments : undefined, status: form.status, total: form.total });
        loadingSpinner(false, '');

        if (apiResp.code === 0) {
            onFinish();
        }
        setNotification(apiResp);
    };

    /**
     * Recibe la notificacion de que el abono ya se ejecutó
     * @param {object} result Respuesta del api
     */
    const validateIsSaved = result => {
        setOpenModalAdvancePay(false);
        setNotification(result);
        onFinish();
    };

    /**
     * Recibe la notificacion de que el pago ya se ejecutó
     * @param {object} result Respuesta del api
     */
    const validatePay = result => {
        setPayType('');
        setOpenModalPayFix(false);
        setNotification(result);
        onFinish();
    };

    /**
     * Funcion para crear la lista de opciones
     * Elimina la ultima opcion (Entregado) en caso de que no se tenga ese estatus de entrada
     * status = 5 -> Entregado
     */
    const getStatusOptions = () => {
        const catalogTemp = createCatalog(STATUS_FIXES_TYPES);
        if (status === 5) {
            setStatusOptions(catalogTemp);
        } else {
            setStatusOptions(catalogTemp.slice(0, catalogTemp.length - 1));
        }
    };

    /**
     * Efecto para abrir/cerrar el modal de liquidar reparación
     */
    useEffect(() => {
        if(payType) {
            setOpenModalPayFix(true);
        }
    },[payType]);

    /**
     * Efecto para reiniciar la bandera del bloqueo de componentes
     */
    useEffect(() => {
        setDisabledComponent(status === 5 ? true : false);
        getStatusOptions();
    },[status]);

    return (<div>
        <form className='fix-details-container' onSubmit={handleSubmit(updateFixDetails)}>
            <div className='info'>
                <h3 className='bold folio'>{`Folio: ${folio}`}</h3>
                <h3 className='bold customer-name'>{`Cliente: ${capitalize(customerName)}`}</h3>
                {status === 5 && <div className='date-admission'>
                    <p>Fecha de entrega: <span className='bold'>{toLocalDateString(deliveryDate)}</span></p>
                    <Image src={`/img/icons/${getWarranty() ? 'warranty': 'noWarranty'}.png`} width={20} height={20} alt={'icon'} />
                </div>}
                {status !== 5 && <p className='date-admission'>Fecha de recepción: <span className='bold'>{toLocalDateString(date)}</span></p>}
                <div className='status'>
                    <p>Estatus:</p>
                    <div className='picker'>
                        <Picker
                            id={'status'}
                            label={''}
                            options={statusOptions}
                            control={control}
                            defaultValue={String(status)}
                            disabled={disabledComponent}
                        />
                    </div>
                </div>
            </div>
            <div className='border' />
            <p className='bold'>Reparaciones a realizar</p>
            <ol>
                {fixType.map(fix => <li key={fix}>{fix}</li>)}
            </ol>
            <div className='border' />
            <p className='bold'>Comentarios</p>
            <div className='comments'>
                {
                    comments.map((comment, index) => <div key={index} className='item'>
                        <Image src={'/img/icons/comments.png'} width={24} height={24} alt={'icon'} />
                        <p className='text'>{comment}</p>
                    </div>)
                }
            </div>
            <div className='add-comment'>
                <TextArea
                    id={'comments'}
                    control={control}
                    label={'Agregar nuevo comentario'}
                />
            </div>
            <div className='advance-payment'>
                <p>{`Pagos por adelantado:${advancePayment.map(item => ` $${item.amount} (${item.type})`)}`}</p>
                <button
                    className='primary'
                    onClick={e => {
                        e.preventDefault();
                        setOpenModalAdvancePay(true);
                    }}
                    disabled={disabledComponent}
                >Agregar abono
                </button>
            </div>
            <div className='total'>
                <InputText
                    id={'total'}
                    title={'Total'}
                    placeholder={'0000'}
                    maxLength={5}
                    errors={errors.total}
                    valueIn={String(total)}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                    disabled={disabledComponent}
                />
            </div>
            <div className='save'>
                <button className='primary' disabled={!formState.isValid}>Guardar</button>
            </div>
            <div className='payment-type'>
                <button
                    className='secondary icon'
                    onClick={e => {
                        e.preventDefault();
                        setPayType(PAYMENT_TYPE.CASH);

                    }}
                    disabled={disabledComponent}
                >
                    Liquidar en efectivo
                    <Image src={'/img/cash.png'} width={24} height={24} alt={'icon'} />
                </button>
                <button
                    className='secondary icon'
                    onClick={e => {
                        e.preventDefault();
                        setPayType(PAYMENT_TYPE.CARD);
                    }}
                    disabled={disabledComponent}
                >
                    Liquidar con tarjeta
                    <Image src={'/img/card.png'} width={24} height={24} alt={'icon'} />
                </button>
            </div>
        </form>
        <Modal open={openModalAdvancePay} title={'Agregar un abono'} onClose={() => setOpenModalAdvancePay(false)}>
            <AdvancePayment folio={folio} onFinish={e => validateIsSaved(e)}/>
        </Modal>
        <Modal
            open={openModalPayFix}
            title={'Liquidar reparación'}
            onClose={() => {
                setOpenModalPayFix(false);
                setPayType('');
            }}
        >
            <FixPayment folio={folio} total={total} advancePayment={advancePayment} paymentType={payType} onFinish={e => validatePay(e)}/>
        </Modal>
    </div>);
};

FixDetails.propTypes = {
    folio: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    fixType: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    date: PropTypes.string.isRequired,
    deliveryDate: PropTypes.string,
    status: PropTypes.number.isRequired,
    advancePayment: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    onFinish: PropTypes.func.isRequired,
};

export default FixDetails;
