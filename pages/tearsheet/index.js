import React from 'react';
/**
 * Pagina con el menu
 */
const Tearsheet = () => {
    return (<div className='container-tearsheet'>
        <h1 className='header'>Estilos para la aplicacion</h1>
        <div className='textos contenedor-seccion'>
            <h1>Titulo h1 36 px</h1>
            <h2>Titulo h2 32 px</h2>
            <h3>Titulo h3 28 px</h3>
        </div>
        <div className='textos-2 contenedor-seccion'>
            <div className='contenedor-texto'>
                <p className='letter-1 bold'>Texto letter-1 bold 18 px</p>
                <p className='letter-1'>Texto letter-1 18 px</p>
            </div>
            <div className='contenedor-texto'>
                <p className='letter-2 bold'>Texto letter-2 bold 16px</p>
                <p className='letter-2'>Texto letter-2 16px</p>
            </div>
            <div className='contenedor-texto'>
                <p className='letter-3 bold'>Texto letter-3 bold 14px</p>
                <p className='letter-3'>Texto letter-3 14px</p>
            </div>
        </div>
        <div className='botones contenedor-seccion'>
            <div className='contenedor-botones'>
                <button className='primary' onClick={() => console.log('boton') }>Primario</button>
                <button className='primary' disabled>Primario</button>
            </div>
            <div className='contenedor-botones'>
                <button className='secondary' onClick={() => console.log('boton') }>Secundario</button>
                <button className='secondary' disabled>Secundario</button>
            </div>
        </div>
        <style jsx>{`
            .container-tearsheet {
                display: flex;
                width: 100%;
                flex-direction: column;
                padding-left: 30px;
                padding-right: 30px; 

            }
            .contenedor-seccion {
                width: 100%;
                border: 1px solid rgba(201,201,201, 0.78);
                margin-bottom: 40px;
            }
            .textos {
                display: flex;
                flex-direction: column;
            }
            .textos-2 {
                display: flex;
                justify-content: center;
                gap: 50px;
                
            }
            .botones {
                padding: 30px;
                display: flex;
                justify-content: center;
            }
            .botones .contenedor-botones {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 45%;
                height: 80px;
            }
        `}</style>
    </div>
    );
};

export default Tearsheet;
