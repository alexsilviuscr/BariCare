import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./Navbar.module.scss";
import { FaBars } from "react-icons/fa";
import { useCookies } from "react-cookie";
import Button from "../Button/Button";

const pages = [
  { title: "Home", path: "/" },
  { title: "Create Recipe", path: "/create-recipe" },
  { title: "Saved Recipes", path: "/saved-recipes" },
];

export default function Navbar() {
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);

  const handleMenuClick = () => {
    setShowNav(!showNav);
  };

  const [_, setCookies] = useCookies(["access_token"]);

  const Logout = () => {
    setCookies("access_token", "")
    window.localStorage.removeItem("userID");
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <Link href="/" legacyBehavior className="logo-link">
        <div className={styles["logo-wrapper"]}>
          <Image
            className={styles.logo}
            src="/assets/baricare_logo.svg"
            alt="BariCare Logo"
            width={22.87}
            height={48}
          />
          <p className={styles["logo-p"]}>Care</p>
        </div>
      </Link>
      <div className={styles["mobile-menu-button"]} onClick={handleMenuClick}>
        <FaBars size={24} />
      </div>
      <nav className={`${styles.nav} ${showNav ? styles.showNav : ""}`}>
        <ul>
          {pages.map((page) => (
            <li key={page.title}>
              <Link href={page.path} legacyBehavior>
                <a
                  className={
                    styles.link + " " + (router.pathname === page.path ? styles.active : "")
                  }
                >
                  {page.title}
                </a>
              </Link>
            </li>
          ))}
            <li className={styles.logoutLinkSmall}>
              <Link href="/" legacyBehavior>
                <a onClick={Logout} className={styles.link}>Logout</a>
              </Link>
            </li>
            <li className={styles.logoutLinkLarge}>
                <Button onClick={Logout} buttonType="tertiary">Logout</Button>
            </li>
        </ul>
      </nav>
    </header>
  );
}
