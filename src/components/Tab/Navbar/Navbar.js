import { useState, useEffect } from "react";
import Image from 'next/image';
import TabNavItem from '../TabNavItem/TabNavItem';
import { SERVICE_TYPE } from '../../../utils/constants';

const NavBar = ({ openMenu, onCloseMenu, items, setActiveTab }) => {

    /**
     * Obtiene la leyenda que se debe de mostrar en el Item
     * La leyenda la obtiene del catalogo SERVICE_TYPE
     * @param {*} idService Identificador del servicio que regresa el login
     */
    const getTitle = idService => SERVICE_TYPE[`${idService}`].name;

    /**
     * Obtiene el icono que se debe de mostrar en el Item
     * El icono lo obtiene del catalogo SERVICE_TYPE
     * @param {*} idService Identificador del servicio que regresa el login
     */
    const getIcon = idService => SERVICE_TYPE[`${idService}`].icon;

    return(openMenu ?
    <>
        <div onClick={() => onCloseMenu(true)}>
            <Image src={'/img/icons/close.png'} width={30} height={30} alt={'close'}/>
        </div>
        <div className='navbar-items'>
            {items.map(item => <TabNavItem
                key={`tabnav-${item}`}
                title={getTitle(item)}
                id={item}
                setActiveTab={setActiveTab}
                icon={getIcon(item)}
            />)}
        </div>
    </>
    :
    <>
        <div onClick={() => onCloseMenu(false)}>
            <Image src={'/img/icons/navbar.png'} width={40} height={40} alt={'menu'}/>
        </div>
    </>
    );
}

export default NavBar;