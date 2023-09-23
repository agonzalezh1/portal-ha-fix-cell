import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useSpinner } from '../../hooks/useSpinner';
import InputText from '../Controllers/InputText';
import TextArea from '../Controllers/TextArea';
import Checkbox from '../Controllers/Checkbox';
import { getListFromObject, upperCase } from '../../utils/functions';
import { TEXT_CONFIG, FIXES_TYPES, PAYMENT_TYPE } from '../../utils/constants';
import { createFolio } from '../../utils/apiRequest/apiFixes';

/**
 * Formulario para dar de alta un nuevo folio de reparacion en la base de datos
 * @param {func} onFinish Funcion que se detona cuando el api que guarda la info responde
 */
const CreateFolio = ({ onFinish }) => {

    const { handleSubmit, control, formState, formState: { errors }, watch, trigger } = useForm({ mode: 'onChange' });
    const [fixes, setFixes] = useState(getListFromObject(FIXES_TYPES));
    const [advancePayment, setAdvancePayment] = useState('');
    const [loadingSpinner] = useSpinner();
    const currentStore = useSelector(state => state.stores.currentStore);
    const requiredField = { required: true };
    const validateFixes = {
        validate: () => fixes.some(fix => fix.checked === true) || !!watch('otherFix'),
    };

    /**
     * Ejecuta el api de crear folio con la información del formulario
     * @param {object} form Datos del formulario
     * @param {string} paymentMethod Metodo de pago
     */
    const createNewFolio = async(form, paymentMethod) => {
        const fixesTemp = fixes.filter( fix => fix.checked).map( fix => fix.value);
        if (form.otherFix) {
            fixesTemp.push(form.otherFix);
        }

        const newFolio = {
            folio: Number(form.folio),
            customerName: upperCase(form.customerName),
            fixes: fixesTemp,
            comments: form.comments,
            advancePayment: {
                type: paymentMethod,
                amount: form.advancePayment ? Number(form.advancePayment) : 0,
            },
            total: Number(form.total),
            store: currentStore,
        };

        loadingSpinner(true, 'Guardando folio...');
        const apiResp = await createFolio(newFolio);
        loadingSpinner(false, '');
        onFinish(apiResp);
    };

    /**
     * Se recibe el formulario detonado desde el boton de Pago en efectivo
     * Se detona la funcion que invoca el api de crear nuevo folio pero con
     * el metodo de pago de efectivo
     * @param {object} form Datos del formulario
     */
    const cashPayment = form => {
        createNewFolio(form, PAYMENT_TYPE.CASH);
    };

    /**
     * Se recibe el formulario detonado desde el boton de Pago con tarjeta
     * Se detona la funcion que invoca el api de crear nuevo folio pero con
     * el metodo de pago con tarjeta
     * @param {object} form Datos del formulario
     */
    const cardPayment = form => {
        createNewFolio(form, PAYMENT_TYPE.CARD);
    };

    /**
     * Crea el check de un tipo de reparación
     * Se le asocia el evento que actualiza la lista de tipos de reparaciones
     * @param {object} item Objeto con los valores del tipo de reparación. Revisar FIXES_TYPES
     */
     const createCheckboxItem = item => {
        return (<div className='fix'>
            <Checkbox
                key={`check-${item.key}`}
                id={`check-${item.key}`}
                control={control}
                changeEvent={e => checkFix(e)}
                label={item.value}
                isChecked={item.checked}
                value={item.key}
                rules={validateFixes}
            />
        </div>);
    };

    /**
     * Actualiza la lista de tipos de reparaciones
     * @param {object} e Evento detonado cuando se selecciona un check
     * Recibe el identificador de la reparacion y la bandera de seleccionado
     */
     const checkFix = e => {
        const fixesTemp = [...fixes];
        fixesTemp.forEach(fix => {
            if (e.value === fix.key) {
                fix.checked = e.checked;
            }
        });
        setFixes(fixesTemp);
        trigger();
    };

    return (<>
        <form className='create-folio-container'>
            <div className='folio-container'>
                <div className='folio'>
                    <InputText
                        id={'folio'}
                        title={'Número de folio'}
                        placeholder={'Folio'}
                        maxLength={5}
                        errors={errors.folio}
                        valueIn={''}
                        textFormat={TEXT_CONFIG.NUMBER}
                        rules={requiredField}
                        control={control}
                    />
                </div>
                <div className='customer-name'>
                    <InputText
                        id={'customerName'}
                        title={'Nombre del cliente'}
                        placeholder={'Baby shark'}
                        maxLength={30}
                        errors={errors.customerName}
                        valueIn={''}
                        textFormat={TEXT_CONFIG.ALPHANUM_WITH_SPACES}
                        rules={requiredField}
                        control={control}
                    />
                </div>
            </div>
            <p className='bold'>Selecciona el tipo de reparación</p>
            <div className='fixes-container'>
                {fixes.map(fix => createCheckboxItem(fix))}
            </div>
            <div className='other-fix'>
                <InputText
                    id={'otherFix'}
                    title={'Otro'}
                    placeholder={'Otro tipo de reparación'}
                    maxLength={50}
                    errors={errors.otherFix}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.ALPHANUM_WITH_SPACES}
                    rules={validateFixes}
                    control={control}
                />
            </div>
            <div className='comments-container'>
                <TextArea
                    id={'comments'}
                    rules={requiredField}
                    control={control}
                    label={'Comentarios'}
                />
            </div>
            <div className='payment-container'>
                <InputText
                    id={'advancePayment'}
                    title={'Anticipo'}
                    placeholder={'0'}
                    maxLength={5}
                    errors={errors.advancePayment}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    control={control}
                    changeEvent={e => setAdvancePayment(e)}
                />
                <InputText
                    id={'total'}
                    title={'Total'}
                    placeholder={'0000'}
                    maxLength={5}
                    errors={errors.total}
                    valueIn={''}
                    textFormat={TEXT_CONFIG.NUMBER}
                    rules={requiredField}
                    control={control}
                />
            </div>
            <div className='payment-type'>
                {advancePayment && <>
                    <button className='secondary icon' onClick={handleSubmit(cashPayment)} disabled={!formState.isValid} >
                        Pago en efectivo
                        <Image src={'/img/cash.png'} width={24} height={24} alt={'icon'}/>
                    </button>
                    <button className='secondary icon' onClick={handleSubmit(cardPayment)} disabled={!formState.isValid} >
                        Pago con tarjeta
                        <Image src={'/img/card.png'} width={24} height={24} alt={'icon'}/>
                    </button>
                </>}
                {!advancePayment &&
                    <button className='primary' onClick={handleSubmit(cashPayment)} disabled={!formState.isValid} >
                        Guardar
                    </button>
                }
            </div>
        </form>
    </>);
};

export default CreateFolio;
