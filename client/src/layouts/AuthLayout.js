import styles from "@/layouts/AuthLayout.module.scss";
import { motion } from "framer-motion";

export default function Layout( { children }) {
    return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
        <div className={`flex h-screen ${styles['welcome-container']}`}>
            <div className="m-auto bg-slate-50 w-3/5 min-h-3/4 sm:h-3/4 grid lg:grid-cols-2 auth-wrapper">
                <div className={`${styles['img-style']} hidden sm:block`}>
                    <div className={styles['img-hero']}></div>
                </div>
                <div className="right flex flex-col justify-evenly">
                    <div className="text-center py-10">
                        { children }
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
    )
}