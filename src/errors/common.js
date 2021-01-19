export const error = (res, errCode, err) => {
    console.error(err);
    res.status(errCode).send(err);
}

export const error400 = (res, err) => {
    error(res, 400, {err});
}

export const errord400 = (res, message, field) => {
    error(res, 400, {field, message});
}

export const existedError = (res, field) => {
    error(res, 400, {field, message: `SYS.MSG.${field.toUpperCase()}_IS_EXISTED`});
}

export const nanError = (res, field) => {
    error(res, 400, {field, message: `SYS.MSG.${field.toUpperCase()}_NOT_A_NUMBER`});
}

// export const errorf = (res, field, key) => {
//     error(res, 400, {[field]: key});
// }

