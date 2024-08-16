import { promises } from 'dns';
import mongoose, { Mongoose } from 'mongoose';

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log('Already Connected');
        return;
    }

    try{
        const db =  await mongoose.connect(process.env.MONGODB_URI||"",{})
        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to DB');
    }catch(err){
        console.log('Error connecting to DB', err);
        process.exit(1);
    }
}

export default dbConnect;
 