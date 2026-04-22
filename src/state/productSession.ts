import { useEffect, useState } from 'react';

export type OtterPersonalityTag = '勇敢' | '温柔' | '好奇' | '俏皮';

export type ProductSession = {
  guardianName: string;
  childName: string;
  otterName: string;
  personalityTags: OtterPersonalityTag[];
  retellDraft: string;
  hasEntered: boolean;
  hasAdopted: boolean;
};

const PRODUCT_SESSION_STORAGE_KEY = 'otter-planet:product-session';

export const defaultProductSession: ProductSession = {
  guardianName: '',
  childName: '',
  otterName: '',
  personalityTags: [],
  retellDraft: '',
  hasEntered: false,
  hasAdopted: false,
};

export function readProductSession(): ProductSession {
  if (typeof window === 'undefined') {
    return defaultProductSession;
  }

  const rawValue = window.localStorage.getItem(PRODUCT_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return defaultProductSession;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<ProductSession>;

    return {
      guardianName: parsedValue.guardianName ?? '',
      childName: parsedValue.childName ?? '',
      otterName: parsedValue.otterName ?? '',
      personalityTags: (parsedValue.personalityTags as OtterPersonalityTag[] | undefined) ?? [],
      retellDraft: parsedValue.retellDraft ?? '',
      hasEntered: parsedValue.hasEntered ?? false,
      hasAdopted: parsedValue.hasAdopted ?? false,
    };
  } catch {
    return defaultProductSession;
  }
}

export function writeProductSession(session: ProductSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PRODUCT_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function useProductSession() {
  const [session, setSession] = useState<ProductSession>(() => readProductSession());

  useEffect(() => {
    writeProductSession(session);
  }, [session]);

  const patchSession = (patch: Partial<ProductSession>) => {
    setSession((currentSession) => {
      const nextSession = {
        ...currentSession,
        ...patch,
      };

      writeProductSession(nextSession);
      return nextSession;
    });
  };

  const resetSession = () => {
    writeProductSession(defaultProductSession);
    setSession(defaultProductSession);
  };

  return {
    session,
    patchSession,
    resetSession,
    hasCompanionProfile:
      Boolean(session.otterName) && session.personalityTags.length > 0 && session.hasAdopted,
  };
}
