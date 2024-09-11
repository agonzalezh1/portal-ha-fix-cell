import React, { useState } from 'react';
import Action from '../Controllers/Action';
import Search from '../Search/Search';
import Modal from '../Modal/Modal';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import QueryProducts from './QueryProducts';
import { useSelector } from 'react-redux';
import { getProductByName } from '../../utils/apiRequest/apiProducts';
import { useNotification } from '../../hooks/useNotification';
import { useSpinner } from '../../hooks/useSpinner';
import { ACTION_TYPES, USER_TYPE } from '../../utils/constants';

/**
 * Muestra el inventario de las tiendas
 * Si tiene perfil "Vendedor", se muestra la consulta de los productos
 * Si tiene perfil "Administrador", se muestra la consulta y ademas se pueden
 * modificar los valores de los productos
 * Contiene el componente de busqueda (para busqueda de productos)
 * Contiene el componente Agregar producto, este se muestre con un modal
 */
const Products = () => {

    const [openModal, setOpenModal] = useState(false);
    const [setNotification] = useNotification();
    const [loadingSpinner] = useSpinner();
    const userType = useSelector(state => state.profile.profile);
    const [productsList, setProductsList] = useState([]);

    /**
     * Se obtiene la respuesta del api
     * Se cierra el modal y se muestra una notificacion con el resultado
     * @param {object} result Respuesta del api PUT /products
     */
    const validateIsCreated = result => {
        setOpenModal(false);
        setNotification(result);
    };

    /**
     * Realiza la peticion de la busqueda de productos
     * Revisar api GET /products
     * Si la respuesta es correcta, actualiza el estado productsList que es la lista de productos
     * que se muestra en el modal (resultado de la busqueda)
     * @param {string} idProduct Cadena para realizar la busqueda por coincidencias
     */
    const searchProduct = async idProduct => {
        loadingSpinner(true, 'Buscando productos...');
        const apiResp = await getProductByName(idProduct);
        loadingSpinner(false, '');
        if (apiResp.code === 0) {
            setProductsList(apiResp.response);
        } else {
            setNotification(apiResp);
        }
    };

    return (<div className='products-admin-container'>
        <h1>Inventario</h1>
        <div className='search-create-product-container'>
            <Search label={'Nombre del producto'} eventSearch={e => searchProduct(e)} />
            {(userType === USER_TYPE.ADMIN || userType === USER_TYPE.SUPERVISOR) &&
                <Action label={'Agregar un producto'} type={ACTION_TYPES.INCREASE} action={() => setOpenModal(true)} />
            }
        </div>
        <div className='table'>
        {(userType === USER_TYPE.ADMIN || userType === USER_TYPE.SUPERVISOR) &&
            productsList.map(product => <UpdateProduct key={product.id} product={product} />)
        }
        {userType === USER_TYPE.SELLER &&
            productsList.map(product => <QueryProducts key={product.id} product={product} />)
        }
        </div>
        <Modal open={openModal} title={'Agregar nuevo producto'} onClose={() => setOpenModal(false)}>
            <AddProduct onFinish={e => validateIsCreated(e)} />
        </Modal>
    </div>);
};

export default Products;
