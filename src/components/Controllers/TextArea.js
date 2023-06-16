import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

/**
 * Funcion que sirve como controlador del Area de texto
 * @param {string} label Leyenda superior al area de textomensaje a mostrar dentro del area antes de comenzar a escribir
 * @param {function} changeEvent evento que se detona cuando se escribe algo en el area.
 * @param {string} id identificador para el elemento HTML
 * @param {object} rules objeto con las configuraciones de las validaciones del formulario
 * @param {object} control objeto que contiene los metodos para registrar el componente al formulario
 */
const TextArea = ({ id, rules, changeEvent = null, control, label }) => {

    return (
        <Controller
            name={id}
            control={control}
            rules={rules ? rules : {}}
            render={({ field: { onChange } }) => (
                <div className='textarea-container'>
                    {label && <p>{label}</p>}
                    <textarea
                        key={id}
                        onChange={e => {
                            onChange(e.target.value);
                            if (changeEvent) {
                                changeEvent(e.target.value);
                            }
                        }}
                    />
                </div>
            )}
        />
    );
};

TextArea.propTypes = {
    id: PropTypes.string.isRequired,
    rules: PropTypes.object,
    changeEvent: PropTypes.func,
    control: PropTypes.object.isRequired,
    label: PropTypes.string,
};

export default TextArea;
