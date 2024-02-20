import {useEffect, useState} from 'react'
import axios from "axios";
import { capitalize } from 'lodash';
import { Button } from "./Button"
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
    const [firstName,setFirstName] = useState("");
    const [id, setId] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get("http://localhost:3000/api/v1/user",{
                    headers: {Authorization: `Bearer ${token}`}
                });
                setId(response.data.id)
                setFirstName(response.data.firstname);
            } catch(err){
                alert(err.response.data.message)
                console.error('Server responded with an error status:', err.response.status);
                console.error('Error data:', err.response.data);
            }
        };
        fetchData();
    },[])
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4 mr-4">
            PayTM App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4 mt-1">
                <Button onClick={(e)=>{
                    navigate("/ledger?id="+id)
                }} label={"History"}/>
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {capitalize(firstName[0])}
                </div>
            </div>
        </div>
    </div>
}