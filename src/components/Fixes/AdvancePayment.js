import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputText from '../Controllers/InputText';
import RadioButton from '../Controllers/RadioButton';
import { addAdvancePayment } from '../../utils/apiRequest/apiFixes';
import { PAYMENT_TYPE, TEXT_CONFIG } from '../../utils/constants';
import { useSpinner } from '../../hooks/useSpinner';
import PropTypes from 'prop-types';

/**
 * Componente para agregar un abono al folio de reparación
 * @param {number} folio Identificador de la reparación
 * @param {func} onFinish Función que se detona cuando termina el alta del abono
 */
const AdvancePayment = ({ folio, onFinish }) => {

    const { control, handleSubmit, formState } = useForm({ mode: 'onChange' });
    const [loadingSpinner] = useSpinner();
    const [paymentType, setPaymentType] = useState(PAYMENT_TYPE.CASH);
    const requiredField = { required: true };

    /**
     * Función que guarda el abono de la reparación
     * @param {object} form Objeto con los campos del formulario
     */
    const saveAdvancePayment = async form => {
        const dataPayment = {
            folio,
            advancePayment: { type: paymentType, amount: Number(form.advancePayment)},
        };

        loadingSpinner(true, 'Guardando abono...');
        const apiResp = await addAdvancePayment(dataPayment);
        loadingSpinner(false, '');
        onFinish(apiResp);
    };

    return (<form className='advance-payment-container' onSubmit={handleSubmit(saveAdvancePayment)}>
        <RadioButton
            id={'radio-button-cash'}
            label={'Pago en efectivo'}
            control={control}
            changeEvent={() => setPaymentType(PAYMENT_TYPE.CASH)}
            name={PAYMENT_TYPE.CASH}
            state={paymentType}
            value={PAYMENT_TYPE.CASH}
        />
        <RadioButton
            id={'radio-button-card'}
            label={'Pago con tarjeta'}
            control={control}
            changeEvent={() => setPaymentType(PAYMENT_TYPE.CARD)}
            name={PAYMENT_TYPE.CARD}
            state={paymentType}
            value={PAYMENT_TYPE.CARD}
        />
        <div className='advance-payment'>
            <InputText
                id={'advancePayment'}
                placeholder={'000'}
                title={'Abono'}
                maxLength={5}
                valueIn={''}
                textFormat={TEXT_CONFIG.NUMBER}
                rules={requiredField}
                control={control}
            />
        </div>
        <button className='primary' disabled={!formState.isValid}>Agregar</button>
    </form>);
};

AdvancePayment.propTypes = {
    folio: PropTypes.number.isRequired,
    onFinish: PropTypes.func.isRequired,
};

export default AdvancePayment;
