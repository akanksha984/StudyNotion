import Template from "../components/core/Auth/Template";
import loginImg from "../assets/Images/login.webp"

const Login = ()=>{
    return (
        <div>
            <Template 
            title="Welcome Back" 
            desc1="Build skills for today, tomorrow, ans beyond" 
            desc2="Education to futureproof your career"
            image={loginImg} 
            formtype="login" />
        </div>
    )
}

export default Login;