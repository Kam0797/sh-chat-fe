
import styles from './PopMenuFrame.module.css'


export default function PopMenuFrame({children, ref}) {
  

  return(
    <>
      <div className={styles.frameWrapper} ref={ref}>
        <div className={styles.closeButtonWrapper}>
          <button className={styles.closeButton} onClick={()=> ref.current.style.display = 'none'}>
            X
          </button>
        </div>
        <div className={styles.menuItemsWrapper}>
          {children}
        </div>
      </div>
    </>
  )
}