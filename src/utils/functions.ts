import { RefObject, createRef } from 'react';
import { EMessageKind, EMessageType, IMessage } from '../recoil_state';

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

export function formatTimeToStringWithColon(time: number): string {
  const sec = Math.ceil(time / 1000) % 60;
  const min = Math.floor(time / 1000 / 60) % 60;
  const hours = Math.floor(time / 1000 / 60 / 60);
  return `${hours ? (hours < 10 ? `0${hours}:` : `${hours}:`) : ''}${
    min > 9 ? '' : '0'
  }${min}:${sec > 9 ? '' : '0'}${sec}`;
}

export function formatTimeToStringWithWord(time: number): string {
  const min = Math.ceil(time / 1000 / 60) % 60;
  const hours = Math.floor(time / 1000 / 60 / 60);
  console.log(`min: ${min}, hours: ${hours}`);

  return `${
    hours ? `${hours} ${declOfNum(hours, ['часа', 'часов', 'часов'])}` : ''
  } ${min ? `${min} ${declOfNum(min, ['минуты', 'минут', 'минут'])}` : ''}`;
}
export function formatTimeToShortString(time: number): string {
  const min = Math.ceil(time / 1000 / 60) % 60;
  const hours = Math.floor(time / 1000 / 60 / 60);
  console.log(`min: ${min}, hours: ${hours}`);

  return `${hours ? `${hours}ч ` : ''}${min ? `${min}` : ''}`;
}

export function declOfNum(number: number, titles: string[]) {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
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
