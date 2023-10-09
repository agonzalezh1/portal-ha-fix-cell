import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { formatText } from '../../utils/functions';
import { TEXT_CONFIG } from '../../utils/constants';

/**
 * Función que muestra el campo de texto
 * @param {string} id Identificador html para el input
 * @param {string} title Cadena que muestra una etiqueta arriba del campo
 * @param {string} placeholder Cadena que se presenta como texto de ayuda en el campo
 * @param {function} changeEvent Funcion que se detona cuando hay un cambio en el input
 * @param {bool} disabled Bandera que indica si el campo esta deshabilitado
 * @param {number} maxLength Longitux maxima de caracteres del campo del campo
 * @param {string} errors Cadena que contiene el mensaje de validación del campo
 * @param {string} valueIn Cadena que indica el valor que presenta el campo
 * @param {string} inputType Tipo de dato del campo
 * @param {bool} readOnly Bandera que indica si se puede realizar escritura en el campo
 * @param {object} control Objeto con la configuracion del formulario
 * @param {function} keyDownEvent Funcion que se detona cuando se presiona una tecla
 * @returns Controlador para el CampoTexto
 */
const InputText = ({ id, title, placeholder, changeEvent = null, disabled = false, maxLength,
    errors, valueIn, inputType, textFormat, readOnly = false, rules, control, keyDownEvent = null
}) => {

    const [text, setText] = useState(valueIn);

    let invalidStyle = '';
    const errorMessage = errors && errors.message ? errors.message : '';
    const isDisabled = disabled || readOnly;
    const heightStyle = title ? 'height-1' : 'height-2';

    if (disabled) {
        invalidStyle = 'disabled';
    }

    if (errorMessage) {
        invalidStyle = 'invalid';
    }

    useEffect(() => {
        setText(valueIn)
    },[valueIn]);

    return (
        <Controller
            name={id}
            control={control}
            rules={!isDisabled && rules ? rules : {}}
            defaultValue={valueIn}
            render={({ field: { onChange, value } }) => (
                <div className={`container-input-text ${heightStyle} ${invalidStyle}`}  >
                    {title !== '' &&
                        <span htmlFor={id} className='letter-1'>{title}</span>
                    }
                    <input
                        id={id}
                        type={inputType}
                        name={id}
                        value={text !== '' ? text : value}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        autoComplete='off'
                        disabled={disabled}
                        onChange={e => {
                            const newValue = formatText(e.target.value, textFormat);
                            setText('');
                            onChange(newValue);
                            if (changeEvent) {
                                changeEvent(newValue);
                            }
                        }}
                        onKeyDown={e => {
                            if(keyDownEvent) {
                                keyDownEvent(e.key);
                            }
                        }}
                    />
                </div>
            )}
        />
    );
};

InputText.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    changeEvent: PropTypes.func,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number.isRequired,
    errors: PropTypes.object,
    valueIn: PropTypes.string.isRequired,
    inputType: PropTypes.oneOf(['text', 'password']),
    textFormat: PropTypes.oneOf(Object.values(TEXT_CONFIG)),
    readOnly: PropTypes.bool,
    rules: PropTypes.object,
    control: PropTypes.object.isRequired,
    keyDownEvent: PropTypes.func,
};

export default InputText;
