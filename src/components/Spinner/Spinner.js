import { useSelector } from 'react-redux';
import { PacmanLoader } from 'react-spinners';

/**
 * Componente que muestra el Spinner en la aplicacion
 */
const Spinner = () => {

    const spinner = useSelector(state => state.spinner);

    return (<>
        {spinner.loading &&
        <div className='spinner-container'>
            <PacmanLoader
                size={35}
                margin={2}
                color={'#fdff00'}
                loading={spinner.loading}
                speedMultiplier={1}
            />
            {spinner.text && <h3 className='loading-text'>{spinner.text}</h3>}
        </div>
        }
    </>);
};

export default Spinner;
