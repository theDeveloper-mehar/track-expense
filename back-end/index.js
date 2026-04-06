import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';
import incomeRouter from './routes/incomeRouter.js';
import expenseRouter from './routes/expenseRouter.js';
import dashboardRouter from './routes/dashboardRoute.js';


const app = express();
const port = 4000;

//Middlewares
app.use(cors({
  origin: 'https://expense-tracker-koushik.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));



//Data Base
connectDB();





//Routes

app.use('/api/user',userRouter);
app.use('/api/income',incomeRouter);
app.use('/api/expense',expenseRouter);
app.use('/api/dashboard',dashboardRouter)

app.get('/',(req,res)=>
{
    res.send('API Working')
})

app.listen(port,()=>
{
    console.log(`Server Started at ${port}`);
})