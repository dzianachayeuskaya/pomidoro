import React from 'react';
import styles from './header.module.css';
import { Icon, EIcons } from '../Icon';
import { Text } from '../Text';
import { Break } from '../Break';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className={styles.header}>
      <Link to='/' className={styles.linkContainer}>
        <Icon name={EIcons.logo} />
        <Break size={12} />
        <Text size={24} weight={300}>
          pomodoro_box
        </Text>
      </Link>
      <Link to='/statistics' className={styles.linkContainer}>
        <Icon name={EIcons.stat} />
        <Break size={4} />
        <Text size={16}>Статистика</Text>
      </Link>
    </header>
  );
}
