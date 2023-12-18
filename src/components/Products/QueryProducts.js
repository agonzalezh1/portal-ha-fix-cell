import { useStores } from '../../hooks/useStores';
import { BRAND_TYPES, PRODUCT_TYPES } from '../../utils/constants';

const QueryProducts = ({ product }) => {

    const [stores] = useStores();

    const createTableStores = storesList => {
           return (<>
            {storesList.map(store => {
                return (<div key={store.id} className='store'>
                    <p>{stores.find(storeTmp => storeTmp._id === store.id).name}:</p>
                    <div className='bold count'>
                        <p>{store.count}</p>
                    </div>
                </div>);
            })}
        </>);
    };

    return (<div className='product-table'>
        <div className='product-name bold'>
            <h3>{product.productName}</h3>
        </div>
        <div className='productType-brand'>
            <div className='item'>
                <p>Id: <span className='bold'>{product.idProduct}</span></p>
            </div>
            <div className='item'>
                <p>Marca: <span className='bold'>{BRAND_TYPES[product.brand]}</span></p>
            </div>
            <div className='item'>
                <p>Tipo: <span className='bold'>{PRODUCT_TYPES[product.productType]}</span></p>
            </div>
        </div>
        <div className='prices-container'>
            <div className='price'>
                <p>Precio mayoreo: <span className='bold'>${product.wholesalePrice}.00</span></p>
            </div>
            <div className='price'>
                <p>Precio medio mayoreo: <span className='bold'>${product.midWholesalePrice}.00</span></p>
            </div>
            <div className='price'>
                <p>Precio público: <span className='bold'>${product.publicPrice}.00</span></p>
            </div>
        </div>
        <div>{createTableStores(product.stores)}</div>
    </div>);
};

export default QueryProducts;
