import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { PRICES_TYPE, USER_TYPE } from '../../../utils/constants';
import RadioButton from '../../Controllers/RadioButton';

const ProductsList = ({ productsList, addProduct }) => {

    const currentStore = useSelector(state => state.stores.currentStore);
    const userType = useSelector(state => state.profile.profile);
    const { control } = useForm({ mode: 'onChange' });
    const [productSelected, setProductSelected] = useState(productsList[0]);
    const [priceType, setPriceType] = useState({ type: PRICES_TYPE.PUBLIC, price: productsList[0].publicPrice });
    const [count, setCount] = useState(1);

    const getStock = storesList => storesList.find(store => store.id === currentStore).count;

    const [currentStock, setCurrentStock] = useState(getStock(productsList[0].stores));

    const validateStock = value => {
        const newValue = count + value;

        if (newValue <= currentStock && newValue > 0) {
            setCount(count + value);
        }
    };

    const setProductAndPriceSelected = product => {

        const stockTemp = getStock(product.stores);
        if (stockTemp === 0) {
            return;
        }

        let price = 0;

        if (priceType.type === PRICES_TYPE.PUBLIC) {
            price = product.publicPrice;
        } else if (priceType.type === PRICES_TYPE.MID_WHOLE_SALE) {
            price = product.midWholesalePrice;
        } else {
            price = product.wholesalePrice;
        }
        setCurrentStock(stockTemp);
        setProductSelected(product);
        setPriceType({ price, type: priceType.type });
        setCount(1);
    };

    const returnProduct = () => {
        const amount = Number((count * priceType.price).toFixed(2));
        addProduct({ productSelected, count, amount });
    };

    const createRowOfProduct = product => {
        const stock = getStock(product.stores);

        return (
            <tr key={product.productName} onClick={() => setProductAndPriceSelected(product)}>
                <td className='check'>{ product.productName === productSelected.productName &&
                    <Image src={'/img/icons/check.png'} width={20} height={20} alt={'icon'}/>
                }</td>
                <td>{product.productName}</td>
                <td>{stock}</td>
            </tr>
        );
    };

    return (<div className='products-list-container'>
        <table>
            <thead>
                <tr>
                    <th/>
                    <th>Nombre</th>
                    <th>En stock</th>
                </tr>
            </thead>
            <tbody>
                {productsList.map(product => createRowOfProduct(product))}
            </tbody>
        </table>
        <div className='price-container'>
            <RadioButton
                id={`radio-button-${PRICES_TYPE.PUBLIC}`}
                label={`${PRICES_TYPE.PUBLIC}: $${productSelected.publicPrice}`}
                control={control}
                changeEvent={e => setPriceType({ type: e.name, price: e.value })}
                name={PRICES_TYPE.PUBLIC}
                state={priceType.type}
                value={productSelected.publicPrice}
            />
            {userType === USER_TYPE.ADMIN && <>
                <RadioButton
                    id={`radio-button-${PRICES_TYPE.MID_WHOLE_SALE}`}
                    label={`Medio mayoreo: $${productSelected.midWholesalePrice}`}
                    control={control}
                    changeEvent={e => setPriceType({ type: e.name, price: e.value })}
                    name={PRICES_TYPE.MID_WHOLE_SALE}
                    state={priceType.type
                    }
                    value={productSelected.midWholesalePrice}
                />
                <RadioButton
                    id={`radio-button-${PRICES_TYPE.WHOLE_SALE}`}
                    label={`Mayoreo: $${productSelected.wholesalePrice}`}
                    control={control}
                    changeEvent={e => setPriceType({ type: e.name, price: e.value })}
                    name={PRICES_TYPE.WHOLE_SALE}
                    state={priceType.type}
                    value={productSelected.wholesalePrice}
                />
            </>}
        </div>
        <div className='counter-container'>
            <p className='label bold'>Cantidad </p>
            <div onClick={() => validateStock(-1)}>
                <Image src={'/img/icons/minus.png'} width={20} height={20} alt={'icon'}/>
            </div>
            <div className='count'>{count}</div>
            <div onClick={() => validateStock(1)}>
                <Image src={'/img/icons/plus.png'} width={20} height={20} alt={'icon'}/>
            </div>
        </div>
        <button className='primary' onClick={() => returnProduct()}>Agregar al carrito</button>
    </div>
    );
};

export default ProductsList;
