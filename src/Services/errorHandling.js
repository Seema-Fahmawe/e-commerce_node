export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            if (process.env.MOOD === 'DEV') {
                return res.status(500).json({ message: "catch error", stack: error.stack });
            } else {
                return res.status(500).json({ message: "catch error" });
            }
        });
    }
}

export const globalErrorHandel = (err, req, res, next) => {
    if (process.env.MOOD === 'DEV') {
        return res.status(err.cause || 500 ).json({ message: "catch error", stack: err.stack });
    } else {
        return res.status(err.cause || 500 ).json({ message: "catch error" });
    }
}