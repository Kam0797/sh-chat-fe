import { useEffect, useRef } from "react";
import styles from "./PopMenuFrame.module.css";

export default function PopMenuFrame({ children, showPopup, setShowPopup }) {
  let frameRef = useRef(null)

  useEffect(()=> {
    if(frameRef.current) frameRef.current.focus();
    console.log('focussed run!')
  },[showPopup])

  return (
    <>
      {showPopup && (
        <div className={styles.frameWrapper} ref={frameRef} tabIndex='0' autoFocus onBlur={()=> {setShowPopup(false);console.log('#16',showPopup)}}>
          <div className={styles.closeButtonWrapper}>
            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              X
            </button>
          </div>
          <div className={styles.menuItemsWrapper}>{children}</div>
        </div>
      )}
    </>
  );
}
