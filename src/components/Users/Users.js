import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Action from '../Controllers/Action';
import Modal from '../Modal/Modal';
import AddUser from './AddUser';
import Picker from '../Controllers/Picker';
import Checkbox from '../Controllers/Checkbox';
import Attendance from './Attendance';
import { ACTION_TYPES, GRANT_TYPES } from '../../utils/constants';
import { getListFromObject } from '../../utils/functions';
import { useNotification } from '../../hooks/useNotification';
import { useStores } from '../../hooks/useStores';
import { getUsers, modifyUser } from '../../utils/apiRequest/apiUsers';

/**
 * Componente que administra a los usuarios del sistema
 * Agrega un usuario por medio de un modal
 * Modifica los permisos y la sucursal asociada a los usuarios
 */
const Users = () => {
    const { control } = useForm({ mode: 'onChange' });
    const [setNotification] = useNotification();
    const [stores] = useStores();
    const [storesList, setStoresList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [usersListPicker, setUsersListPicker] = useState([]);
    const [grants, setGrants] = useState([]);
    const [currentStore, setCurrentStore] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [attendance, setAttendance] = useState([]);

    /**
     * Valida la respuesta de guardado
     * Muestra una notificacion con el resultado
     * Si la repsuesta es de exito, actualiza la lista de usuarios disponibles
     * @param {object} result Respuesta del api. Revisar endpoint PUT /users
     */
    const validateIsCreated = result => {
        setOpenModal(false);
        setNotification(result);
        if (result.code === 0) {
            getUsers().then(list => {
                setUsersList(list);
            });
        }
    };

    /**
     * Crea el check de un permiso
     * Se le asocia el evento que actualiza la lista de persimos seleccionados
     * @param {object} item Objeto con los valores del permiso. Revisar GRANT_TYPES
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
     * Actualiza la lista de permisos de un usuario
     * @param {object} e Evento detonado cuando se selecciona un check
     * Recibe el identificador del permiso y la bandera de seleccionado
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
     * Obtiene los permisos de un usuario cuando cambia el Picker de usuarios
     * Se filtran los permisos seleccionados con true y se asignan al hook de control grants
     * Se modifica el picker de tiendas mostrando la tienda del usuario
     * @param {string} username Nombre del usuario seleccionado en el Picker
     */
    const setGrantsInContent = username => {
        const userTemp = usersList.find(user => user.username === username);
        const grantsList = getListFromObject(GRANT_TYPES);

        userTemp.grants.forEach(grant => {
            grantsList[grant - 1].checked = true;
        });
        setGrants(grantsList);
        setCurrentStore(userTemp.store);
        setCurrentUser(userTemp.username);
        setAttendance(userTemp.attendance);
    };

    /**
     * Se invoca el api que modifica los permisos del usuario
     * Solo se envian los permisos seleccionados en true
     * Revisar el api PUT /users
     * El resultado se muestra en una notificacion
     */
    const saveNewInfoUser = async () => {
        const grantsTemp = grants.filter(grant => grant.checked).map(grant => Number(grant.key));
        const apiResp = await modifyUser({ grants: grantsTemp, username: currentUser, store: currentStore });
        setNotification(apiResp);
    };

    /**
     * En la primer carga se obtiene la lista de usuarios
     * Revisar api GET /users
     */
    useEffect(() => {
        getUsers().then(list => {
            setUsersList(list);
        });
    }, []);

    /**
     * Obtiene la lista de tiendas
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

    /**
     * Se actualiza la lista de usuarios cuando se agrega uno nuevo
     */
    useEffect(() => {
        if (usersList.length) {
            const listTemp = usersList.map(user => {
                return { value: user.username, text: user.name };
            });
            setUsersListPicker(listTemp);
        }
    }, [usersList]);

    return (<div className='users-admin-container'>
        <h1>Usuarios</h1>
        <div className='users-search-container'>
            <Picker
                id={'stores'}
                label={'Lista de usuarios'}
                options={usersListPicker}
                control={control}
                changeEvent={e => setGrantsInContent(e)}
            />
            <Action label={'Agregar un usuario'} type={ACTION_TYPES.INCREASE} action={() => setOpenModal(true)} />
        </div>
        <h3>Asistecia de la semana</h3>
        <Attendance attendanceList={attendance}/>
        <h3>Selecciona la tienda y los permisos asociados al usuario</h3>
        <div className='grants-container'>
        {grants.length > 0 &&
            <>
                <div className='user-picker'>
                    <Picker
                        id={'stores'}
                        label={'Tiendas'}
                        options={storesList}
                        control={control}
                        defaultValue={currentStore}
                        changeEvent={e => setCurrentStore(e)}
                    />
                </div>
                <p>Permisos</p>
                <div className='permission-container'>
                    {grants.map(grant => createCheckboxItem(grant))}
                </div>
                <div className=''>
                    <Action label={''} type={ACTION_TYPES.SAVE} action={() => saveNewInfoUser()} />
                </div>
                
            </>
        }
        </div>
        <Modal open={openModal} title={'Agregar nuevo usuario'} onClose={() => setOpenModal(false)}>
            <AddUser onFinish={e => validateIsCreated(e)} />
        </Modal>
    </div>);
};

export default Users;
