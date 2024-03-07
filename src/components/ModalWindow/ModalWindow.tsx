import React, { ReactNode, MouseEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './modalwindow.module.css';
import { EIcons, Icon } from '../Icon';

interface IModalWindow {
  children: ReactNode;
  onClose: () => void;
}

export function ModalWindow({ children, onClose }: IModalWindow) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handleClose = (e: MouseEvent) => {
    if (e.target instanceof Node && !contentRef.current?.contains(e.target))
      onClose();
  };

  const root = document.getElementById('modalRoot');

  return (
    <>
      {root &&
        createPortal(
          <div className={styles.container} onClick={handleClose}>
            <div className={styles.modalWrap}>
              <div className={styles.modalContent} ref={contentRef}>
                {children}
              </div>
              <button
                className={styles.closeBtn}
                aria-label='Закрыть модальное окно'
                onClick={handleClose}>
                <Icon name={EIcons.close} />
              </button>
            </div>
          </div>,
          root
        )}
    </>
  );
}
