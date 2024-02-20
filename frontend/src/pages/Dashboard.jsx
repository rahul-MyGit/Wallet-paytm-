import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect,useState } from "react"
// import verifyJwt from '../../../backend/jwt/jwtUtils.js'

export const Dashboard = () => {
    // let render=true;
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     render = verifyJwt(token);
    // },[])
    // if(!render) return <div></div>
    // else
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance />
            <Users />
        </div>
    </div>
}