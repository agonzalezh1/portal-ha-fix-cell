import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStores } from '../utils/apiRequest/apiStores';
import { addStores } from '../storage/storesSlice';

/**
 * Custom hook para el manejo de las tiendas
 * Hace una primer consulta de la informacion de las tiendas y la mantiene en el store
 * De ser necesario, actualiza la informacion por medio de una funcion
 * @returns {array} Listado de tiendas | funcion que actualiza las tiendas
 */
export const useStores = () => {

    const stores = useSelector(state => state.stores);
    const dispatch = useDispatch();

    /**
     * Carga por primera vez la informacion de las tiendas en el store
     */
    useEffect(() => {
        const fetchDatos = async () => {
            if (!stores.stores.length) {
                const apiResp = await getStores();
                if (apiResp.code === 0) {
                    dispatch(addStores(apiResp.response.stores));
                }
            }
        };
        fetchDatos();
    }, []);

    /**
     * Realiza la consulta de la informacion de las tiendas
     * Si la consulta fue exitosa, actualiza, si no mantiene la que ya estaba cargada
     * Revisar GET /stores
     */
    const udpateStores = async() => {
        const apiResp = await getStores();
        if (apiResp.code === 0) {
            dispatch(addStores(apiResp.response.stores));
        }
    };

    return [ stores.stores, udpateStores ];
};
