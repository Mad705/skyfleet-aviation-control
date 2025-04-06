// components/FlightStatusStepper.tsx
'use client';

import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

const statusFlow = [
  'Scheduled',
  'Approved',
  'Boarding',
  'Ready for Takeoff',
  'Departed',
  'In Air',
  'Landing',
  'Landed',
  'Arrived at Gate',
  'Completed',
];

export default function FlightStatusStepper({ currentStatus }) {
  const safeStatus = currentStatus?.toLowerCase?.() ?? '';
  const currentIndex = statusFlow.findIndex(
    (status) => status.toLowerCase() === safeStatus
  );

  return (
    <div className="flex flex-row items-center gap-2 overflow-x-auto py-2">
      {statusFlow.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="flex flex-col items-center text-xs min-w-[100px]">
            <div
              className={clsx(
                'flex items-center justify-center w-6 h-6 rounded-full border-2',
                {
                  'bg-green-600 text-white border-green-600': isCompleted,
                  'bg-blue-600 text-white border-blue-600': isCurrent,
                  'bg-gray-300 text-gray-700 border-gray-400': !isCompleted && !isCurrent,
                }
              )}
            >
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
            </div>
            <span
              className={clsx('mt-1 text-center text-[11px]', {
                'text-green-700': isCompleted,
                'text-blue-700 font-medium': isCurrent,
                'text-gray-500': !isCompleted && !isCurrent,
              })}
            >
              {status}
            </span>
            {index < statusFlow.length - 1 && (
              <div className="w-full h-1 bg-gray-300 mt-1 mb-1">
                <div
                  className={clsx('h-full', {
                    'bg-green-500': isCompleted,
                    'bg-blue-500': isCurrent,
                  })}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
