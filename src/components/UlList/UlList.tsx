import React from 'react';
import styles from './ulList.module.css';
import { Text } from '../Text';

interface IUlListProps {
  title?: string;
  list: string[];
}

export function UlList({ title, list }: IUlListProps) {
  return (
    <>
      <Text As='h3' size={24} weight={700}>
        {title}
      </Text>
      <ul>
        {list.map((item) => (
          <li className={styles.item} key={item.slice(0, 5)}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
