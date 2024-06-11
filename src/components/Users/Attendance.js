import { useEffect, useState } from "react";
import { DAYS } from "../../utils/constants";

/**
 * Lista de asistencia de un usuario
 * @param {array} attendanceList Arreglo con la asistencia de un usuario, se obtiene de la base de datos
 */
const Attendance = ({attendanceList}) => {

    const [attendance, setAttendance] = useState([]);

    /**
     * Efecto que se detona cuando se cambia de usuario para consultar su asistencia
     * Reinicia los valores de la hora de entrada
     * Asigna ños nuevos valores de la hora de entrada segun la fecha que corresponda al arreglo base
     */
    useEffect(() => {
        
        const attListTemp = [...attendanceList];
        const attendanceTemp = attendance.map(att => {
            return { day: att.day, date: att.date, hour: '00:00:00'}
        });

        for(let i = 6; i >= 0; null){
            const attTemp = attListTemp.pop();
            const index = attendance.findIndex(att => {
                const attDateTemp = new Date(attTemp).toLocaleDateString();
                if (att.date === attDateTemp) {
                    return true;
                } else {
                    return false;
                }
            });

            if ( index !== -1 ) {
                attendanceTemp[index].hour = new Date(attTemp).toLocaleTimeString();
                i = index;
            } else {
                i = i-1;
            }
        }

        setAttendance(attendanceTemp);
        
    }, [attendanceList]);

    /**
     * Inicia el arreglo base
     * contiene un objeto con el dia, fecha y hora de entrada por default
     * La fecha la crea con la semana del dia actual. Se hace el calculo obteniendo la fecha actual
     * y el dia de la semana actual, se hace una resta para obtener el la fecha inicial
     * y a partir de esa fecha inicial se empieza a crear el arreglo con 7 dias
     */
    useEffect(() => {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();

        const firstDate = new Date(currentDate.setDate(currentDate.getDate()- dayOfWeek));
        const attendanceTemp = [];

        for (let i = 0; i < 7; i++ ) {
            const firstDateTemp = new Date(firstDate);
            
            const dayTemp = new Date(firstDateTemp.setDate(firstDateTemp.getDate() + i));
            const day = {
                day: DAYS[i],
                date: dayTemp.toLocaleDateString(),
                hour: '00:00:00',
            }
            attendanceTemp.push(day);
        }

        setAttendance(attendanceTemp);
    }, []);

    return (
        <div className='attendance-container'>
            {attendance.map((att, index) => {
                return(<div className='day-container' key={index}>
                    <div className='day bold'>{att.day}</div>
                    <p className='date bold'>{att.date}</p>
                    <p className='hour'>{att.hour}</p>
                </div>)
            })}
            
        </div>
    );
}

export default Attendance;
