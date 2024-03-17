import React from 'react';
import { EColor, Text } from '../Text';
import styles from './menuitemslist.module.css';
import { EIcons, Icon } from '../Icon';

export type Option = {
  value: string;
  handler: () => void;
  iconName: EIcons;
};

export function MenuItemsList({ options }: { options: Option[] }) {
  return (
    <ul className={styles.menuItemsList} tabIndex={0}>
      {options.map((item) => (
        <li className={styles.menuItem} onClick={item.handler}>
          <Icon name={item.iconName} />
          <Text size={16} color={EColor.gray99} weight={300}>
            {item.value}
          </Text>
        </li>
      ))}
    </ul>
  );
}
