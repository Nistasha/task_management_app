import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const logIn = async () => {
        try {
            const userCredential= await signInWithEmailAndPassword(getAuth(), email, password);
            const user= userCredential.user;
           localStorage.setItem('userId', user.uid);
           navigate('/calendar');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
        <div className='login-page'>
        <h1>Log In</h1>
        {error && <p className="error">{error}</p>}
        <input
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)} />
        <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
        <button onClick={logIn}>Log In</button>
        <Link to="/create-account">Don't have an account? Create one here</Link>
        </div>
        </>
    );
}

export default LoginPage;