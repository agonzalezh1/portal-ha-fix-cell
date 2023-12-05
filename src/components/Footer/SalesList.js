import Image from 'next/image';
import { PAYMENT_TYPE } from '../../utils/constants';
/**
 * Componente para mostrar la lista de los productos vendidos en el dia
 * @param {array} list Lista de productos {id, amout, count, productName}
 */
const SalesList = ({list}) => {

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
                </tr>
            </thead>
            <tbody>
                {list.map((product, index) => createRowOfProduct(product, index))}
            </tbody>
        </table>
    </div>);
};

export default SalesList;
