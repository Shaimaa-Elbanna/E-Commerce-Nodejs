import bcrypt from 'bcrypt'

// export const hash = ({ plaintext, saltRound = process.env.SALT_ROUND } = {}) => {
//     const hashResult = bcrypt.hashSync(plaintext, parseInt(saltRound))
//     return hashResult
// }





// export const compare = ({ plaintext, hashValue  } = {}) => {
//     const compareResult = bcrypt.compareSync(plaintext, hashValue)
//     return compareResult
// }




export const hashPassword = ({ Plaintext,saltRound=process.env.SALT_ROUNDS }={}) => {

      const  hashPass = bcrypt.hashSync(Plaintext,parseInt(saltRound))
      return hashPass
}


export const comparePassword =({Plaintext,hashValue}={})=>{
    const comparePass =bcrypt.compareSync(Plaintext,hashValue)
    return comparePass
}