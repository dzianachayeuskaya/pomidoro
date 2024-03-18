import React, {
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import styles from './dropdown.module.css';
import ReactDOM from 'react-dom';
import { determineRect } from '../../utils/functions';

interface IDropdownProps {
  button: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface IListStyleState {
  top: number;
  right: number;
}

export function Dropdown({
  button,
  children,
  isOpen,
  onOpen,
  onClose,
}: IDropdownProps) {
  const portalNode = document.getElementById('dropdownRoot');

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [listStyle, setListStyle] = useState<IListStyleState>({
    top: 0,
    right: 0,
  });

  const determineCoords = () => {
    setListStyle(determineRect(containerRef));
  };

  const handleClickCb = useCallback(
    function handleClick(event: MouseEvent) {
      determineCoords();
      if (
        event.target instanceof Node &&
        !buttonRef.current?.contains(event.target)
      ) {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickCb);
    window.addEventListener('resize', determineCoords);

    return () => {
      document.removeEventListener('click', handleClickCb);
      window.removeEventListener('resize', determineCoords);
    };
  }, [handleClickCb]);

  return (
    <div ref={containerRef}>
      <div className={styles.btn} ref={buttonRef} onClick={onOpen}>
        {button}
      </div>
      {isOpen &&
        portalNode &&
        ReactDOM.createPortal(
          <div className={styles.list} style={listStyle}>
            {children}
          </div>,
          portalNode
        )}
    </div>
  );
}
