import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import InputText from '../Controllers/InputText';
import Checkbox from '../Controllers/Checkbox';
import Picker from '../Controllers/Picker';
import { useStores } from '../../hooks/useStores';
import { createUser } from '../../utils/apiRequest/apiUsers';
import { getGrantsList } from '../../utils/functions';
import { TEXT_CONFIG } from '../../utils/constants';

/**
 * Agrega un suario en la base de datos
 * @param {func} onFinish Funcion que se detona cuando el api que guarda la info responde
 * Sirve para notificar que el componente ya terminó su función
 */
const AddUser = ({ onFinish }) => {
    const { handleSubmit, control, formState, formState: { errors } } = useForm({ mode: 'onChange' });
    const requiredField = { required: true };
    const [grants, setGrants] = useState(getGrantsList());
    const [storesList, setStoresList] = useState([]);
    const [stores] = useStores();

    /**
     * Envía la informacion del formulario al api que guarda los usuarios
     * Sin importar el tipo de respuesta del api, detona el evento onFinish
     * @param {object} form Datos del formulario
     */
    const sendForm = async form => {
        const data = {
            username: form.user,
            name: form.name,
            password: form.pass,
            store: form.stores,
            grants: grants.filter(grant => grant.checked).map(grant => Number(grant.key)),
            profile: 2,
        };

        const apiResponse = await createUser(data);
        onFinish(apiResponse);
    };

    /**
     * Actualiza en un arreglo temporal los permisos seleccionados
     * El arreglo sirve para asociar los checks con los permisos disponibles
     * @param {*} e Evento que regresa el cambio del check {key, checked}
     *              Key -> identificador del permiso (revisar GRANT_TYPES)
     *              Checked -> bandera que indica si esta seleccionado o no
     */
    const checkGrant = e => {
        const grantsTemp = [...grants];
        grantsTemp.forEach(grant => {
            if (e.value === grant.key) {
                grant.checked = e.checked;
            }
        });
        setGrants(grantsTemp);
    };

    /**
     * Crea la lista de permisos disponibles
     * @param {object} item Objeto relacionado al permiso
     */
    const createCheckboxItem = item => {
        return (
            <Checkbox
                key={`check-${item.value}`}
                id={`check-${item.value}`}
                control={control}
                changeEvent={e => checkGrant(e)}
                label={item.value}
                isChecked={item.checked}
                value={item.key}
            />
        );
    };

    /**
     * Obtiene la lista de tiendas disponibles en la base de datos
     * Crea el arreglo para que el componente Picker pueda mostrar la información
     */
    useEffect(() => {
        const storesTemp = stores.map(store => {
            return {
                value: store._id,
                text: store.name,
            };
        });
        setStoresList(storesTemp);
    }, [stores]);

    return (<div>
        <form onSubmit={handleSubmit(sendForm)} className='add-user-container'>
            <div className='user'>
                <InputText
                    id={'user'}
                    title={'Usuario'}
                    placeholder={'usuario001'}
                    maxLength={20}
                    errors={errors.user}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.ALPHANUM_WITHOUT_SPACES}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='user'>
                <InputText
                    id={'pass'}
                    title={'Contraseña'}
                    placeholder={'usuario001'}
                    maxLength={20}
                    errors={errors.password}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.ALPHANUM_WITHOUT_SPACES}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='name'>
                <InputText
                    id={'name'}
                    title={'Nombre'}
                    placeholder={'Nombre'}
                    maxLength={50}
                    errors={errors.name}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.CAPITALIZE}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='name'>
            <Picker
                id={'stores'}
                label={'Tiendas'}
                options={storesList}
                control={control}
                rules={requiredField}
            />
            </div>
            {
                grants.map(grant => createCheckboxItem(grant))
            }
            <button className='primary' disabled={!formState.isValid}>Guardar</button>
        </form>
    </div>);
};

AddUser.propTypes = {
    onFinish: PropTypes.func.isRequired,
};

export default AddUser;
