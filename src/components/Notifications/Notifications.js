import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NOTIFICATION_TYPES } from '../../utils/constants';
import { hiddenNotification } from '../../storage/notificationSlice';
import classNames from 'classnames';

/**
 * Componente que muestra la respuesta de un evento en el sistema
 */
const Notifications = () => {

    const notification = useSelector(state => state.notification);
    const dispatch = useDispatch();

    /**
     * Cambia el estido de la notificación de acuerto a lo que se guarde en el store
     * Controla el mostrar / ocultar por estilos
     */
    const notificationClassName = classNames({
        success: notification.type === NOTIFICATION_TYPES.SUCCESS ? true : false,
        error: notification.type === NOTIFICATION_TYPES.ERROR ? true : false,
        hidden: !notification.showNotification,
    });

    /**
     * Detiona la notificación cuando hay un cambio en el store
     * Despues 5 seg de mostrar la notificacion, cambia el estado para que se oculte
     */
    useEffect(() => {
        if (notification.showNotification) {
            setTimeout(() => {
                dispatch(hiddenNotification());
            }, 5000);
        }
    }, [notification]);

    return (<div className={`notifications-container ${notificationClassName}`}>
        <p className='letter-1'>{notification.text}</p>
    </div>);
};

export default Notifications;
