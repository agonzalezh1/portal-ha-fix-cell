import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputText from '../../Controllers/InputText';
import { TEXT_CONFIG } from '../../../utils/constants';

/**
 * Muestra el cambio que se le debe de regresar al cliente cuando realiza un pago
 * @param {number} total Monto total de la compra
 * @param {funcion} onFinish Funcion que se detona cuando termina el flujo
 */
const ChangeModal = ({ total, onFinish }) => {

    const { control, formState } = useForm({ mode: 'onChange' });
    const [payment, setPayment] = useState(0);

    const rules = {
        required: true,
        validate: value => parseInt(value, 10) >= total,
    };

    return (<div className='change-modal-container'>
        <p className='bold'>Total: {total}</p>
        <div className='payment'>
            <InputText
                id={'payment'}
                title={'Recibido'}
                placeholder={'0'}
                maxLength={5}
                valueIn={''}
                textFormat={TEXT_CONFIG.NUMBER}
                rules={rules}
                control={control}
                changeEvent={e => setPayment(Number(e))}
            />
        </div>
        <p className='change bold'>Cambio: {payment - total}</p>
        <button className='primary' disabled={!formState.isValid} onClick={() => onFinish()}>Pagar</button>
    </div>)
};

export default ChangeModal;
