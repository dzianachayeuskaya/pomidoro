import React from 'react';
import styles from './settings.module.css';
import { Text } from '../../components/Text';
import { DropList, EDropListType } from '../../components/DropList';
import { ETimeIntervalType } from '../../recoil_state';
import { Break } from '../../components/Break';

// const pomidorOptions = [900000, 1500000, 2100000];
const pomidorOptions = [10000, 1500000, 2100000];
// const shortBreakOptions = [300000, 600000, 900000];
const shortBreakOptions = [10000, 600000, 900000];
const longBreakOptions = [1200000, 1800000, 2400000];

export function Settings() {
  return (
    <>
      <Text size={16}>
        <strong>Настройте таймер под себя:</strong> выберите удобную
        продолжительность рабочего времени и перерыва из выпадающего списка для
        комфортной и продуктивной работы
      </Text>
      <Break size={25} top />

      <div className={styles.row}>
        <div className={styles.dropContainer}>
          <DropList
            options={pomidorOptions}
            type={EDropListType.settings}
            intervalType={ETimeIntervalType.pomidorTime}
            listLabel='Длительность "помидора"'
          />
        </div>

        <div className={styles.dropContainer}>
          <DropList
            options={shortBreakOptions}
            type={EDropListType.settings}
            intervalType={ETimeIntervalType.shortBreakTime}
            listLabel='Длительность короткого перерыва'
          />
        </div>

        <div className={styles.dropContainer}>
          <DropList
            options={longBreakOptions}
            type={EDropListType.settings}
            intervalType={ETimeIntervalType.longBreakTime}
            listLabel='Длительность долгого перерыва'
          />
        </div>
      </div>
    </>
  );
}
