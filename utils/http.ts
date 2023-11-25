
const errorResponse = (res, code, message) => {
    return res.status(code).send({
        "status": "error",
        "message": message
    });
}

const successResponse = (res, data) => {
    return res.status(200).send({
        "status": "success",
        "data": data
    });
}

module.exports = {
    errorResponse,
    successResponse
}