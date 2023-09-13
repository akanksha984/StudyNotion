import Template from "../components/core/Auth/Template";
import signupImg from "../assets/Images/signup.webp";

const Signup= ()=>{
    return (
        <div>
            <Template
            title="Join the millions learning to code with Studynotion for free"
            desc1="Build skills for today, tomorrow, ans beyond" 
            desc2="Education to futureproof your career"
            image={signupImg}
            formtype="signup"
            />
        </div>
    )
}
export default Signup;