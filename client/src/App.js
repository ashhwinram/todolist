import {AccountCircleRounded, Logout} from '@mui/icons-material';
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setActiveuser} from './store/user-store.js';
import './App.css';
import Checklist from './components/Checklist.js';
import LoginPage from './components/LoginPage.js';
import {setTodo} from './store/checklist-store.js';

function App() {

  const [showLogin, setShowLogin] = useState(true);
  const [showLogout, setShowLogout] = useState(false); 
  const userName = useSelector((state) => state.user.activeUser.userName);
  const dispatch = useDispatch();

  function onLoginClick() {
    setShowLogout(!showLogout);
  }

  function loggedIn(data) {
    dispatch(setActiveuser(data));
    setShowLogin(false);
  }

  function onLogoutClick() {
    setShowLogout(false);
    setShowLogin(true);
    dispatch(setTodo([]));
  }

  return (
    <div className='App'>
      <h2 className='header'>Checklist <span>&#10003;</span></h2>
      { !showLogin ? <div className='login' onClick={onLoginClick}>
        <AccountCircleRounded sx={{ fontSize: 20 }}/><span className='username'>{userName}</span>
      </div> : null }
      { showLogout && !showLogin ? <div className='logout' onClick={onLogoutClick}>
        <Logout sx={{ fontSize: 20 }}/><span>Logout</span>
      </div> : null }
      { showLogin ? <LoginPage loggedIn={loggedIn}/> : <Checklist/>}
    </div>
  );
}

export default App;
