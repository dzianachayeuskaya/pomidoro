import React, {
  MouseEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import classNames from 'classnames';
import styles from './filterList.module.css';
import { EFilter, taskListFilterState } from '../../recoil_state';
import { useRecoilState } from 'recoil';

interface IFilterList {
  options: EFilter[];
}

export function FilterList({ options }: IFilterList) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(0);
  const [taskListFilter, setTaskListFilter] =
    useRecoilState(taskListFilterState);
  const divRef = useRef<HTMLDivElement>(null);

  const onSelect = (
    e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>
  ) => {
    if (e.target instanceof HTMLElement) {
      setTaskListFilter(e.target.getAttribute('data-value') as EFilter);
    }
  };

  const onSelectKeyUp = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter') {
      onSelect(e);
      setIsFilterOpen(false);
    }
  };

  const onFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const onSelectTitleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setIsFilterOpen(!isFilterOpen);
    }
    // if (e.key === 'ArrowDown') {
    //   e.preventDefault();
    //   setSelectedIndex((prevIndex) =>
    //     prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
    //   );
    //   console.log(
    //     selectedIndex < options.length - 1 ? selectedIndex + 1 : selectedIndex
    //   );
    // } else if (e.key === 'ArrowUp') {
    //   e.preventDefault();
    //   setSelectedIndex((prevIndex) =>
    //     prevIndex > 0 ? prevIndex - 1 : prevIndex
    //   );
    //   console.log(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex);
    // } else if (e.key === 'Enter' && selectedIndex !== -1) {
    // }
  };

  const onDocumentClickCb = useCallback(
    (e: globalThis.MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !divRef.current?.contains(e.target) &&
        isFilterOpen
      ) {
        setIsFilterOpen(false);
      }
    },
    [isFilterOpen]
  );

  useEffect(() => {
    document.addEventListener('click', onDocumentClickCb);

    return () => {
      document.removeEventListener('click', onDocumentClickCb);
    };
  }, [onDocumentClickCb]);

  return (
    <form>
      <div
        className={classNames(styles.selectWrapper, {
          [styles.isOpen]: isFilterOpen,
        })}
        ref={divRef}
        onClick={onFilterOpen}>
        <div
          className={styles.selectTitle}
          tabIndex={0}
          onKeyUp={onSelectTitleKeyUp}>
          {taskListFilter}
        </div>
        <ul className={styles.selectContent}>
          {options.map((item, i) => (
            <li
              className={classNames(styles.selectItem, {
                [styles.isActive]: taskListFilter === item,
                // [styles.isSelected]: selectedIndex === i,
              })}
              key={item}
              onClick={onSelect}
              onKeyUp={onSelectKeyUp}
              data-value={item}
              tabIndex={0}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
