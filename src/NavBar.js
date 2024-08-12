import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import useUser from './hooks/useUser';

const NavBar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    return (
        <nav>
            <div className="nav-right">
                {/* {user
                    ? <button onClick={() => {
                        signOut(getAuth());
                    }}>Log Out</button>
                    : <button onClick={() => {
                        navigate('/');
                    }}>Log In</button>} */}
                    {user ? (
  <button onClick={() => {
    signOut(getAuth());
    navigate('/');
  }}>Log Out</button>
) : (
  <button onClick={() => {
    navigate('/');
  }}>Log In</button>
)}
            </div>
        </nav>
    );
}

export default NavBar;