

import styles from './NewChatMember.module.css'

export default function NewChatMember({newChatMember, removeNewMember}) {

console.log(typeof removeNewMember)
  return(
    <>
      <div className={styles.newChatMemberWrapper}>
        <div className={styles.newChatMember}><span className='add-ellipsis'>{newChatMember}</span></div>
        <button className={styles.closeButton} onClick={()=>removeNewMember(newChatMember)}>&#10006;</button>
      </div>
    </>
  )
}