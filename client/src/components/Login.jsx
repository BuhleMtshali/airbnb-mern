import { Link, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react'; 
import axios from 'axios';
import { UserContext } from '../UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState('');
    const { setUser } = useContext(UserContext);

    const handleLoginSubmit = async e => {
        e.preventDefault();
        try{
            const { data } = await axios.post('/login', {email, password});
            setUser(data)
            alert('Login Succesful');
            setRedirect(true);
        } catch(error){
            alert('login failed')
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="your@email.com"/>
                    <input type="password" placeholder="password" />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? {" "}
                        <Link className='underline text-black' to={'/register'}>
                        Register Now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;