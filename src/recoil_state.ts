import { MutableRefObject } from 'react';
import { atom, selector } from 'recoil';
import { getTimeFromActiveIntervals } from './utils/functions';

export interface IActiveInterval {
  start: number;
  pause?: number;
}

export type TBreakInterval = Omit<
  ITimeInterval,
  'break' | 'isCompleted' | 'isCurrent'
>;

export interface ITimeInterval {
  pomidorId: number;
  isActive: boolean;
  isCurrent: boolean;
  activeIntervals?: IActiveInterval[];
  finish?: number;
  break: TBreakInterval;
}

export interface ITask {
  id: string;
  title: string;
  pomidorArray: ITimeInterval[];
  isCompleted: boolean;
  isDeleted: boolean;
  taskRef: MutableRefObject<HTMLLIElement | null>;
  timerBlockRef: MutableRefObject<HTMLDivElement | null>;
}

export enum ETimeIntervalType {
  pomidorTime = 'pomidorTime',
  shortBreakTime = 'shortBreakTime',
  longBreakTime = 'longBreakTime',
}

export interface ITimeIntervalObject {
  [ETimeIntervalType.pomidorTime]: TPomidorDuration;
  [ETimeIntervalType.shortBreakTime]: TShortBreakDuration;
  [ETimeIntervalType.longBreakTime]: TLongBreakDuration;
}

export enum EFilter {
  current = 'Эта неделя',
  last = 'Прошедшая неделя',
  beforeLast = '2 недели назад',
}

// export type TPomidorDuration = 900000 | 1500000 | 2100000;
export type TPomidorDuration = 10000 | 1500000 | 2100000;
// export type TShortBreakDuration = 300000 | 600000 | 900000;
export type TShortBreakDuration = 10000 | 600000 | 900000;
export type TLongBreakDuration = 1200000 | 1800000 | 2400000;

export interface ITimeByDay {
  work: number;
  completedWork: number;
  break: number;
  empty: boolean;
  pomidorCount: number;
  stops: number;
}

export enum EMessageKind {
  taskEdition = 'taskEdition',
  pomidorDeleting = 'pomidorDeleting',
  pomidorAdding = 'pomidorAdding',
  taskSearch = 'taskSearch',
}
export enum EMessageType {
  error = 'error',
  success = 'success',
}

export interface IMessage {
  kind: EMessageKind;
  id: string;
  type: EMessageType;
  message: string;
  nodeRef: MutableRefObject<HTMLDivElement | null>;
}

export const titleState = atom({
  key: 'titleState',
  default: '',
});

export const taskListFilterState = atom({
  key: 'taskListFilterState',
  default: EFilter.current,
});

const storageTaskList = localStorage.getItem('taskList');
export const taskListState = atom<ITask[]>({
  key: 'taskListState',
  default: storageTaskList ? JSON.parse(storageTaskList) : [],
});

export const summaryTimeState = selector({
  key: 'summaryTimeState',
  get: ({ get }) => {
    const taskList = get(taskListState);
    const summaryTime = taskList.reduce((acc, task) => {
      const taskTime = task.pomidorArray.reduce((acc, pomidor) => {
        const workTime = getTimeFromActiveIntervals(pomidor);

        const breakTime = getTimeFromActiveIntervals(pomidor.break);

        return acc + workTime + breakTime;
      }, 0);
      return acc + taskTime;
    }, 0);
    
    return summaryTime;
  },
});

export const statDataState = selector({
  key: 'statDataState',
  get: ({ get }) => {
    const timeByDay: ITimeByDay[] = [];

    for (let i = 0; i <= 6; i++) {
      timeByDay[i] = {
        work: 0,
        completedWork: 0,
        break: 0,
        empty: true,
        pomidorCount: 0,
        stops: 0,
      };
    }

    const filter = get(taskListFilterState);
    const list = get(taskListState);
    const today = new Date();
    const weekStartDate = new Date(today);
    const weekEndDate = new Date(today);

    let daysToSubtract = 0;
    let daysToAdd = 0;
    const todayNumber = today.getDay();

    const currentDaysToSubtract = todayNumber === 0 ? 6 : todayNumber - 1;
    const currentDaysToAdd = todayNumber === 0 ? todayNumber : 7 - todayNumber;
    switch (filter) {
      case EFilter.current:
        daysToSubtract = currentDaysToSubtract;
        daysToAdd = currentDaysToAdd;
        break;
      case EFilter.last:
        daysToSubtract = currentDaysToSubtract + 7;
        daysToAdd = currentDaysToAdd - 7;
        break;
      case EFilter.beforeLast:
        daysToSubtract = currentDaysToSubtract + 14;
        daysToAdd = currentDaysToAdd - 14;
        break;
    }

    weekStartDate.setDate(today.getDate() - daysToSubtract);
    weekStartDate.setHours(0, 0, 0, 0);

    weekEndDate.setDate(today.getDate() + daysToAdd);
    weekEndDate.setHours(23, 59, 59, 999);

    console.log('weekStartDate', weekStartDate);
    console.log('weekEndDate', weekEndDate);

    list.forEach((task) => {
      task.pomidorArray.forEach((pomidor) => {
        const indexOfIntervalWithPause = pomidor.activeIntervals?.findIndex(
          (interval) => interval.pause
        );

        pomidor.activeIntervals?.forEach((interval) => {
          const startDate = new Date(interval.start);
          const endTimestamp = interval.pause || pomidor.finish || Date.now();
          const endDate = new Date(endTimestamp);

          const startTimeDayOfMnWeek = startDate.getDay()
            ? startDate.getDay() - 1
            : 6;
          const endTimeDayOfMnWeek = endDate.getDay()
            ? endDate.getDay() - 1
            : 6;

          if (
            interval.start >= weekStartDate.getTime() &&
            interval.start <= weekEndDate.getTime() &&
            endTimestamp >= weekStartDate.getTime() &&
            endTimestamp <= weekEndDate.getTime()
          ) {
            if (interval.pause) {
              const pauseDayOfSnWeek = new Date(interval.pause).getDay();
              const pauseDayOfMnWeek = pauseDayOfSnWeek
                ? pauseDayOfSnWeek - 1
                : 6;
              timeByDay[pauseDayOfMnWeek].stops += 1;
            }

            if (startTimeDayOfMnWeek === endTimeDayOfMnWeek) {
              timeByDay[startTimeDayOfMnWeek].work +=
                endTimestamp - interval.start;

              if (indexOfIntervalWithPause === -1 && pomidor.finish) {
                timeByDay[startTimeDayOfMnWeek].pomidorCount += 1;
                timeByDay[startTimeDayOfMnWeek].completedWork +=
                  endTimestamp - interval.start;
              }
            } else {
              const endTimestampOfStartDay = startDate.setHours(
                23,
                59,
                59,
                999
              );
              timeByDay[startTimeDayOfMnWeek].work +=
                endTimestampOfStartDay - interval.start;
              timeByDay[startTimeDayOfMnWeek + 1].work +=
                endTimestamp - endTimestampOfStartDay;

              if (indexOfIntervalWithPause === -1 && pomidor.finish) {
                timeByDay[startTimeDayOfMnWeek + 1].pomidorCount += 1;
                timeByDay[startTimeDayOfMnWeek].completedWork +=
                  endTimestampOfStartDay - interval.start;
                timeByDay[startTimeDayOfMnWeek + 1].completedWork +=
                  endTimestamp - endTimestampOfStartDay;
              }
            }
          } else if (
            interval.start >= weekStartDate.getTime() &&
            interval.start <= weekEndDate.getTime() &&
            endTimestamp > weekEndDate.getTime()
          ) {
            if (
              interval.pause &&
              interval.pause >= weekStartDate.getTime() &&
              interval.pause <= weekEndDate.getTime()
            ) {
              const pauseDayOfSnWeek = new Date(interval.pause).getDay();
              const pauseDayOfMnWeek = pauseDayOfSnWeek
                ? pauseDayOfSnWeek - 1
                : 6;
              timeByDay[pauseDayOfMnWeek].stops += 1;
            }

            const endTimestampOfStartDay = startDate.setHours(23, 59, 59, 999);
            timeByDay[startTimeDayOfMnWeek].work +=
              endTimestampOfStartDay - interval.start;

            if (indexOfIntervalWithPause === -1 && pomidor.finish) {
              timeByDay[startTimeDayOfMnWeek].completedWork +=
                endTimestampOfStartDay - interval.start;
            }
          } else if (
            endTimestamp >= weekStartDate.getTime() &&
            endTimestamp <= weekEndDate.getTime()
          ) {
            if (
              interval.pause &&
              interval.pause >= weekStartDate.getTime() &&
              interval.pause <= weekEndDate.getTime()
            ) {
              const pauseDayOfSnWeek = new Date(interval.pause).getDay();
              const pauseDayOfMnWeek = pauseDayOfSnWeek
                ? pauseDayOfSnWeek - 1
                : 6;
              timeByDay[pauseDayOfMnWeek].stops += 1;
            }

            const endTimestampOfStartDay = startDate.setHours(23, 59, 59, 999);
            timeByDay[endTimeDayOfMnWeek].work +=
              endTimestamp - endTimestampOfStartDay;

            if (indexOfIntervalWithPause === -1 && pomidor.finish) {
              timeByDay[endTimeDayOfMnWeek].pomidorCount += 1;
              timeByDay[endTimeDayOfMnWeek].completedWork +=
                endTimestamp - endTimestampOfStartDay;
            }
          }
        });
      });
    });

    timeByDay.forEach((day) => {
      if (day.work || day.break || day.pomidorCount || day.stops)
        day.empty = false;
      return day;
    });

    return timeByDay;
  },
});

const storageTimeIntervalObject = localStorage.getItem('timeIntervalObject');
export const timeIntervalState = atom<ITimeIntervalObject>({
  key: 'timeIntervalState',
  default: storageTimeIntervalObject
    ? JSON.parse(storageTimeIntervalObject)
    : {
        [ETimeIntervalType.pomidorTime]: 900000,
        [ETimeIntervalType.shortBreakTime]: 300000,
        [ETimeIntervalType.longBreakTime]: 1200000,
      },
});

export const messagesState = atom<IMessage[]>({
  key: 'messagesState',
  default: [],
});
