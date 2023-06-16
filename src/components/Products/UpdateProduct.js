import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStores } from '../../hooks/useStores';
import { useNotification } from '../../hooks/useNotification';
import PropTypes from 'prop-types';
import { ACTION_TYPES, BRAND_TYPES, PRODUCT_TYPES, TEXT_CONFIG } from '../../utils/constants';
import { updateProduct } from '../../utils/apiRequest/apiProducts';
import InputText from '../Controllers/InputText';
import Action from '../Controllers/Action';

/**
 * Componente que muestra la informacion de un producto para que pueda ser actualizado
 * @param {object} product Informacion delproducto. Revisar modelo Products
 */
const UpdateProduct = ({ product }) => {

    const { handleSubmit, control, formState, formState: { errors } } = useForm({ mode: 'onChange' });
    const [stores] = useStores();
    const [setNotification] = useNotification();
    const [hiddenContent, setHiddenContent] = useState(true);
    const requiredField = { required: true };

    /**
     * Crea la lista de productos por tienda
     * Busca en el catalogo de las tiendas el id para obtener el numbre
     * @param {array} storesList Objeto con el id de la tienda y la cantidad disponible
     */
    const createTableStores = storesList => {
        return (<>
            {storesList.map(store => {
                return (<div key={store.id} className='store'>
                    <p>{stores.find(storeTmp => storeTmp._id === store.id).name}</p>
                    <div className='count'>
                        <InputText
                            id={store.id}
                            placeholder={'0'}
                            maxLength={3}
                            valueIn={store.count}
                            textFormat={TEXT_CONFIG.NUMBER}
                            control={control}
                            rules={requiredField}
                        />
                    </div>
                </div>);
            })}
        </>);
    };

    /**
     * Envia la informacion al api de actualizacion de informacion
     * Crea un arreglo de las tiendas ({id, count})
     * Por cada tienda en el catalogo obtiene el identificador y con ese mismo dato busca en el form el valor (cantidad)
     * para asignarla a count
     * El resultado de la actualizacion la muestra en la notificacion
     * @param {*} form Datos del formulario
     */
    const updateForm = async form => {
        const storesArray = stores.map(store => {
            return {
                id: store._id,
                count: Number(form[store._id]),
            };
        });
        const newProduct = {
            id: product.id,
            wholesalePrice: Number(form.wholesalePrice),
            midWholesalePrice: Number(form.midWholesalePrice),
            publicPrice: Number(form.publicPrice),
            cost: Number(form.cost),
            stores: storesArray,
        };
        const apiResp = await updateProduct(newProduct);
        setNotification(apiResp);
    };

    return (<form className='product-table' onSubmit={handleSubmit(updateForm)}>
        <div className='product-name bold' onClick={() => setHiddenContent(!hiddenContent)}>
            <h3>{product.productName}</h3>
            {formState.isValid &&
                <Action type={ACTION_TYPES.SAVE} action={handleSubmit(updateForm)} />
            }
        </div>
        {!hiddenContent && <>
            <div className='productType-brand'>
                <div className='item'>
                    <p>Marca: </p>
                    <p className='bold'>{BRAND_TYPES[product.brand]}</p>
                </div>
                <div className='item'>
                    <p>Tipo: </p>
                    <p className='bold'>{PRODUCT_TYPES[product.productType]}</p>
                </div>
            </div>
            <div className='prices-container'>
                <div className='price'>
                    <InputText
                        id={'wholesalePrice'}
                        title={'Precio mayoreo'}
                        placeholder={'00000.00'}
                        maxLength={10}
                        errors={errors.wholeSalePrice}
                        valueIn={product.wholesalePrice}
                        textFormat={TEXT_CONFIG.NUMBER}
                        rules={requiredField}
                        control={control}
                    />
                </div>
                <div className='price'>
                    <InputText
                        id={'midWholesalePrice'}
                        title={'Precio medio mayoreo'}
                        placeholder={'00000.00'}
                        maxLength={10}
                        errors={errors.midWholeSalePrice}
                        valueIn={product.midWholesalePrice}
                        textFormat={TEXT_CONFIG.NUMBER}
                        rules={requiredField}
                        control={control}
                    />
                </div>
                <div className='price'>
                    <InputText
                        id={'publicPrice'}
                        title={'Precio público'}
                        placeholder={'00000.00'}
                        maxLength={10}
                        errors={errors.publicPrice}
                        valueIn={product.publicPrice}
                        textFormat={TEXT_CONFIG.NUMBER}
                        rules={requiredField}
                        control={control}
                    />
                </div>
                <div className='price'>
                    <InputText
                        id={'cost'}
                        title={'Costo'}
                        placeholder={'00000.00'}
                        maxLength={10}
                        errors={errors.cost}
                        valueIn={product.cost}
                        textFormat={TEXT_CONFIG.NUMBER}
                        rules={requiredField}
                        control={control}
                    />
                </div>
            </div>
            <div>{createTableStores(product.stores)}</div>
        </>}
    </form>);
};

UpdateProduct.propTypes = {
    product: PropTypes.object.isRequired,
};

export default UpdateProduct;
