"use client";
import { Tag } from "antd";
import { InternshipProgramInfo } from "../_lib/types";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {ChevronRightIcon, ChevronDownIcon} from "@heroicons/react/20/solid"

function encodeTitleToHash(title: string) {
  return title.replaceAll(" ", "-").toLowerCase();
}

export const InternshipOpeningView = ({
  program,
}: {
  program: InternshipProgramInfo;
}) => {
  const [hash, setHash] = useState<string | undefined>(undefined);

  const [hashIndex, setHashIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash?.substring(1));
    };

    onHashChange();

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("load", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("load", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (hash != null) {
      const index = program.openings.findIndex(
        (o) => encodeTitleToHash(o.title) === hash
      );
      setHashIndex(index >= 0 ? index : undefined);
    }
  }, [hash, program]);

  return (
    <div>
      {program.openings.map((opening, i) => (
        <div key={i.toString()} className="relative border-b border-slate-300 last:border-b-0">
          <div
            onClick={() => {
              if (encodeTitleToHash(opening.title) !== hash) {
                window.location.hash = encodeTitleToHash(opening.title);
              } else {
                // 스크롤 위치를 유지하면서 해시만 제거
                history.replaceState(null, '', window.location.pathname + window.location.search);
                // 수동으로 hashchange 이벤트 트리거
                window.dispatchEvent(new HashChangeEvent('hashchange'));
              }
            }}
            className="flex items-center gap-x-4 bg-slate-100 py-3 px-4 cursor-pointer"
          >
            <div
              className="anchor-dummy"
              id={encodeTitleToHash(opening.title)}
            />
            <ChevronRightIcon className={twMerge("h-5 w-5 text-gray-500 transition-transform", (hashIndex === i) ? "rotate-90" : null)} />
            <div className="flex items-baseline gap-x-2">
                <span className={twMerge("text-lg font-semibold", opening.open !== true ? 'text-gray-400' : null)}>{opening.title}</span>
                <Tag color={opening.open === true ? "processing" : "error"} className={opening.open === true ? "animate-bounce": ""}>
                {opening.open === true ? "Open!" : "Closed"}
                </Tag>
            </div>
          </div>
          {(hashIndex === i) && (
              <div
                className="markdown-content p-6 bg-white border-l border-r"
                dangerouslySetInnerHTML={{
                  __html: opening.content || "No content.",
                }}
              />
            )}
        </div>
      ))}
    </div>
  );
};
