import { useSelector } from 'react-redux';
import { phoneMask, toLocalDateString } from '../../utils/functions';

/**
 * Componente que contiene el formato del ticket para las reparaciones
 * @param {array} productsList Lista de productos
 * @param {total} total Total de la compra
 */
const SalesTicket = ({ productsList, total }) => {
    const storeName = useSelector(state => state.stores.name);
    const address = useSelector(state => state.stores.contactInfo.address);
    const cellPhone = useSelector(state => state.stores.contactInfo.whatsapp);
    const localPhone = useSelector(state => state.stores.contactInfo.phone);

    const createProductItem = (product, index) => {
        return (<div key={index} className='product'>
            <p className='name'>{product.productName}</p>
            <p className='count'>{product.count}</p>
            <p className='amount'>${product.amount}</p>
        </div>);
    };

    return(
        <div className='sale-ticket-container'>
            <img src={'/img/logoBW.svg'} alt={'logo'}/>
            <div className='info-store'>
                <p>Sucursal {storeName}</p>
                <p>{address}</p>
                <div className='contact'>
                    <img src={'/img/icons/whatsapp.png'} alt={'whatsapp'}/>
                    <p>{phoneMask(cellPhone)}</p>
                </div>
                <div className='contact'>
                    <img src={'/img/icons/phone.png'} alt={'phone'}/>
                    <p>{phoneMask(localPhone)}</p>
                </div>
            </div>
            <div><p>{toLocalDateString(new Date())}</p></div>
            <div className='sale block'>
                <div className='product header'>
                    <p className='name'>Producto</p>
                    <p className='count'>Cant.</p>
                    <p className='amount'>Sub.</p>
                </div>
                {productsList.map((item, index) => createProductItem(item, index))}
                <p className='total bold'>Total: ${total}.00</p>
            </div>
            <div className='conditions block'>
                <p className='bold title'>REVISE SU PRODUCTO</p>
                <p className='bold title'>** SALIDA LA MERCANCÍA NO HAY CAMBIOS NI DEVOLUCIONES EN EFECTIVO **</p>
            </div>
        </div>
    );
};

export default SalesTicket;
