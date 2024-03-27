import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './errormessage.module.css';
import { EIcons, Icon } from '../Icon';
import { useSetRecoilState } from 'recoil';
import { errorMessagesState } from '../../recoil_state';

export function ErrorMessage({ message, id }: { message: string; id: string }) {
  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef(null);
  const setErrorMessages = useSetRecoilState(errorMessagesState);

  useEffect(() => {
    setMounted(true);

    const timeoutId = setTimeout(() => {
      // setMounted(false);
      setErrorMessages((prev) => prev.filter((err) => err.id !== id));
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [id, setErrorMessages]);

  const handleClose = () => {
    setErrorMessages((prev) => prev.filter((err) => err.id !== id));
  };

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={mounted}
      timeout={300}
      classNames={styles.fade}
      unmountOnExit>
      <div ref={nodeRef} className={styles.errorContainer}>
        <button
          className={styles.closeBtn}
          aria-label='Закрыть окно'
          onClick={handleClose}>
          <Icon name={EIcons.close} />
        </button>
        {message}
      </div>
    </CSSTransition>
    // <CSSTransition in={mounted} timeout={500} classNames='fade' unmountOnExit>
    //   <div className={styles.errorContainer}>{message}</div>
    // </CSSTransition>
  );
}
