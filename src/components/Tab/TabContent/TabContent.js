import React from 'react';
import PropTypes from 'prop-types';

/**
 * Carga el componente asociado al TabItem
 * @param {number} id Identificador aosicado al componente
 * @param {number} activeTab Identificador del item seleccionado en el navbar
 * @param {object} children Componente a mostrar
 */
const TabContent = ({ id, activeTab, children }) => {

    return (
        activeTab === id ? <div className="tab-content">
            {children}
        </div>
            : null
    );
};

TabContent.propTypes = {
    id: PropTypes.number.isRequired,
    activeTab: PropTypes.number.isRequired,
    children: PropTypes.object.isRequired,
};

export default TabContent;
