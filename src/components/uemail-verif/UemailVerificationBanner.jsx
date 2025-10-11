import { useContext } from 'react'
import './UemailVerificationBanner.css'
import { Context } from '../../Context'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UemailVerificationBanner() {
  const navigate = useNavigate();

  const {setShowUemailVerif, SERVER_IP} = useContext(Context)

  const uemail = sessionStorage.getItem('email');
  if(!uemail) navigate(`/sh-chat-fe/login`);
    const uemailHead = uemail.slice(0,2);
    const uemailTail = uemail.split('@')[0].slice(-2,)
    const uemailEnd = uemail.split('@')[1]
  

    return(
      <>
      <div className='uemail-verif-wrapper'>
        <div className='uemail-verif-banner'>
          <button className='close-button' onClick={()=> setShowUemailVerif(false)}>CLOSE X</button>
          <h2>Verify your Email</h2>  
          <p> We've sent an email to {uemailHead}****{uemailTail}@{uemailEnd}</p>
          <p>Please check your mailbox!</p>
          <br />
          <p>Click the 'Verify email' button to verify your email address</p>   
          <p>This helps is account recovery if you happened to get locked out</p>  
          <br /> 
          <p>If you are done verifying, click the button below</p>
          <br/>
          <button className='verified-button' onClick={() => {
            axios.get(`${SERVER_IP}/updateToken`, {withCredentials: true})
          }}>Complete email verification</button>
        </div>  
      </div>
      </>
    )
}