import styles from "./PopMenuFrame.module.css";

export default function PopMenuFrame({ children, showPopup, setShowPopup }) {
  return (
    <>
      {showPopup && (
        <div className={styles.frameWrapper}>
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
