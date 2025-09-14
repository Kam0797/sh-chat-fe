import { ExternalLink } from 'lucide-react'
import styles from './SettingsLicense.module.css'

export default function SettingsLicence() {

  return(
    <>
    <div className={styles.licenseWrapper}>
      <div className={`${styles.licenseLabel} f-nunito`}>GPL v3.0</div>
      <a href='https://github.com/Kam0797/sh-chat-fe/blob/main/LICENSE' className={styles.link}><ExternalLink size={20} /> </a>
    </div>
    </>
  )
}