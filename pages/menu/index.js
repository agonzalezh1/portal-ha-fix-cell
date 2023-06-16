import { useSelector } from 'react-redux';
import { useStores } from '../../src/hooks/useStores';
import Tab from '../../src/components/Tab/Tab';

/**
 * Pagina con el menu principal
 * Carga el componente Tab con los permisos obtenidos del login
 */
const Menu = () => {

    /**
     * Obtiene los permisos para mostrarlos en el Tab
     */
    const grants = useSelector(state => state.profile.grants);

    /**
     * Carga la info de las sucursales en un custom hook
     */
    const [] = useStores();

    return (<>
        <div>
            <Tab items={grants} />
        </div>
    </>);
};

export default Menu;
