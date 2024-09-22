import React from 'react';
import styles from './notFound.module.css';
import { Link } from 'react-router-dom';
import { Text } from '../../components/Text';
import { Break } from '../../components/Break';

export function NotFound() {
  return (
    <div className='vw100 vh100 flexCenter'>
      <div className={styles.content}>
        <Text As='h2' size={24} weight={700}>
          Nothing to see here!
        </Text>
        <Break size={20} top />
        <Text As='p' size={20}>
          404 - Page not found
        </Text>
        <Break size={25} top />
        <i>
          <Link to='/' className={styles.link}>
            Go to the posts page
          </Link>
        </i>
      </div>
    </div>
  );
}
