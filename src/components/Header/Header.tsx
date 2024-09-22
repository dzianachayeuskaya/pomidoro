import React from 'react';
import styles from './header.module.css';
import { Icon, EIcons } from '../Icon';
import { Text } from '../Text';
import { Break } from '../Break';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export function Header() {
  return (
    <header className={styles.header}>
      <Link
        to='/'
        className={classNames(styles.linkContainer, styles.linkLogo)}>
        <Icon name={EIcons.logo} />
        <Break size={12} />
        <Text size={24} mobileSize={20} weight={300}>
          pomodoro_box
        </Text>
      </Link>
      <nav className={styles.nav}>
        <Link to='/statistics' className={styles.linkContainer}>
          <Icon name={EIcons.stat} />
          <Break size={4} />
          <Text size={16} optional={true}>
            Статистика
          </Text>
        </Link>
        <Link to='/info' className={styles.linkContainer}>
          <Icon name={EIcons.info} />
          <Break size={4} />
          <Text size={16} optional={true}>
            Доп. инфо
          </Text>
        </Link>
        <Link to='/settings' className={styles.linkContainer}>
          <Icon name={EIcons.settings} />
          <Break size={4} />
          <Text size={16} optional={true}>
            Настройки
          </Text>
        </Link>
      </nav>
    </header>
  );
}
