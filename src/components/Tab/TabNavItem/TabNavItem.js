import PropTypes from 'prop-types';
import Image from 'next/image';

/**
 * Renderiza una opcion del Tab
 * @param {number} id Identificador del Tab Item
 * @param {string} title Titulo que se muestra en el TabItem
 * @param {func} setActiveTab  Funcion que actualiza el identificador cuando se selecciona el TabItem
 * @param {string} icon Ruta del icono
 */
const TabNavItem = ({ id, title, setActiveTab, icon }) => {

    /**
     * Actualiza el identificador cuando se le da clic el item
     */
    const handleClick = () => {
        setActiveTab(id);
    };

    return (
        <div onClick={handleClick} className='item-nav'>
            {icon?.length > 0 && <Image src={icon} width={40} height={40} alt={'icon'}/>}
            <p>{title}</p>
        </div>
    );
};

TabNavItem.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    icon: PropTypes.string
};

export default TabNavItem;
