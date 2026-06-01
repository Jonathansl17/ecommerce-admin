import type { CustomOrderStatus } from '../types/custom-orders.types';

export const KANBAN_BOARD_STYLES = {
  wrapper: 'overflow-x-auto pb-4',
  grid: 'flex gap-4 min-w-max',
} as const;

export const KANBAN_COLUMN_STYLES = {
  base: 'flex flex-col w-72 rounded-xl border border-foreground/10 bg-foreground/[0.02] transition-colors',
  dragOver: 'border-foreground/30 bg-foreground/[0.05]',
  header: 'flex items-center justify-between px-4 py-3 border-b border-foreground/10',
  title: 'text-sm font-semibold text-foreground',
  counter: 'rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/60',
  body: 'flex flex-col gap-3 p-3 min-h-[200px]',
  emptyLabel: 'text-center text-xs text-foreground/40 py-6',
} as const;

export const KANBAN_CARD_STYLES = {
  base: 'rounded-lg border border-foreground/10 bg-background p-3 shadow-sm cursor-grab active:cursor-grabbing active:opacity-60 active:shadow-md transition-all',
  dragging: 'opacity-60',
  productName: 'text-sm font-medium text-foreground leading-snug',
  clientName: 'text-xs text-foreground/60 mt-0.5',
  details: 'text-xs text-foreground/50 mt-1 line-clamp-2',
  date: 'text-xs text-foreground/40 mt-2',
  footer: 'mt-3 flex items-center justify-between gap-2',
  badge: 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
  moveSelect: 'rounded-md border border-foreground/20 bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30',
  updatingLabel: 'text-xs text-foreground/50 italic',
} as const;

export const STATUS_BADGE_STYLES: Record<CustomOrderStatus, string> = {
  received: 'bg-blue-100 text-blue-700',
  in_process: 'bg-yellow-100 text-yellow-700',
  ready: 'bg-green-100 text-green-700',
  sold: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
};

export const TAB_NAV_STYLES = {
  wrapper: 'flex gap-1 border-b border-foreground/10 mb-6',
  tab: 'px-4 py-2 text-sm font-medium transition-colors',
  active: 'border-b-2 border-foreground text-foreground',
  inactive: 'text-foreground/50 hover:text-foreground',
} as const;
