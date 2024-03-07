import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './taskItem.module.css';

import { ITask, taskListState } from '../../recoil_state';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from '../Dropdown';
import { EIcons, Icon } from '../Icon';
import { MenuItemsList } from '../MenuItemsList';
import { useSetRecoilState } from 'recoil';
import { Text } from '../Text';
import { Break } from '../Break';
import { ModalWindow } from '../ModalWindow';
import { ErrorMessage } from '../ErrorMessage';

export function TaskItem({ id, title, pomidorArray }: ITask) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [width, setWidth] = useState(title.length * 8);
  const setTaskList = useSetRecoilState(taskListState);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleIncreaseClick = () => {
    setTaskList((oldTaskList) =>
      oldTaskList.map((task) => {
        if (task.id === id)
          return {
            ...task,
            pomidorArray: [
              ...pomidorArray,
              {
                pomidorId: pomidorArray.length,
                isActive: false,
                break: { pomidorId: pomidorArray.length, isActive: false },
              },
            ],
          };
        return task;
      })
    );
  };

  const handleDecreaseClick = () => {
    setTaskList((oldTaskList) =>
      oldTaskList.map((task) => {
        if (task.id === id) {
          if (task.pomidorArray.length < 2) {
            setErrorMessage(
              'Если уменьшить количество помидоров, их не останется.'
            );
            return task;
          }
          return {
            ...task,
            pomidorArray: [...task.pomidorArray.slice(0, -1)],
          };
        }

        return task;
      })
    );
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.replace(/ /g, '\u00a0'));
    console.log(e.target.value.replace(/ /g, '\u00a0'));

    if (bufferRef.current) {
      setWidth(bufferRef.current.getBoundingClientRect().width);
      console.log(
        'bufferRef.current.getBoundingClientRect().width',
        bufferRef.current.getBoundingClientRect().width
      );
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const onSave = () => {
    if (value.trim().length < 3 || value.trim().length > 255) {
      setErrorMessage('Введите корректное название задачи');
      setIsEditing(true);
      inputRef.current?.focus();
      return;
    }

    setTaskList((oldTaskList) =>
      oldTaskList.map((item) => {
        if (item.id === id) {
          return { ...item, title: value.trim() };
        }
        return item;
      })
    );
    setErrorMessage('');
    setIsEditing(false);
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSave();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };
  const onDelete = () => {
    setTaskList((oldList) =>
      oldList.map((item) => {
        if (item.id === id) return { ...item, isDeleted: true };
        return item;
      })
    );
    navigate('/');
  };
  const onCancel = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   // clearInterval(timeoutIdRef);
  //   // if (errorMessage) {
  //   //    timeoutIdRef = setTimeout(() =>
  //   //   setErrorMessage(''),3000)
  //   // }
  //   // return () => {
  //   //    timeoutIdRef && clearInterval(timeoutIdRef);
  //   // }
  // }, [errorMessage]);
  return (
    <li key={id} className={styles.taskItem}>
      <Link to={`/task/${id}`}>
        <span className={styles.taskNumber}>{pomidorArray.length}</span>
        <input
          className={styles.taskValueInput}
          value={value}
          name={title}
          disabled={!isEditing}
          ref={inputRef}
          type='text'
          onChange={onChange}
          onBlur={onSave}
          onKeyUp={onKeyUp}
          style={{ width: `${width}px` }}
        />
        <div ref={bufferRef} className={styles.inputBuffer}>
          {value}
        </div>
      </Link>

      <Dropdown
        button={
          <button className={styles.menuBtn} aria-label='Выпадающее меню'>
            <Icon name={EIcons.drop} />
          </button>
        }>
        <div className={styles.dropdown}>
          <MenuItemsList
            handleIncreaseClick={handleIncreaseClick}
            handleDecreaseClick={handleDecreaseClick}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
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

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </li>
  );
}
