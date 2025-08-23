
import { useNavigate } from 'react-router-dom';
import './Settings.css'
import axios from 'axios';
import { useContext } from 'react';
import { Context } from '../../Context';
import SettingsItem from '../../components/reusables/settings-item/SettingsItem';
import SettingsUemail from '../../components/settings-uemail/SettingsUemail';


export default function Settings() {
  const navigate = useNavigate();
  const { SERVER_IP } = useContext(Context)


  function Test() {
    return(<div style={{background:'#6fa',borderRadius:'5px', display: 'flex', alignItems:'center', justifyContent: 'center', cursor:'pointer', }} onClick={(e)=>e.target.style.background=`#${Math.floor(random)}`}>hey</div>)
  }


  return(
    <>
    <div className='settings-page-wrapper'>
      <div className='profile-pic-wrapper'>
        <img className='profile-pic-img' src='/sh-chat-fe/sh_chat_logo.svg' alt='Logo' />
        <p className='profile-name-text'>Your name</p>
      </div>
      <SettingsItem label={'label'} Component={<Test/>}/>
      <SettingsItem label={'Email'} Component={<SettingsUemail />}/>
      
    </div>
    </>
  );
}