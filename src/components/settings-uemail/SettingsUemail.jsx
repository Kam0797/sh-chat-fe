import axios from 'axios'
import styles from './SettingsUemail.module.css'
import { useContext, useEffect } from 'react'
import { Context } from '../../Context'


export default function SettingsUemail() {
  const { profileData, setProfiledata } = useContext(Context)

  const {SERVER_IP} = useContext(Context)

  async function getProfile() {
    const res = await axios.get(`${SERVER_IP}/chat-room`,{withCredentials:true})
    const profileDataFromServer = res.profileData;
    setProfiledata(profileDataFromServer)
  }
  useEffect(()=> {
    getProfile();
  },[profileData])

  return(
    <>
    <div className={styles.uemailWrapper}>
      <label className={styles.uemailText}>{profileData.uemail}</label>
      <button className={styles.optionsWrapper}>
        <div className='options-dot'></div>
        <div className='options-dot'></div>
        <div className='options-dot'></div>
      </button>
      {/* <div className={styles.uemailMenuWrapper}>
        
      </div> */}
    </div>
    </>
  )
}
