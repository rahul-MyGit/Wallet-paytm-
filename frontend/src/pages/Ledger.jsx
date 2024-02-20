import axios from "axios";
import { useState, useEffect } from 'react';
import { capitalize } from 'lodash';

export const Ledger = () =>{
    const [transactions,setTransactions] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const token = localStorage.getItem('token')
                const response = await axios.get("http://localhost:3000/api/v1/ledger/history",{
                    headers: {Authorization: `Bearer ${token}`}
                })
                setTransactions(response.data.history);
                setLoading(false);
            } catch(err){
                console.log(err.response.data)
                console.error('Server responded with an error status:', err.response.status);
                setLoading(false);
                setError('Server responded with an error status: '+ err.response.status) 
            }
        };
        fetchData();
    },[])
    return <div className="ml-2">
        <div className="font-bold mt-6 mb-4 text-lg">All Transactions</div>
        {loading ? (<div>Loading...</div>) : 
            error ? (<div>{error}</div>) : 
            (<div>
                {transactions.map(transaction=><Transaction key={transaction._id} transaction={transaction}/>)}
            </div>)
        }
    </div>
}

const Transaction = ({transaction}) =>{
    const name = transaction.toUserFullName ? capitalize(transaction.toUserFullName) : capitalize(transaction.fromUserFullName)
    const amount = transaction.amount;

    return <div className="flex justify-between">
        <div className="flex ml-2">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {name[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    <b>{{amount}>0 ? "Received From: " : "Paid To: "} </b>{name}
                </div>
                <div>
                    <b>Payment:</b> Rs {{amount}>0 ? amount : -1*amount}
                </div>
                <div>
                    <b>Date:</b> {transaction.date}
                </div>
            </div>
        </div>
    </div>
}