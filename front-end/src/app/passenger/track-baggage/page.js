'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Dummy baggage data linked to flights
const baggageData = [
  {
    flightId: 'FL001',
    baggageList: [
      { id: 'BAG001', status: 'Checked In' },
      { id: 'BAG002', status: 'In Transit' },
    ]
  },
  {
    flightId: 'FL002',
    baggageList: [
      { id: 'BAG003', status: 'Loaded' },
    ]
  }
];

// Order of baggage status stages
const baggageStages = ['Checked In', 'In Transit', 'Loaded', 'Unloaded', 'Delivered'];

export default function TrackBaggagePage() {
  const [data] = useState(baggageData);

  // Helper to get current stage index
  const getStageIndex = (status) => baggageStages.indexOf(status);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/passenger/dashboard" className="hover:underline">Dashboard</Link>
          
          <Link href="/passenger/track-flight" className="hover:underline">Track Flight</Link>
          <Link href="/passenger/track-baggage" className="hover:underline">Track baggage</Link>
          <Link href="/passenger/register-baggage" className="hover:underline">Register Baggage</Link>
        </div>
      </nav>

      <div className="pt-20 px-6">
        <h2 className="text-2xl font-bold mb-6">Track Baggage</h2>

        {data.map((flight) => (
          <div key={flight.flightId} className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Flight {flight.flightId}</h3>

            {flight.baggageList.length === 0 ? (
              <p className="text-gray-500 text-sm">No baggage registered for this flight.</p>
            ) : (
              flight.baggageList.map((bag) => {
                const currentStage = getStageIndex(bag.status);

                return (
                  <div key={bag.id} className="mb-6">
                    <p className="text-md font-medium mb-2">Baggage ID: {bag.id}</p>
                    <div className="flex items-center overflow-x-auto scrollbar-hide">
                      {baggageStages.map((stage, idx) => {
                        const isCompleted = idx < currentStage;
                        const isCurrent = idx === currentStage;

                        const dotColor = isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-yellow-400'
                          : 'bg-gray-300';

                        const textColor = isCompleted
                          ? 'text-green-600'
                          : isCurrent
                          ? 'text-yellow-600 font-semibold'
                          : 'text-gray-500';

                        return (
                          <div key={stage} className="flex flex-col items-center mx-4">
                            <div className={`w-4 h-4 rounded-full ${dotColor} mb-1`} />
                            <p className={`text-sm whitespace-nowrap ${textColor}`}>{stage}</p>
                          </div>
                        );
                      })}
                    </div>
                    <hr className="my-2 border-gray-300" />
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
