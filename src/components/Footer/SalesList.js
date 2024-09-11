import Image from 'next/image';
import { useSelector } from 'react-redux';
import { PAYMENT_TYPE, USER_TYPE } from '../../utils/constants';
import { deleteProductSold } from '../../utils/apiRequest/apiProductsStocktaking';

/**
 * Componente para mostrar la lista de los productos vendidos en el dia
 * @param {array} list Lista de productos {id, amout, count, productName}
 * @param {function} onFinish Función que se detona cuando resonde el api que elimina una venta
 */
const SalesList = ({list, onFinish}) => {

    const currentStore = useSelector(state => state.stores.currentStore);
    const userType = useSelector(state => state.profile.profile);

    /**
     * Función que se detona cuando se le da click en el icono de borrar
     * @param {number} index indice de la lista de productos
     */
    const removeProduct = async(index) => {
        const product = list[index];
        const resp = confirm(`¿Estas seguro que deseas borrar el producto ${product.productName}?`);

        if(resp) {
            const body = {
                idSale: product.idSale,
                paymentType: product.paymentType,
                total: product.amount,
                idStore: currentStore,
                productName: product.productName,
            }
            const apiResp = await deleteProductSold(body);
            onFinish(apiResp);
        }
        
    };

    /**
     * Crea una fila en la tabla de producto vendido
     * @param {object} product Objeto con la informacion del producto
     * @param {number} index Indice del arreglo 
     */
    const createRowOfProduct = (product, index) => {
        return (
            <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.count}</td>
                <td className='bold numeric'>{`$${product.amount}.00`}</td>
                <td className='payment-type'>
                    { product.paymentType === PAYMENT_TYPE.CASH && <Image src={'/img/cash.png'} width={20} height={20} alt={'icon'}/>}
                    { product.paymentType === PAYMENT_TYPE.CARD && <Image src={'/img/card.png'} width={20} height={20} alt={'icon'}/>}
                </td>
                {(userType === USER_TYPE.ADMIN || userType === USER_TYPE.SUPERVISOR) && <td onClick={() => removeProduct(index)}>
                    <Image src={'/img/icons/delete.png'} width={20} height={20} alt={'icon'}/>
                </td>}
                {userType === USER_TYPE.SELLER && <td/>}
            </tr>
        );
    };

    return(<div className='sales-list-container'>
        <table>
            <thead>
                <tr>
                    <th>Nombre del producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Tipo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {list.map((product, index) => createRowOfProduct(product, index))}
            </tbody>
        </table>
    </div>);
};

export default SalesList;
