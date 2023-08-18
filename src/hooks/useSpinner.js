import { useDispatch } from 'react-redux';
import { loadSpinner } from '../storage/spinnerSlice';

export const useSpinner = () => {

    const dispatch = useDispatch();

    const loadingSpinner = (loading, text) => {
        dispatch(loadSpinner({ loading, text }));
    };

    return [ loadingSpinner ];
};
