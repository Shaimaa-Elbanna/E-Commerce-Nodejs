import { roles } from "../../middleware/auth.js";



const endPoint ={
    create:[roles.Admin],
    update:[roles.Admin],
    delete:[roles.Admin],
    get:Object.values(roles),
}


export default endPoint