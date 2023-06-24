import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import InputText from '../Controllers/InputText';
import { TEXT_CONFIG } from '../../utils/constants';
import { addSpendInStore } from '../../utils/apiRequest/apiStoresSales';
import { addSpend } from '../../storage/salesSlice';

/**
 * Formulario para declarar los gastos
 * Realiza el acumulado de los gastos de una tienda
 * @param {func} onFinish Funcion que se detona cuando el api que guarda la info responde
 */
const Spend = ({ onFinish }) => {

    const { handleSubmit, control, formState } = useForm({ mode: 'onChange' });
    const dispatch = useDispatch();
    const currentStore = useSelector(state => state.stores.currentStore);

    const rules = { required: true };

    /**
     * Invoca el api para el acumulado de las ventas
     * @param {object} form Campos del formulario (descripcion y monto)
     */
    const addNewSpend = async form => {
        const apiResp = await addSpendInStore({
            idStore: currentStore,
            description: form.description,
            amount: Number(form.amount),
        });

        dispatch(addSpend(Number(form.amount)));
        onFinish(apiResp);
    };

    return (<form className='spend-container' onSubmit={handleSubmit(addNewSpend)}>
        <div className='description'>
            <InputText
                id={'description'}
                placeholder={'Gasto'}
                title={'Concepto'}
                maxLength={40}
                valueIn={''}
                textFormat={TEXT_CONFIG.ALPHANUM_WITH_SPACES}
                rules={rules}
                control={control}
            />
        </div>
        <div className='amount'>
            <InputText
                id={'amount'}
                placeholder={'000'}
                title={'Monto'}
                maxLength={5}
                valueIn={''}
                textFormat={TEXT_CONFIG.NUMBER}
                rules={rules}
                control={control}
            />
        </div>
        <button className='primary' disabled={!formState.isValid} >Enviar</button>
    </form>);
};

export default Spend;
