import React from 'react';
import styles from './icon.module.css';
import classNames from 'classnames';

export enum EIcons {
  logo = 'logo',
  stat = 'stat',
  drop = 'drop',
  focus = 'focus',
  pause = 'pause',
  stops = 'stops',
  happyTomato = 'happyTomato',
  decrease = 'decrease',
  increase = 'increase',
  delete = 'delete',
  edit = 'edit',
  add = 'add',
  close = 'close',
}

interface IIconsProps {
  name: EIcons;
  size?: 12 | 14 | 16 | 18 | 20 | 40 | 80;
}

export function Icon(props: IIconsProps) {
  const { name, size } = props;

  const icon = () => {
    switch (name) {
      case 'logo':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_26102_226)'>
              <path
                d='M38.9151 23.2834C38.9151 33.7058 30.466 40 20.0437 40C9.62098 40 1.17188 31.5509 1.17188 21.1282C1.17188 10.7059 9.88496 4.2981 20.3073 4.2981C30.73 4.2981 38.9151 12.8607 38.9151 23.2834Z'
                fill='#DC3E22'
              />
              <path
                d='M28.238 12.6066C27.3211 11.673 25.8377 10.8048 24.733 10.551C25.3401 10.0127 25.4623 9.99494 26.2227 9.61816C28.1713 8.65365 31.0576 8.56485 31.0576 8.56485C31.0576 8.56485 27.6509 6.8042 25.1601 6.91468C24.5259 6.94257 23.8571 7.16658 23.2118 7.48403C23.5757 6.97054 23.9205 6.45998 24.1409 6.07643C24.8152 4.90368 25.524 3.42627 25.524 3.42627C25.524 3.42627 22.9122 3.56573 21.7008 5.01565C21.2407 5.56645 20.8934 6.26625 20.6392 6.92275C20.1878 6.40419 19.6896 5.94242 19.1913 5.58195C16.6999 3.77896 12.7192 4.16903 12.7192 4.16903C12.7192 4.16903 15.7263 5.87486 17.0793 7.57656C17.6076 8.2411 18.1437 8.54842 18.4642 9.29352C17.3564 9.05367 14.8569 9.13565 13.63 9.59057C10.4771 10.7599 9.11852 15.4649 9.11852 15.4649C9.11852 15.4649 12.1952 13.3443 16.3813 11.8565C17.3017 11.5295 18.2748 11.4429 19.1229 11.4578C18.7379 12.0575 18.3173 12.8363 17.999 13.7546C17.2247 15.9904 18.2479 21.3113 18.2479 21.3113C18.2479 21.3113 20.4896 18.1647 21.403 15.6157C21.8718 14.3073 21.9879 12.9936 21.9904 12.0242C22.8217 12.3931 23.8009 12.9319 24.5326 13.398C28.2794 15.7852 30.072 20.1435 30.072 20.1435C30.072 20.1435 30.5941 15.006 28.238 12.6066Z'
                fill='#899441'
              />
              <path
                d='M20.5008 10.3094C20.4889 10.3094 20.477 10.3091 20.4651 10.3088C19.7242 10.2896 19.1391 9.67376 19.1572 8.9334C19.1587 8.86931 19.2234 4.36125 16.7191 2.40111C16.135 1.94395 16.0318 1.09984 16.489 0.515424C16.9465 -0.0686834 17.7906 -0.171833 18.3747 0.285626C21.9559 3.08806 21.8491 8.76128 21.843 9.00145C21.8238 9.73083 21.2262 10.3094 20.5008 10.3094Z'
                fill='#A8B64F'
              />
            </g>
            <defs>
              <clipPath id='clip0_26102_226'>
                <rect width='40' height='40' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'stat':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_26109_214)'>
              <path
                d='M10 20H14V4H10V20ZM4 20H8V12H4V20ZM16 9V20H20V9H16Z'
                fill='#DC3E22'
              />
            </g>
            <defs>
              <clipPath id='clip0_26109_214'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'drop':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='26'
            height='6'
            viewBox='0 0 26 6'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <circle cx='3' cy='3' r='3' fill='#C4C4C4' />
            <circle cx='13' cy='3' r='3' fill='#C4C4C4' />
            <circle cx='23' cy='3' r='3' fill='#C4C4C4' />
          </svg>
        );
      case 'focus':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='129'
            height='129'
            viewBox='0 0 129 129'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M64.5 102C85.2107 102 102 85.2107 102 64.5C102 43.7893 85.2107 27 64.5 27C43.7893 27 27 43.7893 27 64.5C27 85.2107 43.7893 102 64.5 102Z'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M64.5 85C75.8218 85 85 75.8218 85 64.5C85 53.1782 75.8218 44 64.5 44C53.1782 44 44 53.1782 44 64.5C44 75.8218 53.1782 85 64.5 85Z'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      case 'pause':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='129'
            height='129'
            viewBox='0 0 129 129'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M64.3154 37.1579V64.3158L77.8944 77.8947'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      case 'stops':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='129'
            height='129'
            viewBox='0 0 129 129'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M28 27L102 101'
              stroke='#C4C4C4'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      case 'happyTomato':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='115'
            height='115'
            viewBox='0 0 115 115'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_16_527)'>
              <path
                d='M111.881 66.9398C111.881 96.9041 87.5898 115 57.6255 115C27.6603 115 3.36914 90.7089 3.36914 60.7437C3.36914 30.7794 28.4192 12.3571 58.3836 12.3571C88.3488 12.3571 111.881 36.9746 111.881 66.9398Z'
                fill='#DC3E22'
              />
              <path
                d='M81.185 36.2439C78.5489 33.5598 74.284 31.0639 71.1081 30.3341C72.8534 28.7865 73.2046 28.7355 75.391 27.6522C80.9932 24.8793 89.2913 24.624 89.2913 24.624C89.2913 24.624 79.497 19.5621 72.3358 19.8797C70.5127 19.9599 68.5898 20.604 66.7346 21.5166C67.7807 20.0403 68.7719 18.5725 69.4056 17.4698C71.3442 14.0981 73.3822 9.85057 73.3822 9.85057C73.3822 9.85057 65.8733 10.2515 62.3903 14.42C61.0676 16.0036 60.0691 18.0155 59.3384 19.9029C58.0406 18.4121 56.6082 17.0845 55.1756 16.0481C48.0129 10.8645 36.5683 11.986 36.5683 11.986C36.5683 11.986 45.2138 16.8902 49.1036 21.7826C50.6224 23.6932 52.1638 24.5767 53.0852 26.7189C49.9003 26.0293 42.7142 26.265 39.1867 27.5729C30.1222 30.9348 26.2164 44.4617 26.2164 44.4617C26.2164 44.4617 35.0618 38.3648 47.0968 34.0876C49.743 33.1475 52.5406 32.8983 54.9789 32.9411C53.872 34.6654 52.6628 36.9045 51.7478 39.5446C49.5215 45.9724 52.4634 61.2701 52.4634 61.2701C52.4634 61.2701 58.9082 52.2234 61.5343 44.8951C62.8821 41.1335 63.2157 37.3568 63.2231 34.5698C65.6131 35.6302 68.4281 37.1793 70.5319 38.5193C81.3038 45.3826 86.4576 57.9127 86.4576 57.9127C86.4576 57.9127 87.9585 43.1422 81.185 36.2439Z'
                fill='#899441'
              />
              <path
                d='M58.9395 29.6396C58.9053 29.6396 58.8711 29.6388 58.8368 29.6379C56.7066 29.5826 55.0246 27.8121 55.0764 25.6835C55.0808 25.4993 55.2668 12.5386 48.067 6.90318C46.3877 5.58886 46.0911 3.16203 47.4054 1.48184C48.7206 -0.197465 51.1475 -0.49402 52.8268 0.821175C63.1229 8.87817 62.8158 25.1887 62.7982 25.8792C62.7429 27.9761 61.025 29.6396 58.9395 29.6396Z'
                fill='#A8B64F'
              />
              <circle cx='41.5' cy='64.5' r='2.5' fill='black' />
              <g filter='url(#filter0_f_16_527)'>
                <circle cx='29.5' cy='75.5' r='5.5' fill='#EA8979' />
              </g>
              <g filter='url(#filter1_f_16_527)'>
                <circle cx='85.5' cy='75.5' r='5.5' fill='#EA8979' />
              </g>
              <circle cx='73.5' cy='64.5' r='2.5' fill='black' />
              <path d='M46 78C50 82 64.5 83 68.5 78' stroke='black' />
            </g>
            <defs>
              <filter
                id='filter0_f_16_527'
                x='20'
                y='66'
                width='19'
                height='19'
                filterUnits='userSpaceOnUse'
                colorInterpolationFilters='sRGB'>
                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                <feBlend
                  mode='normal'
                  in='SourceGraphic'
                  in2='BackgroundImageFix'
                  result='shape'
                />
                <feGaussianBlur
                  stdDeviation='2'
                  result='effect1_foregroundBlur_16_527'
                />
              </filter>
              <filter
                id='filter1_f_16_527'
                x='76'
                y='66'
                width='19'
                height='19'
                filterUnits='userSpaceOnUse'
                colorInterpolationFilters='sRGB'>
                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                <feBlend
                  mode='normal'
                  in='SourceGraphic'
                  in2='BackgroundImageFix'
                  result='shape'
                />
                <feGaussianBlur
                  stdDeviation='2'
                  result='effect1_foregroundBlur_16_527'
                />
              </filter>
              <clipPath id='clip0_16_527'>
                <rect width='115' height='115' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'decrease':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='18'
            height='18'
            viewBox='0 0 18 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_35_446)'>
              <path
                d='M9 1.5C4.8675 1.5 1.5 4.8675 1.5 9C1.5 13.1325 4.8675 16.5 9 16.5C13.1325 16.5 16.5 13.1325 16.5 9C16.5 4.8675 13.1325 1.5 9 1.5ZM9 15C5.6925 15 3 12.3075 3 9C3 5.6925 5.6925 3 9 3C12.3075 3 15 5.6925 15 9C15 12.3075 12.3075 15 9 15Z'
                fill='#A8B64F'
              />
              <path
                d='M5.25 8.25H8.25H9.75H12.75V9.75H9.75H8.25H5.25V8.25Z'
                fill='#A8B64F'
              />
            </g>
            <defs>
              <clipPath id='clip0_35_446'>
                <rect width='18' height='18' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'increase':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='18'
            height='18'
            viewBox='0 0 18 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_35_443)'>
              <path
                d='M9.75 5.25H8.25V8.25H5.25V9.75H8.25V12.75H9.75V9.75H12.75V8.25H9.75V5.25ZM9 1.5C4.8675 1.5 1.5 4.8675 1.5 9C1.5 13.1325 4.8675 16.5 9 16.5C13.1325 16.5 16.5 13.1325 16.5 9C16.5 4.8675 13.1325 1.5 9 1.5ZM9 15C5.6925 15 3 12.3075 3 9C3 5.6925 5.6925 3 9 3C12.3075 3 15 5.6925 15 9C15 12.3075 12.3075 15 9 15Z'
                fill='#A8B64F'
              />
            </g>
            <defs>
              <clipPath id='clip0_35_443'>
                <rect width='18' height='18' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'delete':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='18'
            height='18'
            viewBox='0 0 18 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_35_457)'>
              <path
                d='M12 6.75V14.25H6V6.75H12ZM10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3H11.625L10.875 2.25ZM13.5 5.25H4.5V14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25Z'
                fill='#A8B64F'
              />
            </g>
            <defs>
              <clipPath id='clip0_35_457'>
                <rect width='18' height='18' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'edit':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='18'
            height='18'
            viewBox='0 0 18 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_35_452)'>
              <path
                d='M10.545 6.765L11.235 7.455L4.44 14.25H3.75V13.56L10.545 6.765ZM13.245 2.25C13.0575 2.25 12.8625 2.325 12.72 2.4675L11.3475 3.84L14.16 6.6525L15.5325 5.28C15.825 4.9875 15.825 4.515 15.5325 4.2225L13.7775 2.4675C13.6275 2.3175 13.44 2.25 13.245 2.25ZM10.545 4.6425L2.25 12.9375V15.75H5.0625L13.3575 7.455L10.545 4.6425Z'
                fill='#A8B64F'
              />
            </g>
            <defs>
              <clipPath id='clip0_35_452'>
                <rect width='18' height='18' fill='white' />
              </clipPath>
            </defs>
          </svg>
        );
      case 'add':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='50'
            height='50'
            viewBox='0 0 50 50'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <circle cx='25' cy='25' r='25' fill='#C4C4C4' />
            <path
              d='M26.2756 26.1321V33H23.7244V26.1321H17V23.7029H23.7244V17H26.2756V23.7029H33V26.1321H26.2756Z'
              fill='white'
            />
          </svg>
        );
      case 'close':
        return (
          <svg
            className={classNames({ [styles[`svg${size}`]]: size })}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M11.9115 13.8058L6.84405 18.9567L4.96166 17.0433L10.0291 11.8924L5.06751 6.84914L6.85992 5.02721L11.8215 10.0705L16.7673 5.04334L18.6497 6.95672L13.7039 11.9839L18.6655 17.0272L16.8731 18.8491L11.9115 13.8058Z'
              fill='#C4C4C4'
            />
          </svg>
        );
      // case 'edit':
      //   return (
      //     <svg
      //       className={classNames({ [styles[`svg${size}`]]: size })}
      //       width='18'
      //       height='18'
      //       viewBox='0 0 18 18'
      //       fill='none'
      //       xmlns='http://www.w3.org/2000/svg'>
      //       <path
      //         d='M0 14.2501V18.0001H3.75L14.81 6.94006L11.06 3.19006L0 14.2501ZM17.71 4.04006C18.1 3.65006 18.1 3.02006 17.71 2.63006L15.37 0.290059C14.98 -0.0999414 14.35 -0.0999414 13.96 0.290059L12.13 2.12006L15.88 5.87006L17.71 4.04006Z'
      //         fill='#999999'
      //       />
      //     </svg>
      //   );
      // case 'file':
      //   return (
      //     <svg
      //       className={classNames({ [styles[`svg${size}`]]: size })}
      //       width='16'
      //       height='20'
      //       viewBox='0 0 16 20'
      //       fill='none'
      //       xmlns='http://www.w3.org/2000/svg'>
      //       <path
      //         d='M10 0H2C0.9 0 0.0100002 0.9 0.0100002 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6L10 0ZM12 16H4V14H12V16ZM12 12H4V10H12V12ZM9 7V1.5L14.5 7H9Z'
      //         fill='#999999'
      //       />
      //     </svg>
      //   );
      // case 'img':
      //   return (
      //     <svg
      //       className={classNames({ [styles[`svg${size}`]]: size })}
      //       width='18'
      //       height='18'
      //       viewBox='0 0 18 18'
      //       fill='none'
      //       xmlns='http://www.w3.org/2000/svg'>
      //       <path
      //         d='M18 16V2C18 0.9 17.1 0 16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16ZM5.5 10.5L8 13.51L11.5 9L16 15H2L5.5 10.5Z'
      //         fill='#999999'
      //       />
      //     </svg>
      //   );
      // case 'message':
      //   return (
      //     <svg
      //       className={classNames({ [styles[`svg${size}`]]: size })}
      //       width='20'
      //       height='20'
      //       viewBox='0 0 20 20'
      //       fill='none'
      //       xmlns='http://www.w3.org/2000/svg'>
      //       <path
      //         d='M19 4H17V13H4V15C4 15.55 4.45 16 5 16H16L20 20V5C20 4.45 19.55 4 19 4ZM15 10V1C15 0.45 14.55 0 14 0H1C0.45 0 0 0.45 0 1V15L4 11H14C14.55 11 15 10.55 15 10Z'
      //         fill='#999999'
      //       />
      //     </svg>
      //   );
      // case 'pdf':
      //   return (
      //     <svg
      //       className={classNames({ [styles[`svg${size}`]]: size })}
      //       width='20'
      //       height='20'
      //       viewBox='0 0 20 20'
      //       fill='none'
      //       xmlns='http://www.w3.org/2000/svg'>
      //       <path
      //         d='M18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM9.5 7.5C9.5 8.33 8.83 9 8 9H7V11H5.5V5H8C8.83 5 9.5 5.67 9.5 6.5V7.5ZM14.5 9.5C14.5 10.33 13.83 11 13 11H10.5V5H13C13.83 5 14.5 5.67 14.5 6.5V9.5ZM18.5 6.5H17V7.5H18.5V9H17V11H15.5V5H18.5V6.5ZM7 7.5H8V6.5H7V7.5ZM2 4H0V18C0 19.1 0.9 20 2 20H16V18H2V4ZM12 9.5H13V6.5H12V9.5Z'
      //         fill='#999999'
      //       />
      //     </svg>
      //   );
      // case 'repeat':
      //   return (
      //     <svg
      //       className={classNames({ [styles[`svg${size}`]]: size })}
      //       width='22'
      //       height='16'
      //       viewBox='0 0 22 16'
      //       fill='none'
      //       xmlns='http://www.w3.org/2000/svg'>
      //       <path
      //         d='M18 4L14 8H17C17 11.31 14.31 14 11 14C9.99 14 9.03 13.75 8.2 13.3L6.74 14.76C7.97 15.54 9.43 16 11 16C15.42 16 19 12.42 19 8H22L18 4ZM5 8C5 4.69 7.69 2 11 2C12.01 2 12.97 2.25 13.8 2.7L15.26 1.24C14.03 0.46 12.57 0 11 0C6.58 0 3 3.58 3 8H0L4 12L8 8H5Z'
      //         fill='#999999'
      //       />
      //     </svg>
      //   );
    }
  };

  return <div className={styles.svgWrapper}>{icon()}</div>;
}
