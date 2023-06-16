import { useDispatch } from 'react-redux';
import { showNotification } from '../storage/notificationSlice';
import { NOTIFICATION_TYPES } from '../utils/constants';

export const useNotification = () => {
    const dispatch = useDispatch();

    const setNotification = httpResponse => {
        const { code, message } = httpResponse;
        if (code === 0) {
            dispatch(showNotification({ text: message, type: NOTIFICATION_TYPES.SUCCESS }));
        } else {
            dispatch(showNotification({ text: message, type: NOTIFICATION_TYPES.ERROR }));
        }
    };

    return [ setNotification ];
};
