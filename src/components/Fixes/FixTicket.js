import { useSelector } from 'react-redux';
import { phoneMask, toLocalDateString } from '../../utils/functions';

/**
 * Componente que contiene el formato del ticket para las reparaciones
 * @param {number} folio Identificador de la reparación
 * @param {string} customerName Nombre del cliente
 * @param {string} customerPhone Numero de contacto del cliente
 * @param {string} admissionDate Fecha de recepcion
 * @param {string} notes Observaciones de la reparacion
 * @param {array} services Servicios a realizar
 * @param {number} adAdvancePayment Adelanto del pago del servicio
 * @param {total} total Costo total de la reparacion
 */
const FixTicket = ({ folio, customerName, customerPhone, admissionDate, notes, services, advancePayment, total }) => {

    const storeName = useSelector(state => state.stores.name);
    const address = useSelector(state => state.stores.contactInfo.address);
    const cellPhone = useSelector(state => state.stores.contactInfo.whatsapp);
    const localPhone = useSelector(state => state.stores.contactInfo.phone);

    /**
     * Crea la lista de servicios para el ticket 
     */
    const createServicesList = () => {
        return(<ol className='services'>
            {services.map( (service, index) => <li key={index}>{service}</li>)}
        </ol>);
    };

    return(
        <div className='fix-ticket-container'>
            <img src={'/img/logoBW.svg'} alt={'logo'}/>
            <div className='info-store'>
                <p>Sucursal {storeName}</p>
                <p>{address}</p>
                <div className='contact'>
                    <img src={'/img/icons/whatsapp.png'} alt={'whatsapp'}/>
                    <p>{phoneMask(cellPhone)}</p>
                </div>
                <div className='contact'>
                    <img src={'/img/icons/phone.png'} alt={'phone'}/>
                    <p>{phoneMask(localPhone)}</p>
                </div>
            </div>
            <div className='customer block'>
                <p>Nombre: {customerName}</p>
                <p>Contacto: {phoneMask(customerPhone)}</p>
                <p>Folio: {folio}</p>
                <p>Fecha de recepción: {toLocalDateString(admissionDate)}</p>
                <p>Total: ${total}.00</p>
                <p>Anticipo: ${advancePayment}.00</p>
            </div>
            <div className='notes block'>
                <p className='title bold'>Observaciones</p>
                <p>{notes}</p>
            </div>
            <div className='block'>
                <p className='title bold'>Servicios</p>
                {createServicesList()}
            </div>
            <div className='conditions block'>
                <p className='bold title'>Condiciones del servicio</p>
                <ol className='notes'>
                    <li>El diagnostico de los equipos NO tiene costo</li>
                    <li>Todos los equipos se reciben sin accesorios. NO nos hacemos responsables por accesorios extraviados, como chips, memorias o fundas</li>
                    <li>Para la entrega de su equipo es necesario conservar su ORDEN DE SERVICIO, en caso de extravío de la misma, será necesario entregar copia de identificación a nombre de quien solicitó el servicio</li>
                    <li>En equipos mojados, golpeados, doblados o rotos no hay garantía de que funcionen al 100%</li>
                    <li>No nos hacemos responsables de equipos reparados anteriormente por técnicos que no laboren en nuestro establecimiento</li>
                    <li>En cambio de centro de carga no aplica garantía por mal uso</li>
                    <li>En refacciones, liberaciones y software no hay garantía</li>
                    <li>Al recibir su equipo verifique la función correcta del mismo, una vez entregado el equipo no nos hacemos responsables de las fallas que presente</li>
                    <li>Despúes de 30 días no nos hacemos responsables por equipos olvidados</li>
                    <li>NO contamos con seguro en caso de robo al establecimiento</li>
                </ol>
            </div>
            <div className='mini-ticket block'>
                <p>Nombre: {customerName}</p>
                <p>Contacto: {phoneMask(customerPhone)}</p>
                <p>Folio: {folio}</p>
                <p>Fecha de recepción: {toLocalDateString(admissionDate)}</p>
            </div>
        </div>
    );
};

export default FixTicket;
