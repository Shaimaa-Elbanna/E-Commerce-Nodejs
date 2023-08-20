import slugify from "slugify";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import userModel from "../../../../DB/models/user.model.js";
import sendEmail from "../../../utilies/sendEmail.js";
import { comparePassword, hashPassword } from "../../../utilies/hashAndComparePass.js";
import { createToken, decodeToken } from "../../../utilies/generateAndVerfyToken.js";
import { customAlphabet, nanoid } from "nanoid";
import cloudinary from "../../../utilies/cloudinary.js";








export const getAllUSers =asyncErrorHandler(async(req,res,next)=>{
    const getUser=await userModel.find({})
    res.status(200).json({message:"Done",getUser})
})






export const signup = asyncErrorHandler(async (req, res, next) => {

    const { name, email, password ,gender , phone ,DOB} = req.body

    console.log(req.body);






    const user = await userModel.findOne({ email })
    if (user) {
        return next(new AppError('user already exist'))
    }
    const customId=nanoid()
    if(req.file){
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLODINARY_FOLDER}/auth/${customId}`})

        req.body.image={secure_url,public_id}
    }


    const token = createToken({ payload: { email }, signiture: process.env.EMAIL_SIGNITURE, expiresIn: 60 * 5 })
    const refToken = createToken({ payload: { email }, signiture: process.env.EMAIL_SIGNITURE, expiresIn: 60 * 60 * 24 * 30 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const refLink = `${req.protocol}://${req.headers.host}/auth/reConfirmEmail/${refToken}`





    const html = ` <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                <a href="${refLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">ask for new requist</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="https://ar-ar.facebook.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="https://www.instagram.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
              `


const send =    await sendEmail({ to: email, subject: 'confirm you email', html })
 if (!send) {

        return next(new AppError('rejected email', 400))

    }

    const hashPass = hashPassword({ Plaintext: password })


    const users = await userModel.create({
        name,
        slug: slugify(name),
        email,
        password: hashPass,
        image: req.body.image,
        customId,
        gender,
        phone,
        DOB
    })
    // const users = userModel.save()
    if (req.file) {

        users.img = req.file.dest
        await users.save()
        res.status(201).json({ message: 'done', users })

    }


    res.status(201).json({ message: 'done', users })


})




export const confirmEmail = asyncErrorHandler(async (req, res, next) => {

    const { token } = req.params


    const { email } = decodeToken({ token, signiture: process.env.EMAIL_SIGNITURE })

    if (!email) {
        return next(new AppError('in_valid email', 400))


    }

    const user = await userModel.updateOne({ email }, { confirmEmail: true })


    return user.modifiedCount ? res.status(200).redirect(process.env.FRONT_END_PAGE) : next(new AppError('rejected email', 400))


})







export const reConfirmEmail = asyncErrorHandler(async (req, res, next) => {

    const { refToken } = req.params


    const { email } = decodeToken({ token: refToken, signiture: process.env.EMAIL_SIGNITURE })

    if (!email) {
        return next(new AppError('in_valid email', 400))


    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new AppError(' email not regesterd account', 404))
    }
    // if (user.confirmEmail == true) {

    //     return res.redirect('https://linkitqa.netlify.app/#/login')
    // } // what must applied but after fixing email sending 

    if (user.confirmEmail == true || user.confirmEmail == false ) {

        return res.redirect('https://linkitqa.netlify.app/#/login')
    }

    const newToken = createToken({ payload: { email }, signiture: process.env.EMAIL_SIGNITURE, expiresIn: 60 * 3 })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const refLink = `${req.protocol}://${req.headers.host}/auth/reConfirmEmail/${refToken}`



    const html = ` <html>
              <head>
                  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
              <style type="text/css">
              body{background-color: #88BDBF;margin: 0px;}
              </style>
              <body style="margin:0px;"> 
              <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
              <tr>
              <td>
              <table border="0" width="100%">
              <tr>
              <td>
              <h1>
                  <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
              </h1>
              </td>
              <td>
              <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
              </td>
              </tr>
              </table>
              </td>
              </tr>
              <tr>
              <td>
              <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
              <tr>
              <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
              <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
              </td>
              </tr>
              <tr>
              <td>
              <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
              </td>
              </tr>
              <tr>
              <td>
              <p style="padding:0px 100px;">
              </p>
              </td>
              </tr>
              <tr>
              <td>
              <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
              <a href="${refLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">ask for new requist</a>
              </td>
              </tr>
              </table>
              </td>
              </tr>
              <tr>
              <td>
              <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
              <tr>
              <td>
              <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
              </td>
              </tr>
              <tr>
              <td>
              <div style="margin-top:20px;">

              <a href="https://ar-ar.facebook.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
              <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
              
              <a href="https://www.instagram.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
              <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
              </a>
              
            `


    if (! await sendEmail({ to: email, html, subject: 'confirm your email' })) {

        return next(new Error('email not accepted'))

    }

    return res.status(200).json({ message: "Done,please check your mail" })

})







export const login = asyncErrorHandler(async (req, res, next) => {

    const { email, password } = req.body



    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new AppError('email is not rejesterd', 400))
    }
    // if (!user.confirmEmail) {
    //     return next(new AppError('you must confirm your email ,check your mail box', 404))

    // }

    // const compare = comparePassword({ plaintext: password, hashValue: user.password })
    if (!comparePassword({ Plaintext: password, hashValue: user.password })) {
        return next(new AppError('password is not valid', 400))

    }


    const access_token = createToken({ payload: { role: user.role, id: user._id }, expiresIn: 60 * 30 })
    const refresh_token = createToken({ payload: { role: user.role, id: user._id }, expiresIn: 60 * 60 * 24 * 365 })

    user.status = "online"

    await user.save()

    return res.status(200).json({ message: "Done", access_token, refresh_token })




})









// export const sendLink = asyncErrorHandler(async (req, res, next) => {

//     const { email } = req.body


//     const user = await userModel.findOne({ email })

//     if (!user) {

//         return next(new AppError('email not registerd ', 404))

//     }

//     const token = createToken({ payload: { email }, expiresIn: 60 * 5 })
//     const link = `${req.protocol}://${req.headers.host}/auth/confirmSendLink/${token}`



//     const html = ` <html>
//                 <head>
//                     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
//                 <style type="text/css">
//                 body{background-color: #88BDBF;margin: 0px;}
//                 </style>
//                 <body style="margin:0px;"> 
//                 <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
//                 <tr>
//                 <td>
//                 <table border="0" width="100%">
//                 <tr>
//                 <td>
//                 <h1>
//                     <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
//                 </h1>
//                 </td>
//                 <td>
//                 <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
//                 </td>
//                 </tr>
//                 </table>
//                 </td>
//                 </tr>
//                 <tr>
//                 <td>
//                 <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
//                 <tr>
//                 <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
//                 <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
//                 </td>
//                 </tr>
//                 <tr>
//                 <td>
//                 <h1 style="padding-top:25px; color:#630E2B">forget password</h1>
//                 </td>
//                 </tr>
//                 <tr>
//                 <td>
//                 <p style="padding:0px 100px;">
//                 </p>
//                 </td>
//                 </tr>
//                 <tr>
//                 <td>
//                 <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify new password</a>
                
//                 </td>
//                 </tr>
//                 </table>
//                 </td>
//                 </tr>
//                 <tr>
//                 <td>
//                 <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
//                 <tr>
//                 <td>
//                 <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
//                 </td>
//                 </tr>
//                 <tr>
//                 <td>
//                 <div style="margin-top:20px;">

//                 <a href="https://ar-ar.facebook.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
//                 <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
//                 <a href="https://www.instagram.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
//                 <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
//                 </a>
                
//               `


//     if (!await sendEmail({ to: email, html, subject: "forget password" })) {
//         return next(new AppError('email not accepted ', 400))

//     }

//     return res.status(200).json({ message: "done" })




// })





export const sendCode = asyncErrorHandler(async (req, res, next) => {

    const { email } = req.body

    const code = customAlphabet('0123456789', 5)

    const user = await userModel.findOneAndUpdate({ email }, { forgetPassCode: code() }, { new: true })

    if (!user) {

        return next(new AppError('email not registerd ', 404))

    }



    const html = ` <html>
<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
<style type="text/css">
body{background-color: #88BDBF;margin: 0px;}
</style>
<body style="margin:0px;"> 
<table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
<tr>
<td>
<table border="0" width="100%">
<tr>
<td>
<h1>
    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
</h1>
</td>
<td>
<p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
<tr>
<td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
<img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
</td>
</tr>
<tr>
<td>
<h1 style="padding-top:25px; color:#630E2B"> Forget password Code</h1>
</td>
</tr>
<tr>
<td>
<p style="padding:0px 100px;">
</p>
</td>
</tr>
<tr>
<td>
<h1 style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">forge password</h1>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td>
<table border="0" width="100%" style="border-radius: 5px;text-align: center;">
<tr>
<td>
<h3 style="margin-top:10px; color:#000">Stay in touch</h3>
</td>
</tr>
<tr>
<td>
<div style="margin-top:20px;">

<a href="https://ar-ar.facebook.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
<img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>

<a href="https://www.instagram.com/" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
<img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
</a>

`
    if (!await sendEmail({ to: email, html, subject: "forget password" })) {
        return next(new AppError('email not accepted ', 400))

    }

    return res.status(200).json({ message: "done", code: user.forgetPassCode })




})
export const forgetPassword = asyncErrorHandler(async (req, res, next) => {

    const { email, password, code } = req.body


    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new AppError('email not exist ', 400))

    }

    if (code != user.forgetPassCode) {
        return next(new AppError('code is not valid  ', 400))

    }



    user.password = hashPassword({ Plaintext: password })
    user.forgetPassCode = null
    user.changePassTime= Date.now()


    await user.save()

    return res.status(200).json({ message: "done", user })


})




////one access link trial.....///

// export const confirmSendLink = asyncErrorHandler(async (req, res, next) => {

//     const { token } = req.params


//     if (!token) {

//         return next(new AppError('token is required ', 400))

//     }
//     const decoded = decodeToken({ token })

//     if (!decoded.email) {

//         return next(new AppError('email is invalid ', 400))

//     }

//     const user = await userModel.findOneAndUpdate({ email:decoded.email }, { forgetPassLink: true , changePassTime:Date.now()})
    

// if(!user){
//     return  next(new AppError('rejected email', 400))
// }
// if(decoded.iat<parseInt( user.changePassTime?.getTime()/1000)){
//     return  next(new AppError('link is not avilable', 400))
// }



// return res.status(200).redirect("https://linkitqa.netlify.app/#/login") 



// })

// export const forgetPassword = asyncErrorHandler(async (req, res, next) => {

//     const { email, password } = req.body


//     const user = await userModel.findOne({ email })

//     if (!user) {
//         return next(new AppError('email not exist ', 400))

//     }

//     if (!user.forgetPassLink) {
//         return next(new AppError('link is not valid  ', 400))

//     }



//     user.password = hashPassword({ Plaintext: password })
//     user.forgetPassLink = false


//     await user.save()

//     return res.status(200).json({ message: "done", user })


// })

