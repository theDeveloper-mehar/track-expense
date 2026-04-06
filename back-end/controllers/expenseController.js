import expenseModel from '../models/expenseModel.js';
import getDateRange from '../utils/datafilter.js';
import XLSX from 'xlsx';

//add expense

export async function addExpense(req,res)
{
    const userId = req.user._id;
    const {description , amount , category , date} = req.body;

    try{
    if(!description || !amount || !category || !date)
    {
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date()
        });
        await newExpense.save();
        res.json({
            success:true,
            message:'Expense added successfully'
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

// get funciton to  get all expenses

export async function getAllExpenses(req,res)
{
    const userId = req.user._id;
    try{
        const expense = await expenseModel.find({userId}).sort({date:-1});
        res.json(expense);
    }
    catch(error)
    {
         console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}


// to update expense
export async function updateExpense(req,res)
{
    const {id} = req.params;
    const userId = req.user._id;
    const{description , amount } = req.body;

    try{
        const updatedExpense = await expenseModel.findOneAndUpdate({_id:id},{description,amount},{new:true});
        if(!updatedExpense)
        {
            return res.status(404).json({
                success:false,
                message:"Expense not found"
            });
        }
        res.json({
            success:true,
            message:"Expense updated Successfully",
            data:updatedExpense
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Server Error'
        });
    }
}

// to delete expense

export async function deleteExpense(req,res) {
    try{
        const expense = await expenseModel.findByIdAndDelete({_id:req.parms.id});
        if(!expense)
        {
            return res.status(404).json({
                success:false,
                message:'Expense not found'
            })
        }
        return res.json({
            success:true,
            message:'Deleted Expense Successfully'
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Server Error'
        });
    }
}

// download expense execel

export async function downloadExpenseExcel(req,res)
{
     const userId = req.user._id;
    try{
        const expense = await expenseModel.find({userId}).sort({date:-1});
        const plainData = expense.map((exp)=>(
        {
            description:exp.description,
            amount:exp.amount,
            category:exp.category,
            Date:new Date(exp.date).toLocaleDateString(),
        }));
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,worksheet,'expenseModel');
        XLSX.writeFile(workbook,'expense_details.xlsx');
        res.download('expense_details.xlsx');
    }
     catch(error)
    {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

// to get overview of expense

export async function getExpenseOverView(req,res)
{
    try{
        const userId = req.user._id;
        const{ range = 'monthly'} = req.query;
        const {start,end} = getDateRange(range);

        const expense = await expenseModel.find({
            userId,
            date:{$gte:start , $lte:end},
        }).sort({date:-1})
        const totalExpense = expense.reduce((acc,curr)=>acc+curr.amount ,0);
        const averageExpense = expense.length > 0 ? totalExpense / expense.length :0;
        const numberOfTransactions = expense.length;
        const recentTransactions = expense.slice(0,5);

        res.json({
            success:true,
            data:{
               totalExpense,
               averageExpense,
               numberOfTransactions,
               recentTransactions,
               range
            }
        });
    }
     catch(error)
    {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}