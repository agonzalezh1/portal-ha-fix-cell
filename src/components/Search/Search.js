import { useState } from 'react';
import Proptypes from 'prop-types';
import Image from 'next/image';

/**
 * Buscador de productos
 * Solo realiza busquedas si el input tiene algo
 * @param {string} label Leyenda que se muestra en el placeholder
 * @param {func} eventSearch Evento que se detona cuando se le da click en buscar
 */
const Search = ({ label, eventSearch }) => {

    const [ value, setValue ] = useState('');

    /**
     * Funcion que se detona cuando se quiere detonar la funcion de busqueda
     * @param {string} e Valor de la busqueda 
     */
    const execEventSearch = e => {
        eventSearch(e);
        setValue('');
    };

    return (
        <div className='search-container'>
            <div className={`container-input-text`}  >
                <input
                    id={'search'}
                    name={'search'}
                    value={value}
                    placeholder={label}
                    maxLength={50}
                    autoComplete='off'
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && value) {
                            execEventSearch(value);
                        }
                    }}
                />
            </div>
            <div className='icon' onClick={() => value && execEventSearch(value)}>
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
