import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './Logo.module.scss';

export default function Logo({ href = null }) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div
      className={`flex mx-auto justify-center ${
        href ? 'cursor-pointer' : 'cursor-default'
      }`}
      role="button"
      tabIndex={0}
      aria-label="BariCare Logo Button"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick();
        }
      }}
    >
      {href ? (
        <Link href={href}>
          <div className={styles['logo-wrapper']}>
            <Image
              className={styles['logo']}
              src="/assets/baricare_logo.svg"
              alt="BariCare Logo"
              width={22.87}
              height={48}
            />
            <p className={styles['logo-p']}>Care</p>
          </div>
        </Link>
      ) : (
        <div className={styles['logo-wrapper']}>
          <Image
            className={styles['logo']}
            src="/assets/baricare_logo.svg"
            alt="BariCare Logo"
            width={22.87}
            height={48}
          />
          <p className={styles['logo-p']}>Care</p>
        </div>
      )}
    </div>
  );
}
