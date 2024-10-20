import { RefObject, createRef } from 'react';
import {
  EMessageKind,
  EMessageType,
  IMessage,
  ITimeInterval,
  TBreakInterval,
} from '../recoil_state';

export function determineRect(containerRef: RefObject<HTMLDivElement>) {
  if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;

    if (rect) {
      return {
        top: rect.top + rect.height + scrollTop,
        right: window.innerWidth - rect.right,
      };
    }
  }
  return { top: 0, right: 0 };
}

export function declOfNum(number: number, titles: string[]) {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

export enum TFormatTimeFn {
  WithColon = 'WithColon',
  Long = 'Long',
  Short = 'Short',
}

export function formatTime(ms: number, type: TFormatTimeFn): string {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = (ms % (60 * 60 * 1000)) / (60 * 1000);
  const roundedMinutes =
    type === TFormatTimeFn.WithColon ? Math.floor(minutes) : Math.ceil(minutes);
  const seconds = Math.ceil(ms / 1000) % 60;

  switch (type) {
    case TFormatTimeFn.WithColon:
      return `${hours ? (hours < 10 ? `0${hours}:` : `${hours}:`) : ''}${
        roundedMinutes > 9 ? '' : '0'
      }${roundedMinutes}:${seconds > 9 ? '' : '0'}${seconds}`;

    case TFormatTimeFn.Long:
      return `${
        hours ? `${hours} ${declOfNum(hours, ['часа', 'часов', 'часов'])}` : ''
      } ${
        roundedMinutes
          ? `${roundedMinutes} ${declOfNum(roundedMinutes, [
              'минуты',
              'минут',
              'минут',
            ])}`
          : ''
      }`.trim();

    case TFormatTimeFn.Short:
      return `${days ? `${days}дн ` : ''}${hours ? `${hours}ч ` : ''}${
        roundedMinutes ? `${roundedMinutes}мин` : ''
      }`.trim();

    default:
      return '';
  }
}

export function getRandomAlphanumericString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function returnNewMessages(
  kind: EMessageKind,
  type: EMessageType,
  message: string,
  prevMessages: IMessage[]
): IMessage[] {
  return [
    ...prevMessages,
    {
      kind,
      id: getRandomAlphanumericString(4),
      type,
      message,
      nodeRef: createRef<HTMLDivElement>(),
    },
  ];
}

export function getTimeFromActiveIntervals(
  timeInterval: ITimeInterval | TBreakInterval
) {
  return (
    timeInterval.activeIntervals?.reduce((acc, activeInterval) => {
      const workTimeInterval =
        (activeInterval.pause ?? timeInterval.finish ?? activeInterval.start) -
        activeInterval.start;

      return acc + workTimeInterval;
    }, 0) ?? 0
  );
}

export function createArrayOfNumber(
  base: number,
  numberOfElements: number
): number[] {
  let newArray = [];
  for (let i = 0; i < numberOfElements; i++) {
    newArray.push(base * (i + 1));
  }
  return newArray;
}
