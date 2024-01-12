import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { ACTION_TYPES } from '../../utils/constants';

const Action = ({label = null, type, action}) => {

    const getIcon = () => {
        switch (type) {
            case ACTION_TYPES.INCREASE:
                return '/img/icons/increase.png';
            case ACTION_TYPES.DECREASE:
                return '/img/icons/decrease.png';
            case ACTION_TYPES.DELETE:
                return '/img/icons/delete.png';
            case ACTION_TYPES.SAVE:
                return '/img/icons/save.png';
            case ACTION_TYPES.PRINT:
                return '/img/icons/print.png';
            default:
                return '/img/icons/seacrh.png';
        }
    };

    return (<div className='action-container' onClick={action}>
        {label &&
            <div className='label'><p>{label}</p></div>}
            <div className='icon'>
                <Image src={getIcon()} width={32} height={32} alt={'icon'}/>
            </div>
    </div>);
};

Action.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf([ACTION_TYPES.INCREASE, ACTION_TYPES.DECREASE, ACTION_TYPES.DELETE,
        ACTION_TYPES.SAVE, ACTION_TYPES.SEARCH]).isRequired,
    action: PropTypes.func.isRequired,
};

export default Action;
