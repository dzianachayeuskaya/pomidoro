import React, {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './taskItem.module.css';

import {
  EMessageKind,
  EMessageType,
  ITask,
  messagesState,
  taskListState,
} from '../../recoil_state';
import { Link } from 'react-router-dom';
import { Dropdown } from '../Dropdown';
import { EIcons, Icon } from '../Icon';
import { useRecoilState, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import { MenuItemsList, Option } from '../MenuItemsList';
import { returnNewMessages } from '../../utils/functions';

interface ITaskItemProps {
  onTaskClick: (id: string) => void;
  handleDeleteClick: () => void;
}

interface ITaskItem extends ITask, ITaskItemProps {}

export const TaskItem = forwardRef<HTMLLIElement, ITaskItem>(
  (
    { id, title, pomidorArray, isCompleted, onTaskClick, handleDeleteClick },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const bufferRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(title);
    const [width, setWidth] = useState(title.length * 8);
    const setTaskList = useSetRecoilState(taskListState);
    const [messages, setMessages] = useRecoilState(messagesState);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (
        e.target.value.trim().length > 2 &&
        e.target.value.trim().length <= 255
      )
        setMessages((prev) =>
          prev.filter((err) => err.kind !== EMessageKind.taskEdition)
        );
    };

    const onSave = () => {
      if (value.trim().length < 3 || value.trim().length > 255) {
        if (!messages.find((err) => err.kind === EMessageKind.taskEdition))
          setTimeout(
            () =>
              setMessages((prev) =>
                returnNewMessages(
                  EMessageKind.taskEdition,
                  EMessageType.error,
                  'Введите корректное название задачи',
                  prev
                )
              ),
            300
          );
        setIsEditing(true);
        inputRef.current?.focus();
        return;
      }

      setTaskList((oldTaskList) =>
        oldTaskList.map((item) =>
          item.id === id ? { ...item, title: value.trim() } : item
        )
      );
      setMessages((prev) =>
        prev.filter((err) => err.kind !== EMessageKind.taskEdition)
      );
      setIsEditing(false);
      setValue(value.trim());
    };

    const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onSave();
    };

    useEffect(() => {
      if (isEditing && inputRef.current) inputRef.current.focus();
    }, [isEditing]);

    useEffect(() => {
      if (bufferRef.current) {
        setWidth(bufferRef.current.getBoundingClientRect().width);
      }
    }, [value]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleIncreaseClick = () => {
      setMessages((prev) =>
        prev.filter((err) => err.kind !== EMessageKind.pomidorAdding)
      );
      if (isCompleted) {
        setTimeout(
          () =>
            setMessages((prev) =>
              returnNewMessages(
                EMessageKind.pomidorAdding,
                EMessageType.error,
                'Выполнение задачи завершено.',
                prev
              )
            ),
          300
        );
        return;
      }

      setTaskList((oldTaskList) =>
        oldTaskList.map((task) =>
          task.id === id
            ? {
                ...task,
                pomidorArray: [
                  ...pomidorArray,
                  {
                    pomidorId: pomidorArray.length,
                    isActive: false,
                    isCurrent: false,
                    break: { pomidorId: pomidorArray.length, isActive: false },
                  },
                ],
              }
            : task
        )
      );
      setTimeout(
        () =>
          setMessages((prev) =>
            returnNewMessages(
              EMessageKind.pomidorAdding,
              EMessageType.success,
              '"Помидор" успешно добавлен.',
              prev
            )
          ),
        300
      );
    };

    const handleDecreaseClick = () => {
      setMessages((prev) =>
        prev.filter((err) => err.kind !== EMessageKind.pomidorDeleting)
      );

      let errorMessage = '';
      if (isCompleted) {
        errorMessage = 'Выполнение задачи завершено.';
      } else if (pomidorArray.length < 2) {
        errorMessage =
          'Если уменьшить количество "помидоров", их не останется.';
      } else if (pomidorArray.at(-1)?.activeIntervals?.[0].start) {
        errorMessage =
          'Возможно удаление только тех "помидоров", работа с которыми еще не начиналась.';
      }

      if (errorMessage) {
        setTimeout(
          () =>
            setMessages((prev) =>
              returnNewMessages(
                EMessageKind.pomidorDeleting,
                EMessageType.error,
                errorMessage,
                prev
              )
            ),
          300
        );
        return;
      }

      setTaskList((oldTaskList) =>
        oldTaskList.map((task) =>
          task.id === id
            ? {
                ...task,
                pomidorArray: [...task.pomidorArray.slice(0, -1)],
              }
            : task
        )
      );
      setTimeout(
        () =>
          setMessages((prev) =>
            returnNewMessages(
              EMessageKind.pomidorDeleting,
              EMessageType.success,
              'Количество "помидоров" уменьшено.',
              prev
            )
          ),
        300
      );
    };

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const options: Option[] = [
      {
        value: 'Увеличить',
        handler: handleIncreaseClick,
        iconName: EIcons.increase,
      },
      {
        value: 'Уменьшить',
        handler: handleDecreaseClick,
        iconName: EIcons.decrease,
      },
      {
        value: 'Редактировать',
        handler: handleEditClick,
        iconName: EIcons.edit,
      },
      { value: 'Удалить', handler: handleDeleteClick, iconName: EIcons.delete },
    ];

    const onOpen = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const onClose = () => {
      setIsDropdownOpen(false);
    };

    const handleKeyUpOnItem = (key: string, handler: () => void) => {
      if (key === 'Enter') {
        handler();
        setIsDropdownOpen(false);
      }
    };

    return (
      <li
        key={id}
        ref={ref}
        className={classNames(styles.taskItem, {
          [styles.isEditable]: isEditing,
        })}
        onClick={onTaskClick.bind(null, id)}>
        <Link to={`/task/${id}`}>
          <span className={styles.taskNumber}>{pomidorArray.length}</span>
          <div
            className={styles.taskValueWrapper}
            style={{ width: `${width + 18}px` }}>
            <input
              className={styles.taskValueInput}
              ref={inputRef}
              value={value}
              name={title}
              disabled={!isEditing}
              type='text'
              onChange={onChange}
              onBlur={onSave}
              onKeyUp={onKeyUp}
            />
          </div>
          <div ref={bufferRef} className={styles.inputBuffer}>
            {value.replace(/ /g, '\u00a0')}
          </div>
        </Link>

        <Dropdown
          button={
            <button className={styles.menuBtn} aria-label='Выпадающее меню'>
              <Icon name={EIcons.drop} />
            </button>
          }
          isOpen={isDropdownOpen}
          onOpen={onOpen}
          onClose={onClose}>
          <div className={styles.dropdown}>
            <MenuItemsList
              options={options}
              handleKeyUpOnItem={handleKeyUpOnItem}
            />
          </div>
        </Dropdown>
      </li>
    );
  }
);
