"use client";
// hooks/useListKeys.ts -> list entries ke liye stable keys (index key se AI suggestion galat card me chali jati)
import { useState } from "react";

const mk = () => Math.random().toString(36).slice(2);

export function useListKeys(length: number) {
  const [keys, setKeys] = useState<string[]>(() => Array.from({ length }, mk));
  return {
    keys,
    add: () => setKeys((k) => [...k, mk()]),
    remove: (i: number) => setKeys((k) => k.filter((_, x) => x !== i)),
  };
}
