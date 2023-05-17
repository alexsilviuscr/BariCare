import styles from "./Loader.module.scss";
import { Puff } from "react-loading-icons";

export default function Loader() {
    return (
        <div className={styles.loader}>
            <Puff stroke={"var(--accent-color)"} />
            <p>Loading...</p>
        </div>
    )
}