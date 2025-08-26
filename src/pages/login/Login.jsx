
import './Login.css'

import { useRef, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context';

import Login_background from '../../assets/background-images/login_bg1.webp'
import Sh_chat_logo from '../../assets/icons/sh_chat_logo.svg?react'

export default function Login() {
  const { SERVER_IP } = useContext(Context)
  const [ isNewUser, setIsNewUser ] = useState(false)

  let loginEmailRef = useRef(null);
  let loginPWRef = useRef(null);
  // let loginSubmitRef = useRef(null);
  let userNotificationRef = useRef(null)

  let signupEmailRef = useRef(null)
  let signupPW1Ref = useRef(null)
  let signupPW2Ref = useRef(null)
  
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault();
    if (loginEmailRef.current.value != "" || loginPWRef.current.value == "") {
      try {
        const res = await axios.post(
          SERVER_IP + "/auth/login",
          {
            loginEmail: loginEmailRef.current.value,
            loginPw: loginPWRef.current.value,
          },
          { withCredentials: true }
        );
        if (res.data.code) {
          localStorage.setItem("isLoggedIn", true); // use this to implement offline auth assumption
          localStorage.setItem("uemail", res.data.uemail);
          localStorage.setItem("uid",res.data.uid);
          console.log('LSlog::',localStorage.getItem('uemail'), localStorage.getItem('isLoggedIn'))
          navigate("/sh-chat-fe/");
        } else {
          userNotificationRef.current.textContent =
            "Incorrect Email or password";
          userNotificationRef.current.style.display = "block";
          setTimeout(
            () => (userNotificationRef.current.style.display = "none"),
            5000
          );
        }
      } catch (err) {
        userNotificationRef.current.textContent =
          `Login failed, server error :(, ${err}`;
          console.error('LE::',err);
        userNotificationRef.current.style.display = "block";
        setTimeout(
          () => (userNotificationRef.current.style.display = "none"),
          5000
        );
      }
    }
  }

  async function handleSignup(e) {
    console.log('het');
    e.preventDefault();
    if (signupEmailRef.current.value.trim() == '' || signupPW1Ref.current.value == '' || signupPW2Ref.current.value == '') {
      userNotificationRef.current.textContent = 'Fill all fields';
      userNotificationRef.current.style.display = 'block'
      setTimeout(()=> (userNotificationRef.current.style.display = 'none'),5000);
    }
    else if (signupPW1Ref.current.value != signupPW2Ref.current.value) {
      userNotificationRef.current.textContent = `Passwords don't match`;
      userNotificationRef.current.style.display = 'block'
      setTimeout(()=> (userNotificationRef.current.style.display = 'none'),5000);
    }
    else {
      try {
      const res = await axios.post(SERVER_IP+'/auth/signup', {
        uemail: signupEmailRef.current.value.trim(),
        pw1: signupPW1Ref.current.value,
        pw2: signupPW2Ref.current.value
      });
      if(res.data.code) {
        userNotificationRef.current.textContent = `Account created, Sign in now`;
        setTimeout(()=>setIsNewUser(false), 4000);
      }

    } catch {
      userNotificationRef.current.textContent = `Server error :(, try later `;
      userNotificationRef.current.style.display = 'block'
      setTimeout(()=> (userNotificationRef.current.style.display = 'none'),5000);
    }
    }
  }

  useEffect(()=> {
    console.log('debug::>',SERVER_IP,window.location.hostname);

    // IIFC
    (async()=> {
      console.log('login::IIFC::openlog:')
      try {
      const res = await axios.get(SERVER_IP+'/chat-room',
        {withCredentials: true});
        if(res.data.code && localStorage.getItem('isLoggedIn') === 'true') {
          console.log('login::IIFC::res.data.code',res.data.code)
          navigate('/sh-chat-fe/')
        }      
      } catch {
        console.log('not auth-ed');
      }
    })()
    
  },[])

  return (
    <>
      <div className='login-wrapper' style={{ background: `url(${Login_background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
        <div className='login-top-bar'>
          <select className='theme-select'>
            <option value='dark' className='theme-option'>dark</option>
            <option value='light' className='theme-option'>light</option>
          </select>
        </div>
        <div className='sh-chat-area'>
          <Sh_chat_logo />
          {/* <img src={Sh_chat_logo} className='sh-chat-logo'/> */}
          <label className='sh-chat-text'>Sh_chat!</label>
        </div>

        { !isNewUser &&
          <form className='login-ui' onSubmit={(e) => handleLogin(e)}>
          <div className='user-notification' ref={userNotificationRef} ></div> {/*make this a component*/}
          <label className='email-label'>
            Email
            <input type='email' required ref={loginEmailRef} className='login-text-box' id='login-email' />
          </label>
          <label className='password-label'>
            Password
            <input type='password' required ref={loginPWRef} className='login-text-box' id='login-password' />
          </label>
          <button type='submit' className='login-signup-submit-button' >Sign in</button>
          <p className='login-signup-switch-line'>Don't have an account? <a className='in-up-switch' onClick={()=> {setIsNewUser(true)}} >Create One!</a></p>
        </form>
        }

        { isNewUser &&
          <form className='login-ui signup' onSubmit={(e) => handleSignup(e)}>
          <div className='user-notification' ref={userNotificationRef} ></div> {/*make this a component*/}
          <label className='email-label'>
            Email
            <input type='email' required ref={signupEmailRef} className='login-text-box' id='signup-email' />
          </label>
          <label className='password-label'>
            Password
            <input type='password' required ref={signupPW1Ref} className='login-text-box' id='signup-password1' />
          </label>
          <label className='password-label retype-password-label'>
            Re-type Password
            <input type='password' required ref={signupPW2Ref} className='login-text-box' id='signup-password2' />
          </label>
          <button type='submit'  className='login-signup-submit-button' >Sign up</button>
          <p className='login-signup-switch-line'>Existing user? <a className='in-up-switch' onClick={()=> {setIsNewUser(false); console.log(isNewUser)}}>Sign in</a></p>
        </form>
        }   
        <p className='beta-warn'>This is seriously only for testing, do NOT use for ANY serious stuff <br/> Thanks, and send your suggestions  <a href='mailto:gv.kamal2003@gmail.com' id='mailto-me'>here</a> &#x2764;&#xFE0F;  </p>   
      </div>
    </>
  );
}
