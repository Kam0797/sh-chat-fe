import axios from 'axios'
import styles from './SettingsUemail.module.css'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../Context'
import PopMenuFrame from '../reusables/pop-menu-frame/PopMenuFrame'
import { useNavigate } from 'react-router-dom'



export default function SettingsUemail() {
  const { profileData, setProfileData } = useContext(Context)
  const navigate = useNavigate();

  // let menuRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)

  const {SERVER_IP} = useContext(Context)

  async function getProfile() {
    const res = await axios.get(`${SERVER_IP}/profile`,{withCredentials:true})
    const profileDataFromServer = res.data.profile;
    setProfileData(profileDataFromServer)
  }
  async function handleLogout() {
    // if(window.confirm("Click OK to logout")) {
      const res = await axios.get(SERVER_IP+'/auth/logout',
        {withCredentials: true}
      );
      if(res.data.code) {
        localStorage.setItem('isLoggedIn',false);
        localStorage.setItem('uemail',null);
        console.log('LSlogLO::',localStorage.getItem('isLoggedIn'), localStorage.getItem('uemail'))
        navigate('/sh-chat-fe/login')
      }
  }
  useEffect(()=> {
    getProfile();
  },[])

  return(
    <>
    <div className={styles.uemailWrapper}>
      <label className={styles.uemailText}>{profileData?.uemail}</label>
      <button className={styles.optionsWrapper} onClick={()=> {setShowPopup(true);console.log('#15',showPopup)}} onBlur={()=> {setShowPopup(false);console.log('#16',showPopup)}}>
        <div className='options-dot'></div>
        <div className='options-dot'></div>
        <div className='options-dot'></div>
      </button>
      {/* <div className={styles.uemailMenuWrapper}>
        
      </div> */}
      <PopMenuFrame showPopup={showPopup} setShowPopup={setShowPopup}>
        <div className={styles.logoutButton} onClick={()=>handleLogout()}>Log out</div>
      </PopMenuFrame>
    </div>
    </>
  )
}
