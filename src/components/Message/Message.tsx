import React, { forwardRef, useEffect } from 'react';
import styles from './message.module.css';
import { EIcons, Icon } from '../Icon';
import { useSetRecoilState } from 'recoil';
import {  IMessage, messagesState } from '../../recoil_state';
import classNames from 'classnames';

export const Message = forwardRef<HTMLDivElement, IMessage>(
  ({ message, id , type}, ref) => {
    const setMessages = useSetRecoilState(messagesState);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setMessages((prev) => prev.filter((err) => err.id !== id));
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [id, setMessages]);

    const handleClose = () => {
      setMessages((prev) => prev.filter((err) => err.id !== id));
    };

    return (
      <div ref={ref} className={classNames(styles.container, styles[type])}>
        <button
          className={styles.closeBtn}
          aria-label='Закрыть окно'
          onClick={handleClose}>
          <Icon name={EIcons.close} />
        </button>
        {message}
      </div>
    );
  }
);
