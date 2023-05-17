import Logo from "../Logo/Logo";
import { useRouter } from "next/router";
import styles  from "./Footer.module.scss";
import { motion } from "framer-motion";

export default function Footer() {

    const router = useRouter();

    return (
        <>
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut"
              }}
            >
                <footer className={`bg-white rounded-lg shadow dark:bg-gray-900 ${styles.footer}`}>
                    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <Logo />
                            </div>
                            <ul className={`flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 justify-center ${styles.nav}`}>
                                <li>
                                    <a onClick={() => router.push("/")} id="home" className="mr-4 md:mr-6 cursor-pointer">Home</a>
                                </li>
                                <li>
                                    <a onClick={() => router.push("/create-recipe")} id="create-recipe" className="mr-4 md:mr-6 cursor-pointer">Create Recipe</a>
                                </li>
                                <li>
                                    <a onClick={() => router.push("/saved-recipes")} id="saved-recipes" className="mr-4 md:mr-6 cursor-pointer">Saved Recipes</a>
                                </li>
                            </ul>
                        </div>
                        <hr className={`my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8 ${styles.border}`} />
                        <span className={`block text-sm text-gray-500 sm:text-center justify-center dark:text-gray-400 ${styles.copyright}`}>© 2023 BariCare - Silviu. All Rights Reserved.</span>
                    </div>
                </footer>
            </motion.div>
        </>
    )
}