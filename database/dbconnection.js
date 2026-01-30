import mongoose from "mongoose";
const dbconnection =  ()=>{
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "PORTFOLIO"
    }).then(()=>{
        console.log("connted to database")
    }).catch((error)=>{
        console.log(`some Error  occured  while connenting to database: ${error}`)
        console.log("Connected to database")
console.log(`Error occurred while connecting to database: ${error}`)
    })

    
}
export default dbconnection;
