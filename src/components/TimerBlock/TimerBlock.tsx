import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './timerblock.module.css';
import {
  EMessageKind,
  IActiveInterval,
  ITask,
  ITimeInterval,
  errorMessagesState,
  taskListState,
  timeIntervalState,
} from '../../recoil_state';
import { EColor, Text } from '../Text';
import { useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import classNames from 'classnames';
import { Break } from '../Break';
import {
  formatTimeToStringWithColon,
  returnNewErrorMessages,
} from '../../utils/functions';
import { EIcons, Icon } from '../Icon';

enum EActions {
  startTimer = 'startTimer',
  pauseTimer = 'pauseTimer',
  finishTimer = 'finishTimer',
  addPomidor = 'addPomidor',
  addActivePomidor = 'addActivePomidor',
  addEmptyPomidor = 'addEmptyPomidor',
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
  const setErrorMessages = useSetRecoilState(errorMessagesState);
  const [targetTask, setTargetTask] = useState<ITask | undefined>(
    taskList.find((task) => task.id === taskId)
  );
  const [activePomidorIndex, setActivePomidorIndex] = useState(0);
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
          newProps = {
            start: Date.now(),
            isActive: true,
          };
          if (isPomidor) newProps.isCurrent = true;
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

      const addPomidorAction =
        addAction === EActions.addPomidor ||
        addAction === EActions.addActivePomidor;

      setTaskList((oldList) =>
        oldList.map((timer) => {
          if (timer.id === taskId) {
            let currentPomidor =
              timer.pomidorArray.find((pomidor) => pomidor.isCurrent) ||
              timer.pomidorArray.at(-1);

            if (currentPomidor) {
              const newActiveIntervalArr: IActiveInterval[] =
                (isPomidor
                  ? currentPomidor.activeIntervals
                  : currentPomidor.break.activeIntervals) || [];

              if (newProps.start) {
                newProps = {
                  ...newProps,
                  activeIntervals: newActiveIntervalArr.concat({
                    start: newProps.start,
                  }),
                };

                delete newProps.start;
              }

              if (newProps.pause) {
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
                  ? currentPomidor.activeIntervals?.at(-1)?.pause
                  : currentPomidor.break.activeIntervals?.at(-1)?.pause
              ) {
                newProps.finish = isPomidor
                  ? currentPomidor.activeIntervals?.at(-1)?.pause
                  : currentPomidor.break.activeIntervals?.at(-1)?.pause;
              }

              const isCurrent = addPomidorAction
                ? false
                : currentPomidor.isCurrent;

              currentPomidor = isPomidor
                ? {
                    ...currentPomidor,
                    isCurrent,
                    ...newProps,
                  }
                : {
                    ...currentPomidor,
                    isCurrent,
                    break: {
                      ...currentPomidor.break,
                      ...newProps,
                    },
                  };

              const updatedArray = timer.pomidorArray.map((pomidor) => {
                if (pomidor.pomidorId === currentPomidor?.pomidorId) {
                  return addAction === EActions.addBreak
                    ? {
                        ...currentPomidor,
                        break: {
                          pomidorId: currentPomidor.pomidorId,
                          isActive: isTimerActive,
                          activeIntervals: isTimerActive
                            ? [{ start: Date.now() }]
                            : undefined,
                        },
                      }
                    : currentPomidor;
                }

                if (
                  addPomidorAction &&
                  typeof currentPomidor?.pomidorId === 'number' &&
                  pomidor.pomidorId === currentPomidor.pomidorId + 1
                ) {
                  return addAction === EActions.addPomidor
                    ? { ...pomidor, isCurrent: true }
                    : {
                        ...pomidor,
                        isCurrent: true,
                        isActive: isTimerActive,
                        activeIntervals: isTimerActive
                          ? [{ start: Date.now() }]
                          : undefined,
                      };
                }

                return pomidor;
              });

              if (
                (addPomidorAction &&
                  currentPomidor.pomidorId === timer.pomidorArray.length - 1) ||
                action === EActions.addEmptyPomidor
              ) {
                updatedArray.push({
                  pomidorId: updatedArray.length,
                  isActive: false,
                  isCurrent: addPomidorAction,
                  break: {
                    pomidorId: updatedArray.length,
                    isActive: false,
                  },
                });
              }

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

  const pauseTimer = useCallback(() => {
    console.log('pauseTimer');
    if (isTimerActive) {
      changeList(EActions.pauseTimer);
      clearTimerIdRef();
      setIsTimerActive(false);
      setIsPause(true);
    }
  }, [changeList, isTimerActive]);

  const finishTimer = useCallback(
    (action: EActions) => {
      changeList(EActions.finishTimer, action);
      clearTimerIdRef();
    },
    [changeList]
  );

  const onNext = useCallback(() => {
    finishTimer(isPomidor ? EActions.addBreak : EActions.addActivePomidor);
    setIsPomidor(!isPomidor);
    console.log('onNext', isPomidor);

    setCurrentTime(isPomidor ? breakTime : pomidorTime);
  }, [finishTimer, isPomidor, breakTime, pomidorTime]);

  const onSkip = () => {
    finishTimer(EActions.addPomidor);
    setIsPomidor(true);
    console.log('onSkip', isPomidor);

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
    if (!targetTask?.isCompleted) changeList(EActions.addEmptyPomidor);
    else
      setErrorMessages((prev) =>
        returnNewErrorMessages(
          EMessageKind.pomidorAdding,
          'Выполнение задачи завершено.',
          prev
        )
      );
  };

  useEffect(() => {
    const targetTask = taskList.find((task) => task.id === taskId);

    if (targetTask) {
      setIsCompleted(targetTask.isCompleted);
      setTargetTask(targetTask);

      const currentPomidorIndex = targetTask.pomidorArray.findIndex(
        (pomidor) => pomidor.isCurrent
      );
      const activePomidorIndex =
        currentPomidorIndex > -1
          ? currentPomidorIndex
          : targetTask.pomidorArray.length - 1;
      setActivePomidorIndex(activePomidorIndex);

      const activePomidor = targetTask.pomidorArray[activePomidorIndex];
      const isPomidor = !activePomidor.finish;
      setIsTimerActive(
        isPomidor ? activePomidor.isActive : activePomidor.break.isActive
      );
      const isPaused = isPomidor
        ? !!activePomidor.activeIntervals?.at(-1)?.pause
        : !!activePomidor.break.activeIntervals?.at(-1)?.pause;
      setIsPause(isPaused);

      setIsPomidor(isCompleted || isPomidor);

      setIsPomidorNew(
        isPomidor
          ? !activePomidor.activeIntervals?.[0].start
          : !activePomidor.break.activeIntervals?.[0].start
      );
      setErrorMessages((prev) =>
        prev.filter((err) => err.kind !== EMessageKind.taskSearch)
      );

      if (isPaused) {
        const elapsedTime =
          (isPomidor
            ? activePomidor?.activeIntervals
            : activePomidor?.break.activeIntervals
          )?.reduce((acc, curr) => {
            return curr.pause ? acc + (curr.pause - curr.start) : acc;
          }, 0) || 0;
        console.log('elapsed time: ', elapsedTime);

        setCurrentTime((isPomidor ? pomidorTime : breakTime) - elapsedTime);
      } else if (isPomidorNew) {
        setCurrentTime(isPomidor ? pomidorTime : breakTime);
        console.log('isPomidorNew');
      }
    }
  }, [
    taskList,
    taskId,
    isPomidor,
    pomidorTime,
    breakTime,
    isTimerActive,
    isCompleted,
    isPomidorNew,
    setErrorMessages,
    targetTask,
  ]);

  useEffect(() => {
    if (!targetTask)
      setErrorMessages((prev) =>
        returnNewErrorMessages(
          EMessageKind.taskSearch,
          `Задача с id "${taskId}" не существует`,
          prev
        )
      );
  }, [setErrorMessages, targetTask, taskId]);

  useEffect(() => {
    if (currentTime < 0) onNext();
    if (!timerIdRef.current && targetTask && isTimerActive)
      timerIdRef.current = setInterval(() => {
        setCurrentTime((prev) => prev - (prev % 1000 || 1000));
      }, currentTime % 1000 || 1000);
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
              {activePomidorIndex + 1}
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
                    <button
                      className={classNames('primaryBtn', styles.pauseBtn)}
                      onClick={pauseTimer}
                      disabled={currentTime < 1000}>
                      Пауза
                    </button>
                  )}
                  {!isPause && isPomidor && (
                    <button
                      className='secondaryBtn'
                      onClick={onSkip}
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
                    <button className='secondaryBtn' onClick={onSkip}>
                      Пропустить
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
