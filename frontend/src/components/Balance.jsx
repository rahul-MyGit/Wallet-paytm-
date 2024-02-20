import axios from 'axios'
import { useEffect,useState } from "react"

export const Balance = ({}) => {
    const [balance,setBalance]=useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setBalance(response.data.balance);
            } catch (err) {
                alert(err.response.data.message)
                console.error('Server responded with an error status:', err.response.status);
                console.error('Error data:', err.response.data);
              }  
        };

        fetchData();
    },[])
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}