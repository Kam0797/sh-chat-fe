
import { useNavigate } from 'react-router-dom';
import './Settings.css'
import axios from 'axios';
import { useContext } from 'react';
import { Context } from '../../Context';
import SettingsItem from '../../components/reusables/settings-item/SettingsItem';
import SettingsUemail from '../../components/settings-uemail/SettingsUemail';


export default function Settings() {
  const navigate = useNavigate();
  const { SERVER_IP, profileData } = useContext(Context)





  return(
    <>
    <div className='settings-page-wrapper'>
    <div className='profile-pic-wrapper'>
    <button className='settings-back-button' onClick={()=> {navigate('/sh-chat-fe/')}} >&#x21A9;</button>
        <img className='profile-pic-img' src='/sh-chat-fe/sh_chat_logo.svg' alt='Logo' />
        <p className='profile-name-text'>{profileData?.nickname}</p>
      </div>
      <SettingsItem label={'Email'} Component={<SettingsUemail />}/>
      
    </div>
    </>
  );
}