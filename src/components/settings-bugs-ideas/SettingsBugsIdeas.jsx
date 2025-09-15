import { ExternalLink } from 'lucide-react'
import styles from './SettingsBugsIdeas.module.css'


export default function SettingsBugsIdeas() {

  return(
    <>
      <div className={styles.wrapper}>
        <div className={styles.label}> 
          <div className={styles.discussIdeas}> Discuss <a className={styles.link} href='https://github.com/Kam0797/sh-chat-fe/discussions/1'> <ExternalLink size={20} /></a> </div> | <div className={styles.suggest}> Suggest <a className={styles.link} href='https://github.com/Kam0797/sh-chat-fe/issues'> <ExternalLink size={20} /></a> </div>
        </div>
      </div>
    </>
  )
}