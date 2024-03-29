import React, { forwardRef, useEffect } from 'react';
import styles from './errormessage.module.css';
import { EIcons, Icon } from '../Icon';
import { useSetRecoilState } from 'recoil';
import { errorMessagesState } from '../../recoil_state';

interface IErrorMessage {
  message: string;
  id: string;
}

export const ErrorMessage = forwardRef<HTMLDivElement, IErrorMessage>(
  ({ message, id }, ref) => {
    const setErrorMessages = useSetRecoilState(errorMessagesState);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setErrorMessages((prev) => prev.filter((err) => err.id !== id));
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [id, setErrorMessages]);

    const handleClose = () => {
      setErrorMessages((prev) => prev.filter((err) => err.id !== id));
    };

    return (
      <div ref={ref} className={styles.errorContainer}>
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
