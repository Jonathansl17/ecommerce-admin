'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CUSTOM_ORDERS_MESSAGES } from '../constants/messages';
import { TAB_NAV_STYLES } from '../constants/styles';

const tabs = [
  { label: CUSTOM_ORDERS_MESSAGES.tabs.stockProductos, href: '/products' },
  { label: CUSTOM_ORDERS_MESSAGES.tabs.pedidosPersonalizados, href: '/custom-orders' },
];

export function ProductAreaTabNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sección de productos" className={TAB_NAV_STYLES.wrapper}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${TAB_NAV_STYLES.tab} ${isActive ? TAB_NAV_STYLES.active : TAB_NAV_STYLES.inactive}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
