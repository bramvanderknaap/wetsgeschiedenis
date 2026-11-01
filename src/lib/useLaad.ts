import { useEffect, useState } from "react";

export type Laad<T> =
  | { status: "laden"; data?: T }
  | { status: "klaar"; data: T }
  | { status: "fout"; fout: Error; data?: T };

/** Laadt data en houdt de vorige data vast tijdens het opnieuw laden (geen flikkering). */
export function useLaad<T>(fn: () => Promise<T>, deps: unknown[]): Laad<T> {
  const [staat, zet] = useState<Laad<T>>({ status: "laden" });
  useEffect(() => {
    let actief = true;
    zet((s) => ({ status: "laden", data: s.data }));
    fn().then(
      (data) => actief && zet({ status: "klaar", data }),
      (fout: Error) => actief && zet((s) => ({ status: "fout", fout, data: s.data })),
    );
    return () => {
      actief = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return staat;
}
