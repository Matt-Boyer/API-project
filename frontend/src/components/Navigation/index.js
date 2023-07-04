import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import { useHistory } from 'react-router-dom';

function Navigation({ isLoaded }){
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
    <div id='navdiv'>
        <div>
          <NavLink exact to="/"><img src='https://i.imgur.com/sz0XEiG.png' alt='logo' id='logo'/></NavLink>
        </div>
          <div id='loginsignup'>
            {!sessionUser? <>
            <OpenModalMenuItem
              itemText="Log In"
              // onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              // onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </> :<div id='startnewgroup'><h3 id='loginisgnuplink' onClick={(e) => {
            history.push('/creategroup')
          }}>Start a new group</h3><ProfileButton user={sessionUser} /></div>}
          </div>
    </div>
    <hr id='linebreaknaviagtion' />
          </>
  );
}

export default Navigation;
