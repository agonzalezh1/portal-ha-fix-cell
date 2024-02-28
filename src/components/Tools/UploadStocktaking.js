import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loadStocktaking } from "../../utils/apiRequest/apiTools";
import { BRANCHES } from "../../utils/constants";
import { createCatalog } from '../../utils/functions';
import * as XLSX from 'xlsx';
import Picker from "../Controllers/Picker";

/**
 * Componente que lee el inventario (archivo de excel) de una tienda y lo actualiza en la base de datos
 */
const UploadStocktaking = () => {

    const { control, formState } = useForm({ mode: 'onChange' });
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [branch, setBranch] = useState(null);
    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setTypeError(null);
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = e => {
                setExcelFile(e.target.result);
            }
        } else {
            setExcelFile(null);
            setTypeError('Archivo no seleccionado...');
        }
    };

    /**
     * Valida la estructura del archivo excel
     * @param {*} data Datos leidos del excel
     * @param {*} branch Sucursal seleccionada
     */
    const validateXLSX = (data, branch) => {
        const selectedBranch = BRANCHES[branch];

        const validKeysNames = ['Nombre del producto', selectedBranch , 'ID'];
        if (data.length < 2) {
            throw new Error('Formato no válido');
        }

        if (!Object.keys(data[0]).every(e => validKeysNames.includes(e))) {
            throw new Error('Formato no válido o sucursal incorrecta');
        }
    }

    /**
     * Envía la informacion al api para actualizar la base de datos
     * @param {*} e Submit
     */
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            validateXLSX(data, branch);

            const request = data.map(item => {
                return { id: item.ID, count: item[BRANCHES[branch]] };
            });

            const apiResp = await loadStocktaking({ branch, data: JSON.stringify(request) });
            setTypeError(JSON.stringify(apiResp.response));
        } catch (error) {
            setTypeError(error.message);
        }
        
    };

    const formValid = () => formState.isValid && excelFile;

    return (<div className='upload-stocktaking-container'>
        <h3>Carga de inventario por sucursal</h3>
        <p>Carga el inventario de una sucursal desde un archivo excel. El archivo debe de tener la siguente estructura:</p>
        <ol>
            <li>La primer fila debe de tener los cabeceros de Nombre del producto,  Nombre de la sucursal en Mayusculas, ID</li>
            <li>No es necesario que el archivo tenga todos los productos. Puedes hacer cargas parciales</li>
            <li>Si un producto no existe en la Base de datos, este no se creará</li>
        </ol>
        <p>El resultado de la ejecución se mostrará en la parte inferior, en caso de error, contactar al administrador</p>
        <form className='select-file' onSubmit={handleSubmit}>
            <Picker
                id={'brand'}
                label={'Sucursal'}
                options={createCatalog(BRANCHES)}
                control={control}
                rules={{ required: true }}
                changeEvent={e => setBranch(e)}
            />
            <div className='container-input-file'>
                <input type='file' onChange={handleFileChange} accept={'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'} />
            </div>
            <button className='primary' disabled={!formValid()}>Cargar</button>
        </form>
        <div>
            {typeError && <div>{typeError}</div>}
        </div>
    </div>
    );
};

export default UploadStocktaking;
