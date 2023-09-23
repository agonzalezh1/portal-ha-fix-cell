import { useState } from 'react';
import Proptypes from 'prop-types';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import InputText from '../Controllers/InputText';
import { TEXT_CONFIG } from '../../utils/constants';

/**
 * Buscador de productos
 * Solo realiza busquedas si el input tiene algo
 * @param {string} label Leyenda que se muestra en el placeholder
 * @param {func} eventSearch Evento que se detona cuando se le da click en buscar
 */
const Search = ({ label, eventSearch }) => {

    const { control } = useForm({ mode: 'onChange' });
    const [ value, setValue] = useState('');

    return (
        <div className='search-container'>
            <InputText
                id={'search'}
                title={''}
                placeholder={label}
                maxLength={50}
                valueIn={value}
                textFormat={TEXT_CONFIG.ALPHANUM_WITH_SPACES}
                changeEvent={e => setValue(e)}
                control={control}
                keyDownEvent={e => {
                    if (e === 'Enter' && value) {
                        eventSearch(value);
                    }
                }}
            />
            <div className='icon' onClick={() => value && eventSearch(value)}>
                <div>
                    <Image src={'/img/icons/search.png'} width={32} height={32} alt={'search'} />
                </div>
            </div>
        </div>
    );
};

Search.propTypes = {
    label: Proptypes.string,
    eventSearch: Proptypes.func.isRequired,
};

export default Search;
