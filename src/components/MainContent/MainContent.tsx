import React, {
  ChangeEvent,
  KeyboardEvent,
  createRef,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { ModalWindow } from '../ModalWindow';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const list = [
  'Создайте или выберите задачу, над которой хотите работать',
  'Запустите таймер («помидор»)',
  'Работайте пока «помидор» не прозвонит',
  'Сделайте короткий перерыв (3-5 минут)',
  'Продолжайте работать «помидор» за «помидором», пока задача не будет выполнена. Каждые 4 «помидора» делайте длинный перерыв (15-30 минут).'
];

export function MainContent() {
  const [taskTitle, setTaskTitle] = useRecoilState(titleState);
  const [taskList, setTaskList] = useRecoilState(taskListState);
  const navigate = useNavigate();

  const [isTouched, setIsTouched] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [activeTaskId, setActiveTaskId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const errorMessages = useRecoilValue(errorMessagesState);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.click();
  }, []);

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
        taskRef: createRef<HTMLLIElement>(),
        timerBlockRef: createRef<HTMLDivElement>(),
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

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const onDelete = () => {
    setTaskList((oldList) =>
      oldList.map((item) =>
        item.id === activeTaskId ? { ...item, isDeleted: true } : item
      )
    );
    setIsModalOpen(false);
    navigate('/');
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onTaskClick = (id: string) => {
    setActiveTaskId(id);
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.descrBlock} ref={ref}>
        <UlList title='Теперь можно начать работать:' list={list} />
        <div className={styles.taskListBlock}>
          <Break size={25} top />
          <div className={styles.inputGroup}>
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
              <div className={styles.errorMessage}>
                <Text size={12} color={EColor.grayC4}>
                  {validationError}
                </Text>
              </div>
            )}
          </div>
          <Break size={25} top />
          <button
            className='primaryBtn'
            onClick={addTask}
            disabled={!!validationError && isTouched}>
            Добавить
          </button>
          <Break size={25} top />
          <div className={styles.divider}></div>
          <TransitionGroup className={styles.taskList}>
            {taskList.map((item) => {
              const taskRef = item.taskRef;
              const refObject = {
                current:
                  taskRef instanceof Object && 'current' in taskRef
                    ? taskRef.current
                    : null,
              };

              return item.isDeleted ? null : (
                <CSSTransition
                  key={item.id}
                  nodeRef={refObject}
                  timeout={300}
                  classNames='drop'>
                  <TaskItem
                    key={item.id}
                    {...item}
                    ref={refObject}
                    onTaskClick={onTaskClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
          <div className={styles.divider}></div>
        </div>
      </div>
      <ModalWindow onClose={onCancel} isOpen={isModalOpen}>
        <Text size={24}>Удалить задачу?</Text>
        <Break size={25} top />
        <button className='secondaryBtn active' onClick={onDelete}>
          Удалить
        </button>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Отмена
        </button>
      </ModalWindow>
      <TransitionGroup className={styles.errorBlock}>
        {errorMessages.map(({ nodeRef, id, ...err }) => {
          const refObject = {
            current:
              nodeRef instanceof Object && 'current' in nodeRef
                ? nodeRef.current
                : null,
          };
          return (
            <CSSTransition
              key={id}
              nodeRef={refObject}
              timeout={300}
              classNames='drop'>
              <ErrorMessage key={id} id={id} {...err} ref={refObject} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <Outlet />
    </div>
  );
}
