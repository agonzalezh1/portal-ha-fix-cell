/**
 * Variables de ambiente
 * Revisar como colocarlas en un .env
 */
export const environmentVariables = {
    URL_BASE: '/ha-fix-cell/',
    URL_VERSION: 'v1',
    URL_USERS_VALIDATION: '/users/validation',
    URL_STORES_CRUD: '/stores',
    URL_STORES_DETAILS_BY_ID: '/stores/{}/details',
    URL_API_USERS: '/users',
    URL_API_PRODUCTS: '/products',
    URL_API_STOCKTAKING: '/products/stocktaking',
    URL_API_SALES_BY_STORE: '/stores/sales',
    URL_API_SPEND_BY_STORE: '/stores/spend',
    TIMEOUT_GLOBAL: 30000,
};

const urlBase = `/api${environmentVariables.URL_BASE}${environmentVariables.URL_VERSION}`;
export const urlApis = {
    usersValidation: `${urlBase}${environmentVariables.URL_USERS_VALIDATION}`,
    stores: `${urlBase}${environmentVariables.URL_STORES_CRUD}`,
    storesDetails: `${urlBase}${environmentVariables.URL_STORES_DETAILS_BY_ID}`,
    users: `${urlBase}${environmentVariables.URL_API_USERS}`,
    products: `${urlBase}${environmentVariables.URL_API_PRODUCTS}`,
    stocktaking: `${urlBase}${environmentVariables.URL_API_STOCKTAKING}`,
    salesByStore: `${urlBase}${environmentVariables.URL_API_SALES_BY_STORE}`,
    spendByStore: `${urlBase}${environmentVariables.URL_API_SPEND_BY_STORE}`,
};

export const TEXT_CONFIG = Object.freeze({
    ALPHANUM_WITHOUT_SPACES: 'ALPHANUM_WITHOUT_SPACES',
    ALPHANUM_WITH_SPACES: 'ALPHANUM_WITH_SPACES',
    UPPER_CASE: 'UPPER_CASE',
    LOWER_CASE: 'LOWER:CASE',
    CAPITALIZE: 'CAPITALIZE',
    NUMBER: 'NUMBER',
    NUMBER_WITH_DECIMALS: 'NUMBER_WIT_DECIMALS',
});

export const ACTION_TYPES = Object.freeze({
    INCREASE: 'increase',
    DECREASE: 'decrease',
    DELETE: 'delete',
    SAVE: 'save',
    SEARCH: 'search',
});

export const PRODUCT_TYPES = Object.freeze({
    1: 'Accesorios computación',
    2: 'Accesorios telefonía',
    3: 'Fundas',
    4: 'Micas',
    5: 'Reparaciones',
    6: 'Servicios',
    7: 'Otro',
});

export const BRAND_TYPES = Object.freeze({
    1: '1Hora',
    2: 'Acteck',
    3: 'Stylos',
    4: 'Kingston',
    5: 'Adata',
    6: 'Otro',
});

export const GRANT_TYPES = Object.freeze({
    1: 'Inventario',
    2: 'Tiendas',
    3: 'Ventas',
    4: 'Usuarios',
});

export const NOTIFICATION_TYPES = Object.freeze({
    SUCCESS: 1,
    ERROR: 2,
});

export const USER_TYPE = Object.freeze({
    ADMIN: 1,
    SELLER: 2,
});

export const SALES_TYPE = Object.freeze({
    PRODUCTS: 'Productos',
    SERVICES: 'Reparación / Servicio',
    AIRTIME: 'Recargas',
});

export const PRICES_TYPE = Object.freeze({
    PUBLIC: 'Precio público',
    MID_WHOLE_SALE: 'Precio medio mayoreo',
    WHOLE_SALE: 'Precio mayoreo',
});

export const STATUS_CODE = Object.freeze({
    SUCCESSFUL: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
});

export const PAYMENT_TYPE = Object.freeze({
    CASH: 'cash',
    CARD: 'card',
});

export const REGEXP = {
    DECIMALS: '^([0-9]{1,6}(\.[0-9]{1,2})?)$',
};


export const SERVICE_TYPE = Object.freeze({
    1: {
        name: 'Inventario',
        icon: '/img/stocktaking.png',
    },
    2: {
        name: 'Tiendas',
        icon: '/img/store.png',
    },
    3: {
        name: 'Ventas',
        icon: '/img/sale.png',
    },
    4: {
        name: 'Usuarios',
        icon: '/img/users.png',
    },
});
