import React from 'react';
import styles from './layout.module.css';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export function Layout() {
  return (
    <>
      <Header />
      <div className={styles.layout}>
        <Outlet />
      </div>
    </>
  );
}
