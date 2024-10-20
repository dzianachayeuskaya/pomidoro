import React, { useState, MouseEvent } from 'react';
import styles from './stat.module.css';
import { EColor, Text } from '../../components/Text';
import { EBlockType, StatBlock } from '../../components/StatBlock';
import { Break } from '../../components/Break';
import classNames from 'classnames';
import { EIcons, Icon } from '../../components/Icon';
import {
  createArrayOfNumber,
  declOfNum,
  formatTime,
  TFormatTimeFn,
} from '../../utils/functions';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  EFilter,
  statDataState,
  summaryTimeState,
  timeIntervalState,
} from '../../recoil_state';
import { DropList, EDropListType } from '../../components/DropList';
import { numberOfPomidorsInDivision } from '../../utils/constants';

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

const activeDayOfWeek = new Date().getDay() ? new Date().getDay() - 1 : 6;

const options = [EFilter.current, EFilter.last, EFilter.beforeLast];

export function Stat() {
  const [activeDay, setActiveDay] = useState(activeDayOfWeek);

  const [{ pomidorTime }] = useRecoilState(timeIntervalState);
  const yAxixList = createArrayOfNumber(
    pomidorTime * numberOfPomidorsInDivision,
    4
  );

  const data = useRecoilValue(statDataState);

  // the scale has 5 divisions, 1 division contains 4 tomatoes
  const calculateDailyWorkPercentage = (day: EActiveDay) =>
    Math.round(
      (data[day].work * (20 / numberOfPomidorsInDivision)) / pomidorTime
    );

  const calculateFocus = (day: EActiveDay) => {
    return `${
      data[day].empty
        ? '0'
        : Math.round(data[day].completedWork / data[day].work)
    }%`;
  };
  const summaryTime = useRecoilValue(summaryTimeState);

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
        <DropList options={options} type={EDropListType.taskListFilter} />
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
                  {formatTime(
                    data[activeDay].work + data[activeDay].break,
                    TFormatTimeFn.Long
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
              const dailyPercentage = calculateDailyWorkPercentage(key);
              console.log(
                'calculateDailyWorkPercentage(key)',
                key,
                'dailyPercentage',
                dailyPercentage
              );
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
              {yAxixList.reverse().map((item) => (
                <div className={styles.yAxisItem} key={item}>
                  <Text size={12}>{formatTime(item, TFormatTimeFn.Short)}</Text>
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
          title={EBlockType.stops}
          isActive={!data[activeDay].empty}
          data={`${data[activeDay].stops}`}
        />
        <StatBlock
          title={EBlockType.summary}
          isActive={!data[activeDay].empty}
          data={formatTime(summaryTime, TFormatTimeFn.Short)}
        />
      </div>
    </div>
  );
}
