
import './Login.css'
// import Telegram_logo from '../../assets/icons/Telegram_logo.png';
import Login_background from '../../assets/background-images/login_bg1.webp'
import Sh_chat_logo from '../../assets/icons/sh_chat_logo.svg?react'

export default function Login() {

  return(
  <>
    <div className='login-wrapper' style={{background: `url(${Login_background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
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
     <div className='login-ui'>
        <label className='email-label'>
          Email
          <input type='email' className='login-text-box' id='login-email' />
        </label>
        <label className='password-label'>
          Password    
          <input type='password' className='login-text-box' id='login-password' />
        </label>
      <button type='submit' id='login-submit' >Sign in</button>
    </div>
  </div>
  </>
  );
}
