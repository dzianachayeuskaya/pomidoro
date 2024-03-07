import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './timerblock.module.css';
import {
  IActiveInterval,
  ITask,
  ITimeInterval,
  taskListState,
  timeIntervalState,
} from '../../recoil_state';
import { EColor, Text } from '../Text';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';
import { Break } from '../Break';
import { formatTimeToStringWithColon } from '../../utils/functions';
import { ErrorMessage } from '../ErrorMessage';
import { EIcons, Icon } from '../Icon';

enum EActions {
  startTimer = 'startTimer',
  pauseTimer = 'pauseTimer',
  finishTimer = 'finishTimer',
  addPomidor = 'addPomidor',
  addPurePomidor = 'addPurePomidor',
  addBreak = 'addBreak',
  complete = 'complete',
}
interface INewProps extends Partial<ITimeInterval> {
  start?: number;
  pause?: number;
}

export function TimerBlock() {
  const { taskId } = useParams();

  const [taskList, setTaskList] = useRecoilState(taskListState);
  const [{ pomidorTime, breakTime }] = useRecoilState(timeIntervalState);

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isPomidor, setIsPomidor] = useState(true);
  const [isPomidorNew, setIsPomidorNew] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [targetTask, setTargetTask] = useState<ITask | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const [currentTime, setCurrentTime] = useState(
    isPomidor ? pomidorTime : breakTime
  );

  const changeList = useCallback(
    (action: EActions, addAction?: EActions) => {
      let newProps: INewProps = {};
      let isCompleted = false;

      switch (action) {
        case EActions.startTimer: {
          newProps = { start: Date.now(), isActive: true };
          break;
        }
        case EActions.pauseTimer: {
          newProps = { pause: Date.now(), isActive: false };
          break;
        }
        case EActions.finishTimer: {
          newProps = { finish: Date.now(), isActive: false };
          break;
        }
        case EActions.complete: {
          newProps = { finish: Date.now(), isActive: false };
          isCompleted = true;
          break;
        }
      }

      setTaskList((oldList) =>
        oldList.map((timer) => {
          if (timer.id === taskId) {
            let lastPomidor = timer.pomidorArray.at(-1);

            if (lastPomidor) {
              const newActiveIntervalArr: IActiveInterval[] =
                (isPomidor
                  ? lastPomidor.activeIntervals
                  : lastPomidor.break.activeIntervals) || [];

              if (newProps.start) {
                newProps = {
                  ...newProps,
                  activeIntervals: newActiveIntervalArr.concat({
                    start: newProps.start,
                  }),
                };

                // newProps = {
                //   ...newProps,
                //   activeIntervals: (
                //     lastPomidor.activeIntervals || newActiveIntervalArr
                //   ).concat({ start: newProps.start }),
                // };
                delete newProps.start;
              }

              if (newProps.pause) {
                // const newActiveIntervalArr: IActiveInterval[] =
                //   lastPomidor.activeIntervals || [];

                let lastActiveInterval = newActiveIntervalArr.at(-1);
                if (lastActiveInterval) {
                  lastActiveInterval = {
                    ...lastActiveInterval,
                    pause: newProps.pause,
                  };

                  newProps = {
                    ...newProps,
                    activeIntervals: [
                      ...newActiveIntervalArr.slice(0, -1),
                      lastActiveInterval,
                    ],
                  };
                  delete newProps.pause;
                }
              }

              if (
                newProps.finish && isPomidor
                  ? lastPomidor.activeIntervals?.at(-1)?.pause
                  : lastPomidor.break.activeIntervals?.at(-1)?.pause
              ) {
                newProps.finish = isPomidor
                  ? lastPomidor.activeIntervals?.at(-1)?.pause
                  : lastPomidor.break.activeIntervals?.at(-1)?.pause;
                // lastPomidor.activeIntervals?.at(-1)?.pause;
              }

              lastPomidor = isPomidor
                ? { ...lastPomidor, ...newProps }
                : {
                    ...lastPomidor,
                    break: {
                      ...lastPomidor.break,
                      ...newProps,
                    },
                  };
              const pomidorArrayWithoutLastPomidor = timer.pomidorArray.slice(
                0,
                -1
              );
              const updatedArray =
                addAction === EActions.addBreak
                  ? [
                      ...pomidorArrayWithoutLastPomidor,
                      {
                        ...lastPomidor,
                        break: {
                          pomidorId: lastPomidor.pomidorId,
                          isActive: isTimerActive,
                          activeIntervals: isTimerActive
                            ? [{ start: Date.now() }]
                            : undefined,
                        },
                      },
                    ]
                  : addAction === EActions.addPomidor ||
                    action === EActions.addPurePomidor
                  ? [
                      ...pomidorArrayWithoutLastPomidor,
                      lastPomidor,
                      {
                        pomidorId: timer.pomidorArray.length,
                        isActive: false,
                        break: {
                          pomidorId: timer.pomidorArray.length,
                          isActive: false,
                        },
                      },
                    ]
                  : [...pomidorArrayWithoutLastPomidor, lastPomidor];

              return {
                ...timer,
                pomidorArray: [...updatedArray],
                isCompleted,
              };
            }
          }
          return timer;
        })
      );
    },
    [isPomidor, setTaskList, taskId, isTimerActive]
  );

  const clearTimerIdRef = () => {
    timerIdRef.current && clearInterval(timerIdRef.current);
    timerIdRef.current = null;
  };

  const startTimer = () => {
    if (!isTimerActive) {
      changeList(EActions.startTimer);
      setIsTimerActive(true);
      if (isPause) setIsPause(false);
      if (isPomidorNew) setIsPomidorNew(false);
    }
  };

  const pauseTimer = () => {
    if (isTimerActive) {
      changeList(EActions.pauseTimer);
      clearTimerIdRef();
      setIsTimerActive(false);
      setIsPause(true);
    }
  };

  const finishTimer = useCallback(
    (action: EActions) => {
      changeList(EActions.finishTimer, action);
      clearTimerIdRef();
    },
    [changeList]
  );

  const onNext = useCallback(() => {
    finishTimer(isPomidor ? EActions.addBreak : EActions.addPomidor);
    setIsPomidor(!isPomidor);
    console.log('onNext', isPomidor);

    setCurrentTime(isPomidor ? breakTime : pomidorTime);
  }, [isPomidor, pomidorTime, breakTime, finishTimer]);

  const onDone = () => {
    finishTimer(EActions.addPomidor);
    // if (!isPomidor) {
    setIsPomidor(true);
    console.log('onDone', isPomidor);
    // }

    setCurrentTime(pomidorTime);
    setIsTimerActive(false);
    setIsPause(false);
    setIsPomidorNew(true);
  };

  const onComplete = () => {
    changeList(EActions.complete);
    clearTimerIdRef();
    setIsCompleted(true);
  };

  const addPomidor = () => {
    if (!targetTask?.isCompleted) changeList(EActions.addPurePomidor);
    else setErrorMessage('Эта задача уже завершена.');
  };

  useEffect(() => {
    const targetTask = taskList.find((task) => task.id === taskId);
    console.log('taskList', JSON.stringify(taskList), 'taskId', taskId);

    if (targetTask) {
      setTargetTask(targetTask);
      setErrorMessage('');
      const lastPomidor = targetTask.pomidorArray.at(-1);
      if (lastPomidor?.finish) {
        setIsPomidor(false);
        setIsPause(true);
      }

      // if (
      //   lastPomidor?.activeIntervals?.at(-1)?.start ||
      //   lastPomidor?.break.activeIntervals?.at(-1)?.start
      // ) {
      //   const pauseTime = isPomidor
      //     ? lastPomidor?.activeIntervals?.at(-1)?.pause
      //     : lastPomidor?.break.activeIntervals?.at(-1)?.pause;
      //   const startTime = isPomidor
      //     ? lastPomidor?.activeIntervals?.at(-1)?.start
      //     : lastPomidor?.break.activeIntervals?.at(-1)?.start;

      //   if (pauseTime && startTime && !isTimerActive) {
      //     setCurrentTime(
      //       (isPomidor ? pomidorTime : breakTime) - (pauseTime - startTime)
      //     );
      //   }
      // }
      console.log('taskList');

      if (targetTask.isCompleted) setIsCompleted(true);
    } else setErrorMessage(`Задача с id "${taskId}" не существует`);
  }, [taskList, taskId, isPomidor, pomidorTime, breakTime, isTimerActive]);

  useEffect(() => {
    if (currentTime < 1000) onNext();
    if (!timerIdRef.current && targetTask && isTimerActive)
      timerIdRef.current = setInterval(() => {
        setCurrentTime((prev) => prev - 1000);
      }, 1000);
    console.log('targetTask', targetTask, 'isTimerActive', isTimerActive);

    return () => {
      clearTimerIdRef();
    };
  }, [currentTime, onNext, targetTask, isTimerActive]);

  return (
    <>
      {targetTask && (
        <div className={styles.timerContainer}>
          <div
            className={classNames(styles.timerHeader, {
              [styles.work]:
                !isCompleted &&
                isPomidor &&
                (isTimerActive || isPause) &&
                !isPomidorNew,
              [styles.break]:
                !isCompleted && !isPomidor && (isTimerActive || isPause),
            })}>
            <Text size={16} weight={700} color={EColor.white}>
              {targetTask.title}
            </Text>
            <Text size={16} color={EColor.white}>
              {isPomidor ? 'Помидор ' : 'Перерыв '}
              {targetTask.pomidorArray.length}
            </Text>
          </div>
          <div className={styles.timerBody}>
            {isCompleted && (
              <Text size={16} weight={700}>
                Ура! Задача выполнена.
              </Text>
            )}
            {!isCompleted && (
              <>
                <div className={styles.timeContainer}>
                  <span
                    className={classNames(styles.timeSpan, [
                      {
                        [styles.work]: isPomidor && isTimerActive,
                        [styles.break]: !isPomidor && isTimerActive,
                      },
                    ])}>
                    {formatTimeToStringWithColon(currentTime)}
                  </span>
                </div>
                <button
                  className={styles.addBtn}
                  onClick={addPomidor}
                  aria-label='Добавить новый помидор'>
                  <Icon name={EIcons.add} />
                </button>
                <Break size={25} top />
                <div className={styles.actions}>
                  {!isTimerActive && !isPause && isPomidor && (
                    <button className='primaryBtn' onClick={startTimer}>
                      Старт
                    </button>
                  )}
                  {isTimerActive && (
                    <button className='primaryBtn' onClick={pauseTimer}>
                      Пауза
                    </button>
                  )}
                  {!isPause && isPomidor && (
                    <button
                      className='secondaryBtn'
                      onClick={onDone}
                      disabled={
                        !isTimerActive && targetTask.pomidorArray.length === 1
                      }>
                      Стоп
                    </button>
                  )}
                  {!isTimerActive && isPause && (
                    <button className='primaryBtn' onClick={startTimer}>
                      Продолжить
                    </button>
                  )}

                  {!isTimerActive && isPause && isPomidor && (
                    <button className='secondaryBtn' onClick={onComplete}>
                      Сделано
                    </button>
                  )}

                  {!isPomidor && (
                    <button className='secondaryBtn' onClick={onDone}>
                      Пропустить
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}
