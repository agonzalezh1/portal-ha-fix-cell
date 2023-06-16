import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import TextArea from '../Controllers/TextArea';
import InputText from '../Controllers/InputText';
import { TEXT_CONFIG, SALES_TYPE } from '../../utils/constants';
import { useNotification } from '../../hooks/useNotification';
import { addFixSale } from '../../storage/salesSlice';
import { updateStocktaking } from '../../utils/apiRequest/apiProductsStocktaking';

/**
 * Muestra el formulario para las ventas por servicios / reparaciones
 */
const ServicesSales = () => {

    const { handleSubmit, control, formState } = useForm({ mode: 'onChange' });
    const dispatch = useDispatch();
    const requiredField = { required: true };
    const [setNotification] = useNotification();
    const currentStore = useSelector(state => state.stores.currentStore);

    /**
     * Actualiza en la base de datos las ventas por servicios
     * @param {object} form Objeto con los datos del formilario
     */
    const payService = async form => {
        const apiResp = await updateStocktaking({ total: Number(form.total), products: [], idStore: currentStore, saleType: SALES_TYPE.SERVICES });
        setNotification(apiResp);
        dispatch(addFixSale(Number(form.total)));
        // TODO No borrar el console hasta que esten chidas las pruebas de las ventas
        console.log(apiResp.response);
    };

    return (<form className='service-sales-container' onSubmit={handleSubmit(payService)}>
        <div className='comments'>
            <TextArea
                id={'textarea'}
                rules={requiredField}
                control={control}
                label={'Comentarios'}
            />
        </div>
        <div className='id-service'>
            <div>
                <InputText
                    id={'idService'}
                    placeholder={'00000'}
                    title={'Folio de servicio'}
                    maxLength={5}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>

        </div>
        <div className='total'>
            <div>
                <InputText
                    id={'total'}
                    placeholder={'0'}
                    title={'Total'}
                    maxLength={5}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
        </div>
        <div className='pay-button'>
            <button className='primary' disabled={!formState.isValid} >Pagar</button>
        </div>
    </form>);
};

export default ServicesSales;
