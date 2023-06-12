import jwt from "jsonwebtoken"

export const createToken = ({ payload = '', signiture = process.env.TOKEN_SIGNITRE, expiresIn=60*60*60*60  } = {}) => {

    const sign = jwt.sign(payload, signiture,  {expiresIn} )
    return sign
}


export const decodeToken=({token,signiture = process.env.TOKEN_SIGNITRE}={})=>{
    const verfy =jwt.verify(token, signiture)
    return verfy
}

