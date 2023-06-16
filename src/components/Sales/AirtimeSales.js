import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import InputText from '../Controllers/InputText';
import { TEXT_CONFIG, SALES_TYPE } from '../../utils/constants';
import { addAirtimeSale } from '../../storage/salesSlice';
import { updateStocktaking } from '../../utils/apiRequest/apiProductsStocktaking';

/**
 * Formulario para las ventas de tiempo aire
 * Realiza el acumulado de las ventas
 * @param {func} onFinish Funcion que se detona cuando el api que guarda la info responde
 */
const AirtimeSales = ({ onFinish }) => {

    const { handleSubmit, control, formState } = useForm({ mode: 'onChange' });
    const dispatch = useDispatch();
    const currentStore = useSelector(state => state.stores.currentStore);

    const rules = {
        require: true,
        validate: value => parseInt(value, 10) >= 10,
    };

    /**
     * Invoca el api para el acumulado de las ventas
     * @param {object} form Campos del formulario (solo el monto)
     */
    const payAirtime = async form => {
        const apiResp = await updateStocktaking({
            total: Number(form.amount),
            products: [],
            idStore: currentStore,
            saleType: SALES_TYPE.AIRTIME,
        });

        dispatch(addAirtimeSale(Number(form.amount)));
        onFinish(apiResp);
        // TODO No borrar el console hasta que esten chidas las pruebas de las ventas
        console.log(apiResp.response);
    };

    return (<form className='airtime-container' onSubmit={handleSubmit(payAirtime)}>
        <div className='amount-container'>
            <p>Monto de la recarga</p>
            <div className='amount'>
                <InputText
                    id={'amount'}
                    placeholder={'10'}
                    maxLength={4}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={rules}
                    control={control}
                />
            </div>
        </div>
        <button className='primary' disabled={!formState.isValid} >Pagar</button>
    </form>);
};

export default AirtimeSales;
