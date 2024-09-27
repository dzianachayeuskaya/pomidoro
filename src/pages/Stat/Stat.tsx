import React, { useState, MouseEvent } from 'react';
import styles from './stat.module.css';
import { EColor, Text } from '../../components/Text';
import { EBlockType, StatBlock } from '../../components/StatBlock';
import { Break } from '../../components/Break';
import classNames from 'classnames';
import { EIcons, Icon } from '../../components/Icon';
import { declOfNum, formatTimeToStringWithWord } from '../../utils/functions';
import { useRecoilValue } from 'recoil';
import {  EFilter, statDataState } from '../../recoil_state';
import { DropList, EDropListType } from '../../components/DropList';

enum EActiveDay {
  mon,
  tue,
  wed,
  th,
  fr,
  sat,
  sun,
}

const daysList = [
  { key: EActiveDay.mon, short: 'ПН', long: 'Понедельник' },
  { key: EActiveDay.tue, short: 'ВТ', long: 'Вторник' },
  { key: EActiveDay.wed, short: 'СР', long: 'Среда' },
  { key: EActiveDay.th, short: 'ЧТ', long: 'Четверг' },
  { key: EActiveDay.fr, short: 'ПТ', long: 'Пятница' },
  { key: EActiveDay.sat, short: 'СБ', long: 'Суббота' },
  { key: EActiveDay.sun, short: 'ВС', long: 'Воскресение' },
];

const yAxixList = ['1 ч 40 мин', '1 ч 15 мин', '50 мин', '25 мин'];

const activeDayOfWeek = new Date().getDay() ? new Date().getDay() - 1 : 6;

const options = [EFilter.current, EFilter.last, EFilter.beforeLast];

export function Stat() {
  const [activeDay, setActiveDay] = useState(activeDayOfWeek);

  const data = useRecoilValue(statDataState);

  const calculateDailyWorkPercentage = (day: EActiveDay) => {
    const activityPercentage = data[day].work / (2 * 60 * 60);
    return Math.round(activityPercentage);
  };

  const calculateFocus = (day: EActiveDay) => {
    return `${
      data[day].empty
        ? '0'
        : Math.round(data[day].completedWork / data[day].work)
    }%`;
  };

  const calculatePause = (day: EActiveDay) => {
    return ``;
  };

  const onBarClick = (e: MouseEvent<HTMLDivElement>) => {
    const dayShort = e.currentTarget.getAttribute('data-value');
    if (dayShort) {
      const day = daysList.findIndex((day) => day.short === dayShort);
      setActiveDay(day);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Text As='h3' size={24} weight={700}>
          Ваша активность
        </Text>
        <DropList
          options={options}
          type={EDropListType.taskListFilter}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.aside}>
          <div className={classNames(styles.block, styles.activityBlock)}>
            <Text As='h4' size={24} weight={700}>
              {daysList[activeDay].long}
            </Text>
            <Break size={12} top />
            {data[activeDay].empty && <Text size={16}>Нет данных</Text>}
            {!data[activeDay].empty && (
              <span className={styles.activityBlockContent}>
                <span>Вы работали над задачами в течение </span>
                <span className={styles.activeTime}>
                  {formatTimeToStringWithWord(
                    data[activeDay].work + data[activeDay].break
                  )}
                </span>
              </span>
            )}
          </div>
          <div
            className={classNames(styles.block, styles.pomidorBlock, {
              [styles.center]: data[activeDay].empty,
            })}>
            {data[activeDay].empty && <Icon name={EIcons.happyTomato} />}
            {!data[activeDay].empty && (
              <>
                <div className={styles.pomidorBlockMain}>
                  <Icon name={EIcons.logo} size={80} />
                  <Break size={16} />
                  <Text size={24} weight={700} color={EColor.gray99}>
                    x {data[activeDay].pomidorCount}
                  </Text>
                </div>
                <div className={styles.pomidorBlockCounter}>
                  <Text size={24} weight={700} color={EColor.white}>
                    {data[activeDay].pomidorCount}{' '}
                    {declOfNum(data[activeDay].pomidorCount, [
                      'помидор',
                      'помидора',
                      'помидоров',
                    ])}
                  </Text>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <div className={styles.chartContentWrapper}>
            {daysList.map(({ key, short }) => {
              console.log(
                'calculateDailyWorkPercentage(key)',
                calculateDailyWorkPercentage(key)
              );
              const dailyPercentage = calculateDailyWorkPercentage(key);
              return (
                <div
                  className={styles.barWrapper}
                  key={short}
                  data-value={short}
                  onClick={onBarClick}>
                  <div
                    className={classNames(styles.barItem, {
                      [styles.active]: key === activeDay,
                      [styles.passive]: !dailyPercentage,
                    })}>
                    <div style={{ height: `${dailyPercentage || 1}%` }}></div>
                  </div>
                  <div
                    className={classNames(styles.xAxisItem, {
                      [styles.active]: key === activeDay,
                    })}>
                    <Text size={24}>{short}</Text>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.backgroundWrapper}>
            <div className={styles.background}>
              <div className={styles.horBar}></div>
              <div className={styles.horBar}></div>
              <div className={styles.horBar}></div>
              <div className={styles.horBar}></div>
              <div className={styles.horBar}></div>
            </div>
            <div className={styles.yAxis}>
              {yAxixList.map((item) => (
                <div className={styles.yAxisItem} key={item}>
                  <Text size={12}>{item}</Text>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.xAxis}></div>
        </div>
      </div>
      <div className={styles.footer}>
        <StatBlock
          title={EBlockType.focus}
          isActive={!data[activeDay].empty}
          data={calculateFocus(activeDay)}
        />
        <StatBlock
          title={EBlockType.pause}
          isActive={!data[activeDay].empty}
          data={calculatePause(activeDay)}
        />
        <StatBlock
          title={EBlockType.stops}
          isActive={!data[activeDay].empty}
          data={`${data[activeDay].stops}`}
        />
      </div>
    </div>
  );
}
