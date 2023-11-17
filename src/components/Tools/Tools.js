import Image from 'next/image';

const Tools = () => {
    return (<div className='tools-container'>
        <div className='building'>
            <Image src={'/img/building.gif'} width={400} height={400} alt={'building'}/>
        </div>
        <h1>En construccion...</h1>
        <h1>Habilitar nuevo mes de ventas</h1>
        <h1>Consultar productos proximos a agotarse</h1>
        <h1>Cargar de nuevo el inventario</h1>
    </div>);
};

export default Tools;
