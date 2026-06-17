"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = { label: string | null; onClear: () => void };

export function ActiveFilterChip({ label, onClear }: Props) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={label ?? "alle"}
        layout
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.22 }}
        className="chip mono"
      >
        {label ? (
          <>
            <span>ZONE: {label}</span>
            <button type="button" aria-label="Filter entfernen" onClick={onClear}>✕</button>
          </>
        ) : (
          <span>ALLE</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
