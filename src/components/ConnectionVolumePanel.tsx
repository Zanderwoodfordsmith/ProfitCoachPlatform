"use client";

import { useMemo, useState } from "react";
import {
  connectionRequestsPerWeek,
  connectionVolumeStatus,
  inclusiveDays,
  weeksFromInclusiveDays,
} from "@/lib/connectionVolume";

const LOW_CR_SAMPLE = 300;

export function ConnectionVolumePanel({
  connectionRequests,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  connectionRequests: number;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}) {
  const [ssi70Plus, setSsi70Plus] = useState(false);
  const [ssiScore, setSsiScore] = useState("");

  const days = useMemo(
    () => inclusiveDays(startDate, endDate),
    [startDate, endDate],
  );
  const weeks =
    days !== null && days >= 1 ? weeksFromInclusiveDays(days) : 0;
  const perWeek =
    weeks > 0 && connectionRequests > 0
      ? connectionRequestsPerWeek(connectionRequests, weeks)
      : 0;

  const volStatus = useMemo(
    () => (weeks > 0 ? connectionVolumeStatus(perWeek) : null),
    [perWeek, weeks],
  );

  const rangeBad = Boolean(startDate && endDate && days === null);
  const lowSample =
    connectionRequests > 0 &&
    connectionRequests < LOW_CR_SAMPLE &&
    days !== null &&
    !rangeBad;

  const volBadge =
    volStatus === "green"
      ? { dot: "bg-emerald-500", text: "text-emerald-800", label: "Good" }
      : volStatus === "yellow"
        ? { dot: "bg-amber-500", text: "text-amber-800", label: "OK" }
        : volStatus === "red"
          ? { dot: "bg-rose-500", text: "text-rose-800", label: "Low" }
          : null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 shadow-sm">
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        <label className="flex flex-col gap-0.5 text-[11px] font-medium text-zinc-500">
          Start
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-8 rounded border border-zinc-200 bg-white px-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </label>
        <label className="flex flex-col gap-0.5 text-[11px] font-medium text-zinc-500">
          End
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-8 rounded border border-zinc-200 bg-white px-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-zinc-600">
          <input
            type="checkbox"
            checked={ssi70Plus}
            onChange={(e) => {
              setSsi70Plus(e.target.checked);
              if (e.target.checked) setSsiScore("");
            }}
            className="h-3.5 w-3.5 rounded border-zinc-300 text-blue-600"
          />
          SSI 70+
        </label>

        <label className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          SSI
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            placeholder="—"
            value={ssiScore}
            disabled={ssi70Plus}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 3);
              setSsiScore(v);
              if (v) setSsi70Plus(false);
            }}
            onBlur={() => {
              if (ssiScore === "") return;
              const n = Number.parseInt(ssiScore, 10);
              if (!Number.isFinite(n)) setSsiScore("");
              else if (n > 100) setSsiScore("100");
            }}
            className="h-8 w-14 rounded border border-zinc-200 bg-white px-1.5 text-center text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-200 disabled:bg-zinc-50"
          />
        </label>
      </div>

      {rangeBad ? (
        <p className="mt-1.5 text-[11px] text-rose-600">End before start.</p>
      ) : null}

      {connectionRequests > 0 && days !== null && !rangeBad ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-600">
          <span className="font-medium text-zinc-800">
            ~{Math.round(perWeek)}/week
          </span>
          <span>{`· ${days}d · ${weeks.toFixed(weeks % 1 === 0 ? 0 : 1)}wk`}</span>
          {volBadge ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-medium ${volBadge.text}`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${volBadge.dot}`}
                aria-hidden
              />
              {volBadge.label}
            </span>
          ) : null}
        </div>
      ) : null}

      {lowSample ? (
        <p className="mt-1 text-[11px] text-amber-800/90">
          &lt;{LOW_CR_SAMPLE} CRs — rates are noisy.
        </p>
      ) : null}
    </div>
  );
}
