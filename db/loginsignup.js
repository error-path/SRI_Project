const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const DB = process.env.MONGO;
const connectDB = async()=>{
    try{
        const con = await mongoose.connect(DB,{
    })
    console.log(`MongoDB connected:${con.connection.host}`);
    }catch(error){
        console.log('mongodb connetion failed '+error );
    }

}
connectDB();

