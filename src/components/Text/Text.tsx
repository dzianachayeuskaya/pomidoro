import React from 'react';
import styles from './text.module.css';
import classNames from 'classnames';

type TSizes = 24 | 20 | 16 | 14 | 12 | 10;
type TWeights = 300 | 400 | 500 | 700;

export enum EColor {
  black = 'black',
  red = 'red',
  green = 'green',
  white = 'white',
  grayF4 = 'grayF4',
  grayF3 = 'grayF3',
  grayD9 = 'grayD9',
  grayC4 = 'grayC4',
  gray99 = 'gray99',
  gray66 = 'gray66',
}

interface ITextProps {
  As?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  children?: React.ReactNode;
  size: TSizes;
  mobileSize?: TSizes;
  tabletSize?: TSizes;
  desktopSize?: TSizes;
  color?: EColor;
  weight?: TWeights;
}

export function Text(props: ITextProps) {
  const {
    As = 'span',
    color = EColor.black,
    weight = 400,
    children,
    size,
    mobileSize,
    tabletSize,
    desktopSize,
  } = props;

  const classes = classNames(
    styles[`s${size}`],
    styles[`w${weight}`],
    styles[color],
    { [styles[`m${mobileSize}`]]: mobileSize },
    { [styles[`t${tabletSize}`]]: tabletSize },
    { [styles[`d${desktopSize}`]]: desktopSize }
  );

  return <As className={classes}>{children}</As>;
}
