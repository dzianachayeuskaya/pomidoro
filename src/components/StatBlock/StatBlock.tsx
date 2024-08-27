import React, { useEffect, useState } from 'react';
import styles from './statblock.module.css';
import { Text } from '../Text';
import classNames from 'classnames';
import { Break } from '../Break';
import { EIcons, Icon } from '../Icon';

enum EActiveColor {
  orange = 'orange',
  violet = 'violet',
  blue = 'blue',
}

export enum EBlockType {
  focus = 'Фокус',
  pause = 'Время на\u00A0паузе',
  stops = 'Остановки',
}
interface IStatsBlockProps {
  title: EBlockType;
  data: string;
  isActive: boolean;
}

export function StatBlock({ title, data, isActive }: IStatsBlockProps) {
  const [activeColor, setActiveColor] = useState(EActiveColor.orange);
  // const [amount, setAmount] = useState('');

  useEffect(() => {
    switch (title) {
      case EBlockType.pause:
        setActiveColor(EActiveColor.violet);
        // setAmount();
        break;
      case EBlockType.stops:
        setActiveColor(EActiveColor.blue);
        break;
      default:
        setActiveColor(EActiveColor.orange);
    }
  }, [title]);

  return (
    <div
      className={classNames(styles.block, {
        [styles[`${activeColor}`]]: isActive,
      })}>
      <div className={styles.content}>
        <div className={styles.text}>
          <Text As='h4' size={24} weight={700}>
            {title}
          </Text>
          <Break size={20} />
          <span className={styles.amount}>{data}</span>
        </div>
        <Icon
          name={
            activeColor === EActiveColor.orange
              ? EIcons.focus
              : activeColor === EActiveColor.violet
              ? EIcons.pause
              : EIcons.stops
          }
        />
      </div>
    </div>
  );
}
