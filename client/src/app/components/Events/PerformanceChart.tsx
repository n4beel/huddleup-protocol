"use client";
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart2, Clock } from "lucide-react";

type PerfPoint = {
  date: string; // e.g. '2025-10-01'
  verified: number; // number of verified participants or PYUSD disbursed (depending)
};

type EventPerformanceCardProps = {
  title?: string;
  subtitle?: string;
  data: PerfPoint[]; // expected sorted by date (asc)
  unit?: string; // e.g. 'participants' or 'PYUSD'
};

const formatDateShort = (iso: string) => {
  // returns MMM D e.g. "Oct 1"
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const EventPerformanceCard: React.FC<EventPerformanceCardProps> = ({
  title = "Event Performance",
  subtitle = "Real-time insights",
  data,
  unit = "participants",
}) => {
  // calculate min/max for Y axis padding
  const values = data.map((d) => d.verified);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const yDomainPad = Math.max(1, Math.round((max - min) * 0.15));

  return (
    <div className='w-full bg-white border border-gray-200 shadow-lg rounded-xl p-4 mt-2'>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {subtitle}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Last</div>
          <div className="text-sm font-medium text-gray-800">
            {data.length ? formatDateShort(data[data.length - 1].date) : "--"}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.18} />
                <stop offset="60%" stopColor="#14b8a6" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0ea5a4" stopOpacity={1} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              domain={[Math.max(0, min - yDomainPad), max + yDomainPad]}
              hide={true}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #eef2f7",
              }}
              formatter={(value: number) => [`${value} ${unit}`, unit]}
              labelFormatter={(label: string) =>
                new Date(label).toLocaleDateString()
              }
            />

            <Area
              type="monotone"
              dataKey="verified"
              stroke="url(#strokeGrad)"
              strokeWidth={2}
              fill="url(#gradVerified)"
              activeDot={{ r: 4 }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer summary */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
        <div>
          <div className="text-xs text-gray-500">Total verified</div>
          <div className="text-sm font-semibold text-gray-800">
            {values.reduce((s, v) => s + v, 0)} {unit}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Average / day</div>
          <div className="text-sm font-semibold text-gray-800">
            {data.length
              ? Math.round(values.reduce((s, v) => s + v, 0) / data.length)
              : 0}{" "}
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPerformanceCard;
