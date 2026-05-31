import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import authRoutes from './routes/authRoutes.js';
import productsRoutes from "./routes/productsRoutes.js";
import cart from './routes/cart.js';
import address from './routes/address.js'
import Order from './models/Order.js';


dotenv.config();
const app=express();

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/products',productsRoutes);
app.use('/api/cart',cart);
app.use('/api/address',address);
app.use('/api/order',Order);

// app.get('/',(req, res)=>{
//     res.send('API is running...');
// })

connectDB();

app.listen(5001,()=>{
    console.log('server is running on port (5001)')
});