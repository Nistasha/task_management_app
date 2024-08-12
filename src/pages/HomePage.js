import { ReactComponent as Logo } from '../images/schedule.svg';

import LoginPage from './LoginPage';
const HomePage = () => (
    <>
   <div className='home-page'>
    <div><Logo/></div>
    <LoginPage/>
    </div> 
    
    
    </>
);

export default HomePage;