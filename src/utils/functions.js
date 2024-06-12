import { TEXT_CONFIG, MONTHS } from './constants';

export const stringTrim = valor => valor.trim();

export const onlyNumber = valor => valor.replace(/[^0-9]/g, '');

export const numberWithDecimals = value => value.replace(/[^0-9.]/g, '');

export const onlyAlphanumericWithSpaces = valor => valor.replace(/[^\wñÑáÁéÉíÍóÓúÚ\s]/g, '');

export const onlyAlphanumericWithoutSpaces = valor => valor.replace(/[\W]/g, '');

export const withoutSpaces = valor => valor.replace(' ', '');

export const lowerCase = valor => valor.toLowerCase();

export const upperCase = valor => valor.toUpperCase();

export const capitalize = valor => valor.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

export const phoneMask = value => value.replace(/(\d{3})(\d)/, '$1 $2').replace(/(\d{3}\s\d{3})(\d{1,2})/, '$1 $2').replace(/(\d{3}\s\d{3}\s\d{4})\d+?$/, '$1');

/**
 * Función que determina el formato de texto que se va a aplicar a una cadena de entrada
 * @param {string} textoEntrada Cadena a dar formato
 * @param {string} formatoTexto Tipo de formato de texto
 * @returns {string} Cadena con el nuevo formato aplicado
 */
export const formatText = (inText, formatTextType) => {
    switch (formatTextType) {
        case TEXT_CONFIG.UPPER_CASE:
            return upperCase(inText);
        case TEXT_CONFIG.LOWER_CASE:
            return lowerCase(inText);
        case TEXT_CONFIG.CAPITALIZE:
            return capitalize(inText);
        case TEXT_CONFIG.ALPHANUM_WITHOUT_SPACES:
            return onlyAlphanumericWithoutSpaces(inText);
        case TEXT_CONFIG.ALPHANUM_WITH_SPACES:
            return onlyAlphanumericWithSpaces(inText);
        case TEXT_CONFIG.NUMBER:
            return onlyNumber(inText);
        case TEXT_CONFIG.NUMBER_WITH_DECIMALS:
            return numberWithDecimals(inText);
        default:
            return inText;
    }
};

export const getListFromObject = object => {
    const list = [];
    Object.entries(object).forEach(([key, value]) => {
        list.push({ key, value, checked: false });
    });

    return list;
};

export const getPeriod = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    return `${String(month).padStart(2, '0')}/${year}`;
};

export const createCatalog = catalog => {
    const newCatalog = [];
    Object.entries(catalog).forEach(([key, value]) => {
        newCatalog.push({ value: key, text: value });
    });

    return newCatalog;
};

export const getLabelsBarChart = months => {
    const month = new Date().getMonth();
    const arrayOfMonths = [];
    for(let i = 0; i < months; i++) {
        if (month === -1) {
            month = 11;
        }
        arrayOfMonths.unshift(MONTHS[month]);
        month = month - 1;
    }

    return arrayOfMonths;
};

/**
 * Transformala fecha de entrada a un formato legible
 * @param {string} inputDate Fecha completa
 */
export const toLocalDateString = inputDate => {
    const inDate = new Date(inputDate);
    const day = String(inDate.getDate()).padStart(2, '0');
    const month = String(inDate.getMonth() + 1).padStart(2, '0');
    const year = inDate.getFullYear();
    const hour = String(inDate.getHours()).padStart(2, '0');
    const mins = String(inDate.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${mins}`;
};

/**
 * Valida que un usuario se encuentre dentro de la ubicación de la tienda que le correspnde para hacer login
 * Si es un usuario especial, no se realiza la validación
 * @param {string} user Nombre del usuario
 * @param {object} storeInfo Coordenadas de la tienda
 * @param {number} latitude latitud del usuario
 * @param {number} longitude longitud del usuario
 * @returns Bandera que indica si puede iniciar sesión
 */
export const validateLocation = ({user, storeInfo, latitude, longitude}) => {
    return true;
    /* NO FUNCIONA LA GEOLOCALIZACION, SE CAMBIA A CADA RATO
    const lat = Math.abs(Math.abs(storeInfo.latitude) - Math.abs(latitude));
    const long = Math.abs(Math.abs(storeInfo.longitude) - Math.abs(longitude));
    const exceptions = ['keka', 'lajefa', 'pita' ];

    if (exceptions.includes(user)) {
        return true;
    }

    if (lat > 0.0000500 || long > 0.0000500) {
        return false;             
    } else {
        return true;
    }
    */
}

/**
 * Valida si el usuario ya hizo login en el dia actual
 * @param {date} lastLogin Fecha del ultimo login 
 * @returns Bandera que indica si ya tiene login en el dia actual
 */
export const hasLoginToday = (lastLogin) => {
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    lastLogin.setHours(0,0,0,0);

    if(currentDate.getTime() === lastLogin.getTime()) {
        return true;
    } else {
        return false;
    }
};
