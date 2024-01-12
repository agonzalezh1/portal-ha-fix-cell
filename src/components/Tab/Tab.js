import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PropTypes from 'prop-types';
import Stores from '../Stores/Stores';
import Products from '../Products/Products';
import Sales from '../Sales/Sales';
import Users from '../Users/Users';
import Fixes from '../Fixes/Fixes';
import Tools from '../Tools/Tools';
import TabNavItem from './TabNavItem/TabNavItem';
import TabContent from './TabContent/TabContent';
import Footer from '../Footer/Footer';
import { SERVICE_TYPE } from '../../utils/constants';

/**
 * Muestra las opciones diponibles por usuario
 * Los valores son obtenidos por el login
 * @param {array} items Permisos del usuario
 */
const Tab = ({ items }) => {
    const [activeTab, setActiveTab] = useState(items[0]);
    const history = useRouter();

    /**
     * Obtiene la leyenda que se debe de mostrar en el Item
     * La leyenda la obtiene del catalogo SERVICE_TYPE
     * @param {*} idService Identificador del servicio que regresa el login
     */
    const getTitle = idService => SERVICE_TYPE[`${idService}`].name;

    /**
     * Obtiene el icono que se debe de mostrar en el Item
     * El icono lo obtiene del catalogo SERVICE_TYPE
     * @param {*} idService Identificador del servicio que regresa el login
     */
    const getIcon = idService => SERVICE_TYPE[`${idService}`].icon;

    return (
        <div className='tab-container'>
            <div className='nav'>
                <div className='logo' onClick={() => history.push('/')}>
                    <Image src={'/img/logo.svg'} width={150} height={50} alt={'logo'}/>
                </div>
                {items.map(item => <TabNavItem
                    key={`tabnav-${item}`}
                    title={getTitle(item)}
                    id={item}
                    setActiveTab={setActiveTab}
                    icon={getIcon(item)}
                />)}
            </div>
            <div className='outlet'>
                <TabContent id={1} activeTab={activeTab}>
                    <Products />
                </TabContent>
                <TabContent id={2} activeTab={activeTab}>
                    <Stores />
                </TabContent>
                <TabContent id={3} activeTab={activeTab}>
                    <Sales />
                </TabContent>
                <TabContent id={4} activeTab={activeTab}>
                    <Users />
                </TabContent>
                <TabContent id={5} activeTab={activeTab}>
                    <Fixes />
                </TabContent>
                <TabContent id={6} activeTab={activeTab}>
                    <Tools />
                </TabContent>
            </div>
            <div className='footer'>
                <Footer />
            </div>
        </div>
    );
};

Tab.propTypes = {
    items: PropTypes.array.isRequired,
};

export default Tab;
