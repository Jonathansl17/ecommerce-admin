export const calculateMovementDifference = (previous: number, current: number): number =>
  current - previous;

export const formatMovementSign = (difference: number): string =>
  difference >= 0 ? `+${difference}` : `${difference}`;
