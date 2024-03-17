import React, { MouseEvent, useState } from 'react';
import classNames from 'classnames';
import styles from './filterList.module.css';
import { EFilter, taskListFilterState } from '../../recoil_state';
import { useRecoilState } from 'recoil';

interface IFilterList {
  options: EFilter[];
}

export function FilterList({ options }: IFilterList) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [taskListFilter, setTaskListFilter] =
    useRecoilState(taskListFilterState);

  const onSelect = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      setTaskListFilter(e.target.getAttribute('data-value') as EFilter);
    }
  };

  const onFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  return (
    <form>
      <div
        className={classNames(styles.selectWrapper, {
          [styles.isOpen]: isFilterOpen,
        })}
        onClick={onFilterOpen}>
        <div className={styles.selectTitle}>{taskListFilter}</div>
        <div className={styles.selectContent}>
          {options.map((item) => (
            <div
              className={classNames(styles.selectLabel, {
                [styles.isActive]: taskListFilter === item,
              })}
              key={item}
              onClick={onSelect}
              data-value={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
