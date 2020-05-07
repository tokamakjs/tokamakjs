import { css } from 'emotion';
import React from 'react';
import { Link } from 'vendor/tokamak';

const styles = {
  navbar: css`
    width: 100%;
    height: 60px;
    background: navy;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding: 0 16px;
    color: white;
  `,
  action: css`
    > a {
      color: white !important;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  `,
};

export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.action}>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
};
