import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalView from 'react-modal';
import PropTypes from 'prop-types';

const customStyles = {
    overlay: {
        backgroundColor: '#000F0880',
        display: 'flex',
        alignContent: 'center',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        margin: 'auto',
        padding: '1rem',
        transform: 'translate(-50%, -50%)',
    },
};

/**
 * Modal generico para la aplicación
 * @param {bool} open Estado del modal, true -> se muestra | false -> se oculta
 * @param {string} title Cadena que se muestra en la parte superior del modal
 * @param {func} onClose Funcion que se detona cuando se le da click en cerrar
 * @param {object} children Componente que cargará el modal
 */
const Modal = ({ open, title, onClose, children }) => {
    const [isOpen, setIsOpen] = useState();

    /**
     * Funcion que se detona cuando se le da click en cerrar
     * Cambia el estado de open a false
     */
    const closeModal = () => {
        onClose();
        setIsOpen(false);
    };

    /**
     * Abre o cierra el modal
     */
    useEffect(() => setIsOpen(open), [open]);

    return (
        <ModalView isOpen={isOpen} style={customStyles} contentLabel={title} ariaHideApp={false}>
            <div className='modal-container'>
                <h3>{title}</h3>
                <div onClick={closeModal}>
                    <Image src={'/img/icons/close.png'} width={16} height={16} alt={'close'} style={{cursor: 'pointer'}}/>
                </div>
            </div>
            <div className='modal-content'>{children}</div>
        </ModalView>
    );
};

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
};

export default Modal;
