import mongoose from "mongoose"


const dbConnection = async () => {

    return await mongoose.connect(process.env.DB_CONNECTION).then(() => {
        console.log('.......DataBase is connected.......');
    }).catch((err) => {
        console.log(`.......DataBase error...${err}....`);

    })
}


export default dbConnection