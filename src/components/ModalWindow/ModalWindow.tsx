import React, { ReactNode, MouseEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './modalwindow.module.css';
import { EIcons, Icon } from '../Icon';
import { CSSTransition } from 'react-transition-group';

interface IModalWindow {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalWindow({ children, isOpen, onClose }: IModalWindow) {
  const modalRef = useRef<HTMLDivElement>(null);
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
          <CSSTransition
            in={isOpen}
            nodeRef={modalRef}
            timeout={300}
            classNames='fade'
            unmountOnExit>
            <div
              className={styles.container}
              onClick={handleClose}
              ref={modalRef}>
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
            </div>
          </CSSTransition>,
          root
        )}
    </>
  );
}
