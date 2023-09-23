import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

/**
 * Controlador para el selector
 * @param {string} id Identificador para el controlador
 * @param {object} control Objeto que regresa el useForm
 * @param {func} changeEvent Funcion que se detona con el cambio de opciones
 * @param {array} options Lista de opciones [{value, text}]
 * @param {object} rules Objeto con las reglas del campo. Revisar doc useForm
 * @param {string} label Leyenda superior del selector
 * @param {string} defaultValue Opcion defauilt inicial
 * @param {bool} disabled Bandera que deshabilita/habilita el selector
 */
const Picker = ({ id, control, changeEvent = null, options = [], rules, label, defaultValue, disabled = false }) => {

    /**
     * Crea la opciones para el selector
     * Los valores son obtenidos del parametro options [{value, text}]
     * @param {*} item [{value, text}]
     * @param {*} index Indice de la iteracion, se usa para el key del option
     */
    const createOption = (item, index) => <option key={`picker-${index}`}value={item.value} selected={defaultValue === item.value}>{item.text}</option>;

    return (
        <div>
            <Controller
                name={id}
                control={control}
                rules={rules ? rules : {}}
                render={({
                    field: { onChange }
                }) => (
                    <div className={'picker-container'} >
                        <p className='letter-1'>{label}</p>
                        <select id={id} disabled={disabled} onChange={e => {
                            onChange(e);
                            if (changeEvent) {
                                changeEvent(e.target.value);
                            }
                        }}>
                            <option value='' defaultValue={''} hidden>-</option>
                            {options.map((option, index) => createOption(option, index))}
                        </select>
                    </div>
                )
                }
            />
        </div>
    );
};

Picker.propTypes = {
    id: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    changeEvent: PropTypes.func,
    options: PropTypes.array,
    rules: PropTypes.object,
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Picker;
