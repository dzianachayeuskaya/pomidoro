import React, { useEffect, useRef } from 'react';
import { EColor, Text } from '../Text';
import styles from './menuitemslist.module.css';
import { EIcons, Icon } from '../Icon';

export type Option = {
  value: string;
  handler: () => void;
  iconName: EIcons;
};

interface IMenuItemsList {
  options: Option[];
  handleKeyUpOnItem: (key: string, handler: () => void) => void;
}

export function MenuItemsList({ options, handleKeyUpOnItem }: IMenuItemsList) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus();
    }
  }, []);

  return (
    <ul className={styles.menuItemsList} ref={listRef} tabIndex={0}>
      {options.map((item) => (
        <li
          className={styles.menuItem}
          onClick={item.handler}
          onKeyUp={(e) => handleKeyUpOnItem(e.key, item.handler)}
          tabIndex={0}
          key={item.iconName}>
          <Icon name={item.iconName} />
          <Text size={16} color={EColor.gray99} weight={300}>
            {item.value}
          </Text>
        </li>
      ))}
    </ul>
  );
}
