import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import styles from './mainContent.module.css';
import { UlList } from '../UlList';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  errorMessagesState,
  taskListState,
  titleState,
} from '../../recoil_state';
import { Break } from '../Break';
import { Outlet, useNavigate } from 'react-router-dom';
import { getRandomAlphanumericString } from '../../utils/functions';
import { TaskItem } from '../TaskItem';
import { EColor, Text } from '../Text';
import { ErrorMessage } from '../ErrorMessage';

const list = [
  'Выберите категорию и напишите название текущей задачи',
  'Запустите таймер («помидор»)',
  'Работайте пока «помидор» не прозвонит',
  'Сделайте короткий перерыв (3-5 минут)',
  'Продолжайте работать «помидор» за «помидором», пока задача не будет выполнена. Каждые 4 «помидора» делайте длинный перерыв (15-30 минут).',
];

export function MainContent() {
  const [taskTitle, setTaskTitle] = useRecoilState(titleState);
  const [taskList, setTaskList] = useRecoilState(taskListState);
  const navigate = useNavigate();

  const [isTouched, setIsTouched] = useState(false);
  const [validationError, setValidationError] = useState('');
  const errorMessages = useRecoilValue(errorMessagesState);

  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }, [taskList]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setTaskTitle(currentValue);
    if (isTouched && currentValue.length >= 3 && currentValue.length <= 255)
      setValidationError('');
    else if (isTouched)
      setValidationError('Введите корректное название задачи');
  };

  const addTask = () => {
    if (taskTitle.trim().length < 3 || taskTitle.trim().length > 255) {
      setIsTouched(true);
      setValidationError('Введите корректное название задачи');
      return;
    }

    setValidationError('');
    const taskId = getRandomAlphanumericString(8);
    setTaskList((oldTaskList) => [
      {
        id: taskId,
        title: taskTitle.trim(),
        pomidorArray: [
          {
            pomidorId: 0,
            isActive: false,
            isCurrent: true,
            break: { pomidorId: 0, isActive: false },
          },
        ],
        isCompleted: false,
        isDeleted: false,
      },
      ...oldTaskList,
    ]);
    setTaskTitle('');

    navigate(`/task/${taskId}`);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleBlur = () => {
    if (!taskTitle) {
      setIsTouched(false);
      setValidationError('');
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.descrBlock}>
        <UlList title='Ура! Теперь можно начать работать:' list={list} />
        <div className={styles.taskListBlock}>
          <Break size={25} top />
          <input
            type='text'
            name='title'
            className={styles.input}
            placeholder='Название задачи'
            value={taskTitle}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            aria-invalid={validationError ? 'true' : undefined}
          />
          {validationError && (
            <Text size={12} color={EColor.grayC4}>
              {validationError}
            </Text>
          )}

          <Break size={25} top />
          <button
            className='primaryBtn'
            onClick={addTask}
            disabled={!!validationError && isTouched}>
            Добавить
          </button>

          <Break size={25} top />
          {!!taskList.length && (
            <ul className={styles.taskList}>
              {taskList.map((item) =>
                item.isDeleted ? null : <TaskItem key={item.id} {...item} />
              )}
              <div className={styles.divider}> </div>
            </ul>
          )}
        </div>
      </div>

      {!!errorMessages.length && (
        <div className={styles.errorBlock}>
          {errorMessages.map((err) => (
            <ErrorMessage key={err.id} {...err} />
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
