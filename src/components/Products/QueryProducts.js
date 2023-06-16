import { useStores } from '../../hooks/useStores';
import { BRAND_TYPES, PRODUCT_TYPES } from '../../utils/constants';

const QueryProducts = ({ product }) => {

    const [stores] = useStores();

    const createTableStores = storesList => {
           return (<>
            {storesList.map(store => {
                return (<div key={store.id} className='store'>
                    <p>{stores.find(storeTmp => storeTmp._id === store.id).name}</p>
                    <div className='count'>
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
            <p>{`Marca: ${BRAND_TYPES[product.brand]}`}</p>
            <p>{`Tipo: ${PRODUCT_TYPES[product.productType]}`}</p>
        </div>
        <div className='prices-container'>
            <div className='price'>
                <p>{`Precio mayoreo: ${product.wholesalePrice}`}</p>
            </div>
            <div className='price'>
                <p>{`Precio medio mayoreo: ${product.midWholesalePrice}`}</p>
            </div>
            <div className='price'>
                <p>{`Precio público: ${product.publicPrice}`}</p>
            </div>
        </div>
        <div>{createTableStores(product.stores)}</div>
    </div>);
};

export default QueryProducts;
