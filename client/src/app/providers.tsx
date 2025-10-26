'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/app/store/useUserStore';

export function AuthHydration() {
  const hydrate = useUserStore((state) => state.hydrate);

  useEffect(() => {
    hydrate(); // 🔥 restore Zustand state + axios headers
  }, [hydrate]);

  return null;
}
