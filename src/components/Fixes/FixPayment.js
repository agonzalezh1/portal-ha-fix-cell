import { useState } from 'react';
import Proptypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { fixTotalPayment } from '../../utils/apiRequest/apiFixes';
import { useSpinner } from '../../hooks/useSpinner';
import { getSalesByStore } from '../../utils/apiRequest/apiStoresSales';
import { addSales } from '../../storage/salesSlice';
import { PAYMENT_TYPE } from '../../utils/constants';
import Modal from '../Modal/Modal';
import ChangeModal from '../Sales/ChangeModal/ChangeModal';

/**
 * Componente que muestra el formulario para la liquidación de una reparación
 * @param {number} folio Identificador de la reparación
 * @param {number} total Monto total de la reparación
 * @param {array} advancePayment Lista de abonos del cliente
 * @param {string} paymentType Tipo de pago final del cliente
 * @param {func} onFinish Función que se detona cuando termina el proceso de liquidación
 */
const FixPayment = ({ folio, total, advancePayment, paymentType, onFinish }) => {

    const currentStore = useSelector(state => state.stores.currentStore);
    const [loadingSpinner] = useSpinner();
    const dispatch = useDispatch();
    const [totalAdvancePayment] = useState(advancePayment.reduce( (acc, current) => acc + current.amount, 0));
    const [openChangeModal, setOpenChangeModal] = useState(false);

    /**
     * Valida el tipo de pago
     * Si es con efectivo, abre un modal para calcular el cambio
     * Si es con tarjeta, realiza la actualizacion en la base de datos
     */
    const validatePayment = () => {
        if(paymentType === PAYMENT_TYPE.CASH) {
            setOpenChangeModal(true);
        } else {
            paymentFix();
        }
    };

    /**
     * Continua con el pago y la actualización en la base de datos despues de que se valida el cambio
     */
    const continuePayment = () => {
        setOpenChangeModal(false);
        paymentFix();
    };

    /**
     * Función que ejecuta el pago total de la reparación
     * Se envían todos los abonos para que sean agregados a la venta total del dia y al acumulado
     */
    const paymentFix = async() => {
        const currentDate = new Date().setSeconds(0,0);

        loadingSpinner(true, 'Guardando venta...');
        const apiResp = await fixTotalPayment({ folio, total, advancePayment, paymentType, deliveryDate: currentDate, idStore: currentStore });
        loadingSpinner(false);
        onFinish(apiResp);

        getSalesByStore(currentStore).then( resp => {
            dispatch(addSales({
                products: resp.response.products,
                fixes: resp.response.fixes,
                airtime: resp.response.airtime,
                spend: resp.response.spend,
                cashFund: resp.response.cashFund,
            }));
        });
    };

    return (<>
        <h3 className=''>{`Total: $${total}.00`}</h3>
        <h3 className=''>{`Anticipo: $${totalAdvancePayment}.00`}</h3>
        <h3 className=''>{`Restante: $${total-totalAdvancePayment}.00`}</h3>
        <button className='primary' onClick={() => validatePayment()}>Pagar</button>
        <Modal open={openChangeModal} title={'Cantidad a pagar'} onClose={() => setOpenChangeModal(false)}>
            <ChangeModal total={total} onFinish={() => continuePayment()}/>
        </Modal>
    </>);
};

FixPayment.propTypes = {
    folio: Proptypes.number.isRequired,
    total: Proptypes.number.isRequired,
    advancePayment: Proptypes.array.isRequired,
    paymentType: Proptypes.string.isRequired,
    onFinish: Proptypes.func.isRequired,
};

export default FixPayment;
