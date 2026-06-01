import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  showBadge?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
