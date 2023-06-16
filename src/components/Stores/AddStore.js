import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import InputText from '../Controllers/InputText';
import { TEXT_CONFIG } from '../../utils/constants';
import { createStore } from '../../utils/apiRequest/apiStores';

/**
 * Agrega una tienda en la base de datos
 * @param {func} onFinish Funcion que se detona cuando el api que guarda la info responde
 */
const AddStore = ({ onFinish }) => {

    const { handleSubmit, control, formState, formState: { errors } } = useForm({ mode: 'onChange' });

    /**
     * Invoca el api que crea una sucursal
     * Revisar endpoint PUT /stores
     * Cuando responde el api, detona la funcion onFinish con la respuesta
     * @param {object} form Objeto con los valores del formulario
     */
    const addStore = async form => {
        const apiResp = await createStore(form.store);
        onFinish(apiResp);
    };

    return (
        <form onSubmit={handleSubmit(addStore)} className='add-store-container'>
            <InputText
                id={'store'}
                title={'Nueva tienda'}
                placeholder={'Introduce el nombre de la tienda'}
                maxLength={30}
                errors={errors.store}
                valueIn={''}
                textFormat={TEXT_CONFIG.CAPITALIZE}
                control={control}
            />
            <br />
            <button className='primary' disabled={!formState.isValid}>Guardar</button>
        </form>
    );
};

AddStore.propTypes = {
    onFinish: PropTypes.func.isRequired,
};

export default AddStore;
