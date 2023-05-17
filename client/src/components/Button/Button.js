import styles from "./Button.module.scss";
import React from "react";

function Button({ buttonType, children, onClick, type }, ref) {
    
    const getButtonType = (buttonType) => {
        switch (buttonType) {
            case 'primary':
                return styles.primaryButton;
            case 'secondary':
                return styles.secondaryButton;
            case 'tertiary':
                return styles.tertiaryButton;
            default:
                return styles.button;
        }
    };

    const buttonClass = getButtonType(buttonType);

    return (
        <button type={type} className={`${buttonClass} ${styles.button}`} onClick={onClick}>
            <span className={styles.button_lg}>
                <span className={styles.button_sl}></span>
                <span className={styles.button_text}>{children}</span>
            </span>
        </button>
    );
};

export default React.forwardRef(Button)