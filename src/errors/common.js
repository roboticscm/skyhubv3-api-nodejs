export const error400 = (res, err) => {
    error(res, 400, err);
}

export const errord400 = (res, message, key) => {
    error(res, 400, {message, key});
}

export const error = (res, errCode, err) => {
    console.error(err);
    res.status(errCode).send({
        message: err.toString()
    });
}