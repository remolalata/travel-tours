import type { CSSProperties } from 'react';

export function getMultiLineClampStyle(lines: number): CSSProperties {
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
  };
}

export function getNoUnderlineHoverStyle(): CSSProperties {
  return {
    backgroundImage: 'none',
    backgroundSize: '0 0',
  };
}
