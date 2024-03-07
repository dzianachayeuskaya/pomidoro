import React from 'react';
import { EColor, Text } from '../Text';
import styles from './menuitemslist.module.css';
import { EIcons, Icon } from '../Icon';

interface IMenuItemsList {
  handleIncreaseClick: () => void;
  handleDecreaseClick: () => void;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
}

export function MenuItemsList({
  handleIncreaseClick,
  handleDecreaseClick,
  handleEditClick,
  handleDeleteClick,
}: IMenuItemsList) {
  return (
    <ul className={styles.menuItemsList}>
      <li className={styles.menuItem} onClick={handleIncreaseClick}>
        <Icon name={EIcons.increase} />
        <Text size={16} color={EColor.gray99} weight={300}>
          Увеличить
        </Text>
      </li>

      <li className={styles.menuItem} onClick={handleDecreaseClick}>
        <Icon name={EIcons.decrease} />
        <Text size={16} color={EColor.gray99} weight={300}>
          Уменьшить
        </Text>
      </li>

      <li className={styles.menuItem} onClick={handleEditClick}>
        <Icon name={EIcons.edit} />
        <Text size={16} color={EColor.gray99} weight={300}>
          Редактировать
        </Text>
      </li>

      <li className={styles.menuItem} onClick={handleDeleteClick}>
        <Icon name={EIcons.delete} />
        <Text size={16} color={EColor.gray99} weight={300}>
          Удалить
        </Text>
      </li>
    </ul>
  );
}
