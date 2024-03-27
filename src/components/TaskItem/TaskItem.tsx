import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './taskItem.module.css';

import {
  EMessageKind,
  ITask,
  errorMessagesState,
  taskListState,
} from '../../recoil_state';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from '../Dropdown';
import { EIcons, Icon } from '../Icon';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Text } from '../Text';
import { Break } from '../Break';
import { ModalWindow } from '../ModalWindow';
import classNames from 'classnames';
import { MenuItemsList, Option } from '../MenuItemsList';
import { returnNewErrorMessages } from '../../utils/functions';

export function TaskItem({ id, title, pomidorArray, isCompleted }: ITask) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [width, setWidth] = useState(title.length * 8);
  const setTaskList = useSetRecoilState(taskListState);
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useRecoilState(errorMessagesState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.trim().length > 2 && e.target.value.trim().length <= 255)
      setErrorMessages((prev) =>
        prev.filter((err) => err.kind !== EMessageKind.taskEdition)
      );
  };

  const onSave = () => {
    if (value.trim().length < 3 || value.trim().length > 255) {
      if (!errorMessages.find((err) => err.kind === EMessageKind.taskEdition))
        setErrorMessages((prev) =>
          returnNewErrorMessages(
            EMessageKind.taskEdition,
            'Введите корректное название задачи',
            prev
          )
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
    setErrorMessages((prev) =>
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleIncreaseClick = () => {
    setErrorMessages((prev) =>
      prev.filter((err) => err.kind !== EMessageKind.pomidorAdding)
    );
    if (isCompleted) {
      setErrorMessages((prev) =>
        returnNewErrorMessages(
          EMessageKind.pomidorAdding,
          'Выполнение задачи завершено.',
          prev
        )
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
  };

  const handleDecreaseClick = () => {
    if (
      pomidorArray.length < 2 ||
      pomidorArray.at(-1)?.activeIntervals?.[0].start
    ) {
      setErrorMessages((prev) =>
        returnNewErrorMessages(
          EMessageKind.pomidorDeleting,
          pomidorArray.length < 2
            ? 'Если уменьшить количество "помидоров", их не останется.'
            : 'Возможно удаление только тех "помидоров", работа с которыми еще не начиналась.',
          prev,
          true
        )
      );
      return;
    }

    setErrorMessages((prev) =>
      prev.filter((err) => err.kind !== EMessageKind.pomidorDeleting)
    );

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
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const onDelete = () => {
    setTaskList((oldList) =>
      oldList.map((item) =>
        item.id === id ? { ...item, isDeleted: true } : item
      )
    );
    navigate('/');
  };

  const onCancel = () => {
    setIsModalOpen(false);
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
    { value: 'Редактировать', handler: handleEditClick, iconName: EIcons.edit },
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
      className={classNames(styles.taskItem, {
        [styles.isEditable]: isEditing,
      })}>
      <Link to={`/task/${id}`}>
        <span className={styles.taskNumber}>{pomidorArray.length}</span>
        <div
          className={styles.taskValueWrapper}
          style={{ width: `${width + 8}px` }}>
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

      {isModalOpen && (
        <ModalWindow onClose={onCancel}>
          <Text size={24}>Удалить задачу?</Text>
          <Break size={25} top />
          <button className='secondaryBtn active' onClick={onDelete}>
            Удалить
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Отмена
          </button>
        </ModalWindow>
      )}
    </li>
  );
}
