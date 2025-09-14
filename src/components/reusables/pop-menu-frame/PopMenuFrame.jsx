import { useEffect, useRef } from "react";
import styles from "./PopMenuFrame.module.css";
import { Check, X } from "lucide-react";

export default function PopMenuFrame({ children, showPopup, setShowPopup, isChatScreen }) {
  let frameRef = useRef(null)

  useEffect(()=> {
    if(frameRef.current) frameRef.current.focus();
    console.log('focussed run!')
  },[showPopup])

  return (
    <>
      {showPopup && (
        <div className={`${styles.frameWrapper} ${isChatScreen?styles.fwPaddingChatScreen:styles.fwPaddingNotChatScreen}`} ref={frameRef} tabIndex='0' autoFocus onBlur={()=> {setShowPopup(false);console.log('#16',showPopup)}}>
          <div className={styles.closeButtonWrapper}>
            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              <X />
            </button>
          </div>
          <div className={`${styles.menuItemsWrapper} ${isChatScreen?styles.menuItemsWrapperChatScreen:styles.menuItemsWrapperNotChatScreen}`}>{children}</div>
        </div>
      )}
    </>
  );
}
