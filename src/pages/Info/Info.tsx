import React from 'react';
import styles from './info.module.css';
import { UlList } from '../../components/UlList';
import classNames from 'classnames';
import { Text } from '../../components/Text';
import { Break } from '../../components/Break';
import { Link } from 'react-router-dom';
import { EIcons, Icon } from '../../components/Icon';

const list = [
  'Создай или выбери задачу, над которой хочешь работать',
  'Запусти таймер («помидор»)',
  'Работай пока «помидор» не прозвонит',
  'Сделай короткий перерыв (3-5 минут)',
  'Продолжай работать «помидор» за «помидором», пока задача не будет выполнена. Каждые 4 «помидора» делай длинный перерыв (15-30 минут).',
];

export function Info() {
  return (
    <>
      <div className='mainContent'>
        <div className='leftBlock'>
          <UlList title='Чтобы начать работать:' list={list} />
        </div>

        <div className={classNames(styles.bottomBlock, 'rightBlock')}>
          <div className={styles.row}>
            <Text size={16}>
              Если запланировать количество «помидоров», необходимых для
              выполнения задачи, переход между ними будет происходить
              автоматически
            </Text>
          </div>
          <div className={styles.row}>
            <div className='btnWrapper flexCenter'>
              <button className={styles.menuBtn} disabled>
                <Icon name={EIcons.drop} />
              </button>
            </div>
            <Text size={16}>Управление задачей в списке задач</Text>
          </div>
          <div className={styles.row}>
            <div className='btnWrapper flexCenter'>
              <button className='addBtn readonly' disabled>
                <Icon name={EIcons.add} />
              </button>
            </div>
            <Text size={16}>Добавление «помидора»</Text>
          </div>
          <div className={styles.row}>
            <button className='secondaryBtn readonly' disabled>
              Пропустить
            </button>
            <Text size={16}>
              Переход к следующему «помидору», не завершив его
            </Text>
          </div>
          <div className={styles.row}>
            <button className='secondaryBtn readonly' disabled>
              Сделано
            </button>
            <Text size={16}>Завершение задачи</Text>
          </div>
        </div>
      </div>

      <Break size={25} top />
      <Link to='/' className={classNames(styles.linkBtn, 'primaryBtn')}>
        Понятно, давай начинать!
      </Link>
    </>
  );
}
