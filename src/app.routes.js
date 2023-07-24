import dbConnection from "../DB/database.connetion.js"
import { AppError, asyncErrorHandler, globalErrorHandling } from "./utilies/errorHandling.js"
import categoryRouter from './modules/category/category.router.js'
import subcategoryRouter from './modules/subcategoty/subCategory.router.js'
import authRouter from './modules/auth/auth.router.js'
import copounRouter from './modules/copoun/copoun.router.js'
import brandRouter from './modules/brand/brand.router.js'
import productRouter from './modules/product/product.router.js'
import cartRouter from './modules/cart/cart.router.js'
import orderRouter from './modules/order/order.router.js'
import reviewsRouter from './modules/reviews/reviwes.router.js'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
const __dirName = path.dirname(fileURLToPath(import.meta.url))
const initServer = (express, app) => {


  app.use((req, res, next) => {

    if (req.originalUrl == '/order/webhook') {
      next()
    }
    else {
      express.json({})(req, res, next)
    }
  })
  const  whitelist = ['http://localhost:3000']

  app.use(async(req,res,next)=>{

    if(!whitelist.includes(req.header("origin"))){
      return next (new AppError('Not Allowed By Cors Origin'))
    }
    for(const origin of whitelist){

      if(req.header("origin")==origin){

        await res.header("Access-Control-Allow-Origin",origin)
        break;
      }
    }

    await res.header("Access-Control-Allow-Headers","*")
    await res.header("Access-Control-Allow-Privit-Network","*")
    
    await res.header("Access-Control-Allow-Methods","*")
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200); // Respond with 200 for OPTIONS requests
    }

    next();


  })
  


  app.use('/upload', express.static(path.join(__dirName, '../upload')))
  app.use('/category', categoryRouter)
  app.use('/subcategory', subcategoryRouter)
  app.use('/auth', authRouter)
  app.use('/copoun', copounRouter)
  app.use('/brand', brandRouter)
  app.use('/product', productRouter)
  app.use('/cart', cartRouter)
  app.use('/order', orderRouter)
  app.use('/review', reviewsRouter)

  app.use("*", (req, res, next) => { res.status(404).json("page is not found") })


  dbConnection()

  app.use(globalErrorHandling)





}


export default initServer