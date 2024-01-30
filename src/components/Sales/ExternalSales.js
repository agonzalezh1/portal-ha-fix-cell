import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import InputText from '../Controllers/InputText';
import RadioButton from '../Controllers/RadioButton';
import { updateStocktaking } from '../../utils/apiRequest/apiProductsStocktaking';
import { TEXT_CONFIG, SALES_TYPE, PAYMENT_TYPE, ACTION_TYPES } from '../../utils/constants';
import { addProductSale } from '../../storage/salesSlice';
import { useSpinner } from '../../hooks/useSpinner';
import SalesTicket from './SalesTicket';
import Action from '../Controllers/Action';
import { useReactToPrint } from 'react-to-print';

/**
 * Componente que realiza una venta de un producto que no se encuentra en el inventario
 * @param {func} onFinish Funcion que se detona cuando responde el api. Finaliza el flujo
 */
const ExternalSales = ({ onFinish }) => {

    const { handleSubmit, control, formState } = useForm({ mode: 'onChange' });
    const currentStore = useSelector(state => state.stores.currentStore);
    const dispatch = useDispatch();
    const [loadingSpinner] = useSpinner();
    const [paymentType, setPaymentType] = useState(PAYMENT_TYPE.CASH);
    const [productsTicket, setProductsTicket] = useState({ list: [], total: 0});
    const [printTicket, setPrintTicket] = useState(false);
    const componentTicketRef = useRef();

    const rules = { required: true };

    /**
     * Función para imprimir el ticket
     */
    const handlePrint = useReactToPrint({
        content: () => componentTicketRef.current,
    });

    /**
     * Agrega la venta de un producto no esta en el inventario
     * Actualiza las ventas diarioas del redux
     * @param {object} form Formulario para agregar la venta del producto no inventariado 
     */
    const addExternalSpend = async form => {
        loadingSpinner(true, 'Guardando venta...');
        const externalProduct = {
            id: null,
            paymentType,
            count: 1,
            amount: Number(form.amount),
            productName: form.productName,
        };

        const apiResp = await updateStocktaking({ total: Number(form.amount), paymentType, products: [externalProduct], idStore: currentStore, saleType: SALES_TYPE.PRODUCTS });
        loadingSpinner(false, '');
        dispatch(addProductSale({ total: Number(form.amount), paymentType, products: [externalProduct] }));

        const { code } = apiResp;
        console.log(apiResp);
        if (code === 0) {
            setProductsTicket({
                list: [{ ...externalProduct }],
                total: externalProduct.amount,
            });
            setPrintTicket(true);
        }
        onFinish(apiResp);
    };

    return (<div>
        <form className='external-sale-container' onSubmit={handleSubmit(addExternalSpend)}>
            <div className='product-name'>
                <InputText
                    id={'productName'}
                    placeholder={'Nombre del producto'}
                    title={'Nombre del producto'}
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
            <button className='primary' disabled={!formState.isValid}>Pagar</button>
        </form>
        {printTicket && <Action label={'Imprimir ticket de compra'} type={ACTION_TYPES.PRINT} action={() => handlePrint()} />}
        <div style={{display: 'none'}}>
            <div ref={componentTicketRef}>
                <SalesTicket productsList={productsTicket.list} total={productsTicket.total}/>
            </div>
        </div>
    </div>);
};

export default ExternalSales;
