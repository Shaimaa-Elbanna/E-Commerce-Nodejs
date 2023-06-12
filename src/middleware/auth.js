import userModel from "../../DB/models/user.model.js"
import { AppError, asyncErrorHandler } from "../utilies/errorHandling.js"
import { decodeToken } from "../utilies/generateAndVerfyToken.js"







export const roles = {
    Admin: 'Admin',
    HR: 'HR',
    User: 'User',
}


export const auth = (accessRoles = []) => {
    return asyncErrorHandler(async (req, res, next) => {

        const { authorization } = req.headers

        if (!authorization?.startsWith(process.env.BEARER_KEY)) {

            return next(new AppError('token and bearer key is required'), 400)

        }

        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return next(new AppError('invalid-token'), 400)

        }

        const decoded = decodeToken({ token })
        if (!decoded?.id) {

            return next(new AppError('in_valide token payload'), 400)

        }


        const user = await userModel.findById(decoded.id).select('changePassTime email name role')
    

        if (!user) {
            return next(new AppError('user is not rejesterd'), 401)


        }
        if(decoded.iat<parseInt(user.changePassTime?.getTime()/1000)){
            return next(new AppError('token is not valid'), 400)
            
        }

        // if (!accessRoles.includes(user.role)) {
        //     return next(new AppError('user is not authorized'), 403)

        // }

        if (!accessRoles.includes(user.role)) {
            return next(new AppError('user is not authorized'), 403)

        }
        req.user = user
        next()


    })

}








// export const auth =
//     asyncErrorHandler(async (req, res, next) => {


//         const { authorization } = req.headers

//         if (!authorization?.startsWith(process.env.BEARER_KEY)) {

//             return next(new AppError('token and bearer key is required'), 400)

//         }

//         const token = authorization.split(process.env.BEARER_KEY)[1]
//         if (!token) {
//             return next(new AppError('invalid-token'), 400)

//         }

//         const decoded = decodeToken({ token })
//         if (!decoded?.id) {

//             return next(new AppError('in_valide token payload'), 400)

//         }


//         const user = await userModel.findById(decoded.id)

//         if (!user) {
//             return next(new AppError('user is not rejesterd'), 401)


//         }

    

//         req.user = user
//        return  next()


//     })


//     export const authorized = (accessRoles=)=>{
//         return (req,res,next)=>{




//             if(!accessRoles.includes(req.user.role)){
//             return next(new AppError('not authorized user'), 403)
                
//             }

//             return next()
//         }

      

//     }
