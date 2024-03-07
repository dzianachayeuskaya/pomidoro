import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './errormessage.module.css';

export function ErrorMessage({ message }: { message: string }) {
  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef(null);
  useEffect(() => {
    setMounted(true);

    const timeoutId = setTimeout(() => {
      setMounted(false);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={mounted}
      timeout={300}
      classNames={styles.fade}
      unmountOnExit>
      <div ref={nodeRef} className={styles.errorContainer}>
        {message}
      </div>
    </CSSTransition>
    // <CSSTransition in={mounted} timeout={500} classNames='fade' unmountOnExit>
    //   <div className={styles.errorContainer}>{message}</div>
    // </CSSTransition>
  );
}
