"use client"; // @NOTE: add in case you are using Next.js

import { useEffect, useRef, useState } from "react";

const TABS = [
  { label: "All Posts" },
  { label: "Interactions" },
  { label: "Resources" },
  { label: "Docs" },
];

export function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft;
        const clipRight = offsetLeft + offsetWidth;

        container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed(0)}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed(0)}% round 17px)`;
      }
    }
  }, [activeTab]);

  return (
    <div className="relative mx-auto flex w-fit flex-col items-center rounded-full">
      <div
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
        ref={containerRef}
      >
        <div className="relative flex w-full justify-center bg-white">
          {TABS.map((tab) => (
            <button
              className="flex h-8 items-center rounded-full p-3 font-medium text-black text-sm"
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              tabIndex={-1}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex w-full justify-center">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.label;

          return (
            <button
              className="flex h-8 items-center rounded-full p-3 font-medium text-neutral-300 text-sm"
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              ref={isActive ? activeTabRef : null}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
