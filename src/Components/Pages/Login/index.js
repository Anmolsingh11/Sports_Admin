import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logIn } from "../../../API/Login";
const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSignIn = () => {
        if (username === "" || password === "") {
            toast.warn("All fields are required");
        } else if (username === "") {
            toast.warn("User name is required");
        } else if (password === "") {
            toast.warn("Password is required");
        } else{
            logIn(username,password).then((res)=>{
                console.log(res);
                navigate("/home");
            }).catch((err)=> toast.error("Some error occured"));
        }
    }
    return (
        <>
            <div className="center-container">
                <div className="center" style={{width:'270px'}}>
                    <input value={username} placeholder="username" className={"form-control mb-3 box-shadow"} onChange={(e) => setUserName(e.target.value)} />
                    <input type="password" placeholder="password" value={password} className={"form-control box-shadow"} onChange={(e) => setPassword(e.target.value)} />
                    <button className="mt-3 btn btn-dark w-100" onClick={handleSignIn}>Login</button>
                </div>
            </div>
        </>
    );
}

export default Login;