import styles from './SettingsTheme.module.css'

import { themeHandler } from '../../utils/utils'
import { useContext, useEffect, useState } from 'react'
import PopMenuFrame from '../reusables/pop-menu-frame/PopMenuFrame'

export default function SettingsTheme() {

  // const [themeState, setThemeState] = useState(themeHandler())

  const themes = themeHandler(undefined, true);
  // const [currentTheme, setCurrentTheme] = useState(themeHandler() || 'System')
  const [showPopup, setShowPopup] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themes.get(themeHandler()).name)

  useEffect(()=> {
    setCurrentTheme(themes.get(themeHandler()).name)
  },[currentTheme])

  return(
    <div className={styles.themeWrapper}>
      <div className={`${styles.themeName} f-nunito`}>{currentTheme}</div>
      <button className={styles.themePrev} onClick={()=>setShowPopup(true)}>
        <span className={`${styles.themePrevText} f-nunito`} >Sh-chat</span>
      </button>
      <PopMenuFrame showPopup={showPopup} setShowPopup={setShowPopup}>
        {
          [...themes].map(theme => (
            <div key={theme[0]} className={`${styles.themeWrapper} ${styles.themeWrapperModsForFrame}`} onClick={()=>setCurrentTheme(themeHandler(theme[0]))}>
              <div className={`${styles.themeName} f-nunito`}>{theme[1].name}</div>
              <div className={styles.themePrev}  style={{background: theme[1].bg}} >
                <span className={`${styles.themePrevText} f-nunito`} style={{color: theme[1].text}} >Sh-chat</span>
              </div>
            </div>
          ))
        }
      </PopMenuFrame>
    </div>
  )
}