import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { addGrants } from '../src/storage/profileSlice';
import { addCurrentStore } from '../src/storage/storesSlice';
import { addProductSale, addFixSale, addAirtimeSale } from '../src/storage/salesSlice';
import { authenticateUser } from '../src/utils/apiRequest/apiUsersValidation';
import { getSalesByStore } from '../src/utils/apiRequest/apiStoresSales';
import { TEXT_CONFIG } from '../src/utils/constants';
import { useNotification } from '../src/hooks/useNotification';
import InputText from '../src/components/Controllers/InputText';
import styles from '../styles/Home.module.css';

export default function Home() {

    const { handleSubmit, control, formState, formState:{errors} } = useForm({ mode: 'onChange' });
    const [setNotification] = useNotification();
    const history = useRouter();
    const dispatch = useDispatch();

    /**
     * Autentica un usuario
     * Envia la informacion al api para validar el usuario
     * Si es de exito actualiza los permisos en el store y la sucursal del empleado
     * Si es error muestra un modal
     * @param {object} form { user, password}
     */
    const validateUser = async (form) => {
        const apiResp = await authenticateUser(form.user, form.password);
        if (apiResp.code === 0) {
            dispatch(addGrants(apiResp.response));
            dispatch(addCurrentStore(apiResp.response.store));

            getSalesByStore(apiResp.response.store).then( resp => {
                dispatch(addProductSale(resp.response.products));
                dispatch(addFixSale(resp.response.fixes));
                dispatch(addAirtimeSale(resp.response.airtime));
            });

            history.push('/menu');
        } else {
            setNotification(apiResp);
        }
    };

    return (<div className={styles.main_container}>
        <form onSubmit={handleSubmit(validateUser)} className={styles.login_container}>
            <div>
                <Image src={'/img/icons/perfil.png'} width={120} height={120} alt={'icon'}/>
            </div>
            <h3>HA Fix Cell</h3>
            <InputText
                id={'user'}
                title={'Usuario'}
                placeholder={''}
                maxLength={15}
                errors={errors.user}
                valueIn={''}
                textFormat={TEXT_CONFIG.ALPHANUM_WITHOUT_SPACES}
                rules={{ required: true}}
                control={control}
            />
            <InputText
                id={'password'}
                title={'Contraseña'}
                placeholder={''}
                maxLength={20}
                errors={errors.password}
                valueIn={''}
                inputType={'password'}
                textFormat={TEXT_CONFIG.ALPHANUM_WITHOUT_SPACES}
                rules={{ required: true }}
                control={control}
            />
            <button className='primary' disabled={!formState.isValid}>Login</button>
        </form>
    </div>);
}
