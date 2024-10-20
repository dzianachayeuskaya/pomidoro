import React, {
  MouseEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import classNames from 'classnames';
import styles from './dropList.module.css';
import {
  EFilter,
  ETimeIntervalType,
  ITimeIntervalObject,
  taskListFilterState,
  timeIntervalState,
} from '../../recoil_state';
import { RecoilState, useRecoilState } from 'recoil';
import { CSSTransition } from 'react-transition-group';
import { formatTime, TFormatTimeFn } from '../../utils/functions';

export enum EDropListType {
  taskListFilter = 'taskListFilter',
  settings = 'settings',
}

interface IDropList {
  options: (string | number)[];
  type: EDropListType;
  intervalType?: ETimeIntervalType;
  listLabel?: string;
}

export function DropList({
  options,
  type,
  intervalType,
  listLabel,
}: IDropList) {
  const [isDropOpen, setIsDropOpen] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(0);

  const [state, setState] = useRecoilState(
    (type === EDropListType.settings
      ? timeIntervalState
      : taskListFilterState) as RecoilState<ITimeIntervalObject | EFilter>
  );

  const divRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const onSelect = (
    e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>
  ) => {
    if (e.target instanceof HTMLElement) {
      const value = e.target.getAttribute('data-value');

      if (type === EDropListType.taskListFilter) {
        setState(value as EFilter);
      } else if (type === EDropListType.settings && intervalType) {
        setState((prev: any) => ({
          ...prev,
          [intervalType]: Number(value),
        }));
      }
    }
  };

  const onSelectKeyUp = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter') {
      onSelect(e);
      setIsDropOpen(false);
    }
  };

  const onOpen = () => {
    setIsDropOpen(!isDropOpen);
  };

  const onSelectTitleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setIsDropOpen(!isDropOpen);
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
        isDropOpen
      ) {
        setIsDropOpen(false);
      }
    },
    [isDropOpen]
  );

  useEffect(() => {
    document.addEventListener('click', onDocumentClickCb);

    return () => {
      document.removeEventListener('click', onDocumentClickCb);
    };
  }, [onDocumentClickCb]);

  useEffect(() => {
    if (type === EDropListType.settings) {
      localStorage.setItem('timeIntervalObject', JSON.stringify(state));
    }
  }, [state, type]);

  return (
    <form>
      {listLabel && <div className={styles.label}>{listLabel}</div>}
      <div
        className={classNames(styles.selectWrapper, {
          [styles.isOpen]: isDropOpen,
          [styles.selectWrapperMax]: type === EDropListType.settings,
        })}
        ref={divRef}
        onClick={onOpen}>
        <div
          className={styles.selectTitle}
          tabIndex={0}
          onKeyUp={onSelectTitleKeyUp}>
          {intervalType && typeof state === 'object' && intervalType in state
            ? formatTime(state[intervalType], TFormatTimeFn.Long)
            : typeof state === 'string'
            ? state
            : 0}
        </div>
        <CSSTransition
          in={isDropOpen}
          nodeRef={listRef}
          timeout={300}
          classNames='drop'
          unmountOnExit>
          <ul className={styles.selectContent} ref={listRef}>
            {options.map((item, i) => (
              <li
                className={classNames(styles.selectItem, {
                  [styles.isActive]:
                    (intervalType &&
                    typeof state === 'object' &&
                    intervalType in state
                      ? state[intervalType]
                      : typeof state === 'string'
                      ? state
                      : 0) === item,
                  // [styles.isSelected]: selectedIndex === i,
                })}
                key={item}
                onClick={onSelect}
                onKeyUp={onSelectKeyUp}
                data-value={item}
                tabIndex={0}>
                {typeof item === 'number'
                  ? formatTime(item, TFormatTimeFn.Long)
                  : item}
              </li>
            ))}
          </ul>
        </CSSTransition>
      </div>
    </form>
  );
}
