

export class AppError extends Error{
    constructor(message,statusCode){
super(message)
this.statusCode=statusCode
    }
}


 

export const asyncErrorHandler = (fn) => {

    return (req, res, next) => {
        fn(req, res, next).catch(err => {

            return next(new Error(`catch error ${err}`))

            //   return      req.res({message:`catch err.................${err}`})
        })

    }
}



export const globalErrorHandling = (err, req, res, next) => {

    if (err){
        const statusCode = err.statusCode||500
        
    const    message=err.message
        // const status =err.statusCode
        return res.status(statusCode).json( {message , stack:err.stack })}

}