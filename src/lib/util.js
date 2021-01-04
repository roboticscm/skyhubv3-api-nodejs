export const isDevMode = (process.env.NODE_ENV || 'development') === 'development';
export const snakeToCamelCase = (str) =>
    str.replace(/([-_][a-z])/g, (group) =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', ''),
    );

export const convertFieldsToCamelCase = (obj) => {
    for (let field in obj) {
        if (field.includes('_')) {
            const newField = snakeToCamelCase(field);
            obj[newField] = obj[field];
            delete obj[field];
        }
    }

    return obj;
}

export const isNumber = (source ) => {
    
}

export const getCurrentTime = () => {
    return (new Date()).getTime();
}

