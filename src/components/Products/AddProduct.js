import { useForm } from 'react-hook-form';
import { useStores } from '../../hooks/useStores';
import PropTypes from 'prop-types';
import InputText from '../Controllers/InputText';
import { TEXT_CONFIG, PRODUCT_TYPES, BRAND_TYPES } from '../../utils/constants';
import { createCatalog } from '../../utils/functions';
import { createProduct } from '../../utils/apiRequest/apiProducts';
import Picker from '../Controllers/Picker';

/**
 * Agrega un producto nuevo en la base de datos
 * @param {func} onFinish Funcion que se detona cuando el api que guarda la info responde
 */
const AddProduct = ({ onFinish }) => {
    const { handleSubmit, control, formState, formState: { errors } } = useForm({ mode: 'onChange' });
    const [stores] = useStores();
    const requiredField = { required: true };

    /**
     * Envia la informacion a la base de datos
     * La respuesta obtenida la responde por medio de la funcion que recibe el componente como parametro
     * Obtiene la lista de tiendas para que a cada una se le agregen la cantidad capturada en el formulario
     * Revisar api PUT /products
     * @param {object} form Datos del formulario
     */
    const sendForm = async form => {
        const storesArray = stores.map(store => {
            return {
                id: store._id,
                count: Number(form[store._id]),
            };
        });
        const newProduct = {
            productName: form.productName,
            brand: { name: BRAND_TYPES[form.brand], id: Number(form.brand) },
            productType: { name: PRODUCT_TYPES[form.productType], id: Number(form.productType) },
            wholesalePrice: Number(form.wholesalePrice),
            midWholesalePrice: Number(form.midWholesalePrice),
            publicPrice: Number(form.publicPrice),
            cost: Number(form.cost),
            stores: storesArray,
        };
        const apiResp = await createProduct(newProduct);
        onFinish(apiResp);
    };

    /**
     * Crea la lista de tiendas disponibles
     * @param {object} storeItem Objeto con la informacion de la tienda (id, nombe)
     * Revisar custom hook useStores
     */
    const createProductsOnStore = storeItem => {
        return (<div className='store'>
            <p>{storeItem.name}</p>
            <div className='count'>
                <InputText
                    id={storeItem._id}
                    placeholder={'0'}
                    maxLength={3}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
        </div>);
    };

    return (<>
        <form onSubmit={handleSubmit(sendForm)} className='add-product-container'>
            <div className='product-name'>
                <InputText
                    id={'productName'}
                    title={'Nombre del producto'}
                    placeholder={'Nombre del producto'}
                    maxLength={100}
                    errors={errors.productName}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.CAPITALIZE}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='picker'>
                <Picker
                    id={'brand'}
                    label={'Marca'}
                    options={createCatalog(BRAND_TYPES)}
                    control={control}
                    rules={requiredField}
                />
            </div>
            <div className='picker'>
                <Picker
                    id={'productType'}
                    label={'Tipo de producto'}
                    options={createCatalog(PRODUCT_TYPES)}
                    control={control}
                    rules={requiredField}
                />
            </div>
            <div className='price'>
                <InputText
                    id={'wholesalePrice'}
                    title={'Precio mayoreo'}
                    placeholder={'0000'}
                    maxLength={20}
                    errors={errors.wholeSalePrice}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='price'>
                <InputText
                    id={'midWholesalePrice'}
                    title={'Precio medio mayoreo'}
                    placeholder={'0000'}
                    maxLength={20}
                    errors={errors.midWholeSalePrice}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='price'>
                <InputText
                    id={'publicPrice'}
                    title={'Precio público'}
                    placeholder={'0000'}
                    maxLength={20}
                    errors={errors.publicPrice}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='price'>
                <InputText
                    id={'cost'}
                    title={'Costo'}
                    placeholder={'0000'}
                    maxLength={20}
                    errors={errors.cost}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <p className='text bold'>Agrega la cantidad de productos por tienda</p>
            {
                stores.map(store => createProductsOnStore(store))
            }
            <button className='primary' disabled={!formState.isValid}>Enviar</button>
        </form>
    </>);
};

AddProduct.propTypes = {
    onFinish: PropTypes.func.isRequired,
};

export default AddProduct;
