"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import type { Organisation } from "@/lib/cms/types";

type OrganisationSheetItem = Pick<
  Organisation,
  "id" | "name" | "shortDescription" | "websiteUrl"
> & {
  floorArea: Pick<Organisation["floorArea"], "name" | "slug" | "svgZoneId">;
};

type OrganisationDetailSheetProps = {
  organisation: OrganisationSheetItem | null;
  onClose: () => void;
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(17, 17, 17, 0.18)",
  display: "flex",
  justifyContent: "flex-end",
  padding: "1rem",
  zIndex: 20,
};

const panelStyle: CSSProperties = {
  width: "min(28rem, 100%)",
  height: "100%",
  backgroundColor: "#f7f5ef",
  border: "1px solid #111111",
  padding: "1.5rem",
  display: "grid",
  alignContent: "start",
  gap: "1rem",
  boxShadow: "-10px 0 0 #111111",
};

export function OrganisationDetailSheet({
  organisation,
  onClose,
}: OrganisationDetailSheetProps) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!organisation) {
      return undefined;
    }

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    closeButtonRef.current?.focus();

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [organisation, onClose]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements || focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstElement || !dialogRef.current?.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }

      return;
    }

    if (activeElement === lastElement || !dialogRef.current?.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!organisation) {
    return null;
  }

  return (
    <div style={overlayStyle}>
      <aside
        aria-labelledby={`organisation-title-${organisation.id}`}
        aria-modal="true"
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
        role="dialog"
        style={panelStyle}
        tabIndex={-1}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
          }}
        >
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Organisation
            </p>
            <h2
              id={`organisation-title-${organisation.id}`}
              style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 0.95 }}
            >
              {organisation.name}
            </h2>
          </div>
          <button
            aria-label={`Schliessen ${organisation.name}`}
            onClick={onClose}
            ref={closeButtonRef}
            style={{
              border: "1px solid #111111",
              backgroundColor: "#ffffff",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
            }}
            type="button"
          >
            Schliessen
          </button>
        </div>

        <p
          style={{
            margin: 0,
            padding: "0.625rem 0.75rem",
            border: "1px solid #111111",
            backgroundColor: "#fffdf8",
            width: "fit-content",
          }}
        >
          {organisation.floorArea.name}
        </p>

        <p style={{ margin: 0, lineHeight: 1.7 }}>{organisation.shortDescription}</p>

        <a
          href={organisation.websiteUrl}
          rel="noreferrer"
          style={{
            width: "fit-content",
            color: "#111111",
            textDecorationThickness: "0.1em",
            textUnderlineOffset: "0.18em",
          }}
          target="_blank"
        >
          Website besuchen
        </a>
      </aside>
    </div>
  );
}
