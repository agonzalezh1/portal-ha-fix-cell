import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Search from '../Search/Search';
import { getProductByName } from '../../utils/apiRequest/apiProducts';
import { updateStocktaking } from '../../utils/apiRequest/apiProductsStocktaking';
import { useNotification } from '../../hooks/useNotification';
import { useSpinner } from '../../hooks/useSpinner';
import { SALES_TYPE, PAYMENT_TYPE, ACTION_TYPES } from '../../utils/constants';
import { addProductSale } from '../../storage/salesSlice';
import { v4 as uuidv4 } from 'uuid';
import ProductsList from './ProductsList/ProductsList';
import ChangeModal from './ChangeModal/ChangeModal';
import Modal from '../Modal/Modal';
import { useReactToPrint } from 'react-to-print';
import Action from '../Controllers/Action';
import SalesTicket from './SalesTicket';

/**
 * Formulariop para realiza una venta de productos
 * Se crea un Carrito de compra para realizar 2 operaciones
 * - Descuento de los articulos en el inventario de la tienda
 * - Acumulado de la venta mensual y diario
 * Por cada articulo que se agrega al carrito, se quita de la siguiente busqueda para evitar errores de inventario
 */
const ProductsSales = () => {

    const [setNotification] = useNotification();
    const [loadingSpinner] = useSpinner();
    const dispatch = useDispatch();
    const currentStore = useSelector(state => state.stores.currentStore);
    const [openModal, setOpenModal] = useState(false);
    const [openChangeModal, setOpenChangeModal] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [printTicket, setPrintTicket] = useState(false);
    const [productsTicket, setProductsTicket] = useState({ list: [], total: 0});
    const componentTicketRef = useRef();

    /**
     * Función para imprimir el ticket
     */
    const handlePrint = useReactToPrint({
        content: () => componentTicketRef.current,
    });

    /**
     * Busqueda de articulos por coincidencia de nombres
     * Realiza una busqueda de Carrito de compras vs el resultado de la busqueda
     * Se eliminan las coincidencias para evitar errores en el stock
     * Si la busqueda no regresa datos, se responde con una notificacion
     * @param {string} idProduct Nombre del producto
     */
    const searchProduct = async idProduct => {
        setPrintTicket(false);
        loadingSpinner(true, 'Buscando producto...');
        const apiResp = await getProductByName(idProduct);
        loadingSpinner(false, '');
        if (apiResp.code === 0) {
            // Elimina coincidencias de la busqueda
            const productsTemp = [...apiResp.response];
            shoppingCart.forEach(productCart => {
                const index = productsTemp.findIndex(pt => pt.id === productCart.id);
                if (index !== -1) {
                    productsTemp.splice(index, 1);
                }
            });
            setProductsList(productsTemp);
        } else {
            setNotification(apiResp);
        }
    };

    /**
     * Agrega el producto seleccionado de la busqueda al carrito de compra
     * El evento se detona cuando se acepta el producto del modal
     * @param {object} event Producto seleccionado
     */
    const addProduct = event => {
        const newProduct = {
            id: event.productSelected.id,
            idProduct: event.productSelected.idProduct,
            productName: event.productSelected.productName,
            count: event.count,
            amount: event.amount,
        };
        shoppingCart.push(newProduct);
        setOpenModal(false);
        setShoppingCart([...shoppingCart]);
    };

    /**
     * Elimina un producto del carrito de compra
     * @param {number} index Indice seleccionado de la tabla de productos
     */
    const removeProduct = index => {
        const shoppingTemp = [...shoppingCart];
        shoppingTemp.splice(index,1);
        setShoppingCart([...shoppingTemp]);
    };

    /**
     * Continua con el pago y la actualización en la base de datos despues de que se valida el cambio
     */
    const continuePayment = () => {
        setOpenChangeModal(false);
        payProducts(PAYMENT_TYPE.CASH);
    };

    /**
     * Finaliza la compra
     * Actualiza el stock de la tienda
     * Actualiza el monto de las ventas
     * @param {string} paymentType Forma de pago Efectivo|Tarjeta
     */
    const payProducts = async paymentType => {
        const productsTemp = shoppingCart.map(product => {
            return {
                paymentType,
                id: product.id,
                count: product.count,
                amount: product.amount,
                productName: product.productName,
                idSale: uuidv4(),
            };
        });

        loadingSpinner(true, 'Guardando venta y actualizando el inventario...');
        const apiResp = await updateStocktaking({ total, paymentType, products: productsTemp, idStore: currentStore, saleType: SALES_TYPE.PRODUCTS });
        loadingSpinner(false, '');
        setNotification(apiResp);
        setShoppingCart([]);
        setPrintTicket(true);
        setProductsTicket({list: productsTemp, total});
        dispatch(addProductSale({ total, paymentType, products: productsTemp }));
        // TODO No borrar el console hasta que esten chidas las pruebas de las ventas
        console.log(apiResp.response);
    };

    /**
     * Crea un registro en la tabla de productos
     * @param {object} product Informacion del producto
     * @param {number} index Indice de la lista logica
     */
    const createRowOfProduct = (product, index) => {
        return (
            <tr key={product.productName}>
                <td>{product.idProduct}</td>
                <td>{product.productName}</td>
                <td className='numeric'>{product.count}</td>
                <td className='numeric'>{product.amount}</td>
                <td onClick={() => removeProduct(index)}>
                    <Image src={'/img/icons/delete.png'} width={20} height={20} alt={'icon'}/>
                </td>
            </tr>
        );
    };

    /**
     * Cada vez que se agrega / elimina un producto, se calcula el total de la compra
     */
    useEffect(() => {
        let totalTemp = 0;
        shoppingCart.forEach(a => totalTemp += a.amount);
        setTotal(totalTemp);
    }, [shoppingCart]);

    /**
     * Cada vez que se realiza una busqueda de producto, se abre el modal para la seleccion
     */
    useEffect(() => {
        if(productsList.length > 0) {
            setOpenModal(true);
        }
    }, [productsList]);

    return (<div className='products-sales-container'>
        <div className='search'>
            <Search label={'Nombre del producto'} eventSearch={e => searchProduct(e)} />
        </div>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {shoppingCart.map((product, index) => createRowOfProduct(product, index))}
            </tbody>
        </table>
        <div className='total'>
            <h2 className='numeric'>{`Total: $ ${total}.00`}</h2>
        </div>
        <div className='payment-type'>
            <button className='secondary icon' onClick={() => setOpenChangeModal(true)} disabled={shoppingCart.length === 0} >
                Pago en efectivo
                <Image src={'/img/cash.png'} width={24} height={24} alt={'icon'}/>
            </button>
            <button className='secondary icon' onClick={() => payProducts(PAYMENT_TYPE.CARD)} disabled={shoppingCart.length === 0} >
                Pago con tarjeta
                <Image src={'/img/card.png'} width={24} height={24} alt={'icon'}/>
            </button>
        </div>
        {printTicket && <Action label={'Imprimir ticket de compra'} type={ACTION_TYPES.PRINT} action={() => handlePrint()} />}
        <Modal open={openModal} title={'Selecciona un producto'} onClose={() => setOpenModal(false)}>
            <ProductsList productsList={productsList} addProduct={e => addProduct(e)}/>
        </Modal>
        <div style={{display: 'none'}}>
            <div ref={componentTicketRef}>
                <SalesTicket productsList={productsTicket.list} total={productsTicket.total}/>
            </div>
        </div>
        <Modal open={openChangeModal} title={'Cantidad a pagar'} onClose={() => setOpenChangeModal(false)}>
            <ChangeModal total={total} onFinish={() => continuePayment()}/>
        </Modal>
    </div>);
};

export default ProductsSales;
