const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const helmet=require('helmet');
const userRoutes=require('./routes/authRoutes');

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.error('MongoDB connection error:', err));

const PORT=process.env.PORT || 5000;

app.use('/api/auth',userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})