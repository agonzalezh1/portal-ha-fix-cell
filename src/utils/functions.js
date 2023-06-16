import { TEXT_CONFIG, GRANT_TYPES } from './constants';

export const stringTrim = valor => valor.trim();

export const onlyNumber = valor => valor.replace(/[^0-9]/g, '');

export const numberWithDecimals = value => value.replace(/[^0-9.]/g, '');

export const onlyAlphanumericWithSpaces = valor => valor.replace(/[^\wñÑáÁéÉíÍóÓúÚ\s]/g, '');

export const onlyAlphanumericWithoutSpaces = valor => valor.replace(/[\W]/g, '');

export const withoutSpaces = valor => valor.replace(' ', '');

export const lowerCase = valor => valor.toLowerCase();

export const upperCase = valor => valor.toUpperCase();

export const capitalize = valor => valor.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

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

export const getGrantsList = () => {
    const grantsList = [];
    Object.entries(GRANT_TYPES).forEach(([key, value]) => {
        grantsList.push({ key, value, checked: false });
    });

    return grantsList;
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
