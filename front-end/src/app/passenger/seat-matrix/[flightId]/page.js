'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const initialSeatMatrix = [
  [
    { seatNumber: 'A1', passenger: null },
    { seatNumber: 'A2', passenger: { id: 'PAX-1106' } },
    { seatNumber: 'A3', passenger: null },
    { seatNumber: 'A4', passenger: { id: 'PAX-5678' } },
    { seatNumber: 'A5', passenger: null },
    { seatNumber: 'A6', passenger: { id: 'PAX-1234' } },
  ],
  [
    { seatNumber: 'B1', passenger: { id: 'PAX-9999' } },
    { seatNumber: 'B2', passenger: null },
    { seatNumber: 'B3', passenger: { id: 'PAX-3333' } },
    { seatNumber: 'B4', passenger: null },
    { seatNumber: 'B5', passenger: { id: 'PAX-4444' } },
    { seatNumber: 'B6', passenger: null },
  ],
  [
    { seatNumber: 'C1', passenger: null },
    { seatNumber: 'C2', passenger: null },
    { seatNumber: 'C3', passenger: null },
    { seatNumber: 'C4', passenger: { id: 'PAX-2222' } },
    { seatNumber: 'C5', passenger: null },
    { seatNumber: 'C6', passenger: null },
  ],
  [
    { seatNumber: 'D1', passenger: null },
    { seatNumber: 'D2', passenger: null },
    { seatNumber: 'D3', passenger: null },
    { seatNumber: 'D4', passenger: { id: 'PAX-2222' } },
    { seatNumber: 'D5', passenger: null },
    { seatNumber: 'D6', passenger: null },
  ],
  [
    { seatNumber: 'E1', passenger: null },
    { seatNumber: 'E2', passenger: null },
    { seatNumber: 'E3', passenger: null },
    { seatNumber: 'E4', passenger: { id: 'PAX-2222' } },
    { seatNumber: 'E5', passenger: null },
    { seatNumber: 'E6', passenger: null },
  ],
  [
    { seatNumber: 'F1', passenger: null },
    { seatNumber: 'F2', passenger: null },
    { seatNumber: 'F3', passenger: null },
    { seatNumber: 'F4', passenger: { id: 'PAX-2222' } },
    { seatNumber: 'F5', passenger: null },
    { seatNumber: 'F6', passenger: null },
  ],
];

export default function SeatMatrixPage() {
  const { flightId } = useParams();
  const router = useRouter();

  const [seatMatrix, setSeatMatrix] = useState(initialSeatMatrix);
  const [selectedSeat, setSelectedSeat] = useState(null); // { rowIdx, seatIdx }
  const [bookingMessage, setBookingMessage] = useState('');

  const handleSeatClick = (rowIdx, seatIdx) => {
    const seat = seatMatrix[rowIdx][seatIdx];
    if (seat.passenger) return;

    setSelectedSeat({ rowIdx, seatIdx });
  };

  const handleBooking = () => {
    if (!selectedSeat) return;

    const { rowIdx, seatIdx } = selectedSeat;
    const updatedMatrix = [...seatMatrix];
    updatedMatrix[rowIdx][seatIdx] = {
      ...updatedMatrix[rowIdx][seatIdx],
      passenger: { id: 'NEW-PASSENGER' },
    };

    setSeatMatrix(updatedMatrix);
    setBookingMessage(
      `Seat ${updatedMatrix[rowIdx][seatIdx].seatNumber} booking confirmed! Redirecting to dashboard...`
    );
    setSelectedSeat(null);

    setTimeout(() => {
      router.push('/passenger/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Flight {flightId} Seat Map</h1>

      {bookingMessage && (
        <div className="mb-4 text-green-700 font-semibold text-center">
          {bookingMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md w-fit mx-auto border border-gray-300 flex flex-col gap-3">
        {seatMatrix.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-6">
            {/* Left side */}
            <div className="flex gap-2">
              {row.slice(0, 3).map((seat, seatIdx) => {
                const isSelected =
                  selectedSeat &&
                  selectedSeat.rowIdx === rowIdx &&
                  selectedSeat.seatIdx === seatIdx;

                return (
                  <div
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(rowIdx, seatIdx)}
                    className={`p-2 border rounded-xl shadow-md text-sm w-20 h-12 flex items-center justify-center font-semibold text-white cursor-pointer ${
                      seat.passenger
                        ? 'bg-red-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-500'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {seat.seatNumber}
                  </div>
                );
              })}
            </div>

            <div className="w-4" />

            {/* Right side */}
            <div className="flex gap-2">
              {row.slice(3, 6).map((seat, seatIdx) => {
                const trueSeatIdx = seatIdx + 3;
                const isSelected =
                  selectedSeat &&
                  selectedSeat.rowIdx === rowIdx &&
                  selectedSeat.seatIdx === trueSeatIdx;

                return (
                  <div
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(rowIdx, trueSeatIdx)}
                    className={`p-2 border rounded-xl shadow-md text-sm w-20 h-12 flex items-center justify-center font-semibold text-white cursor-pointer ${
                      seat.passenger
                        ? 'bg-red-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-500'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {seat.seatNumber}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedSeat && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBooking}
            className="px-6 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
          >
            Book Selected Seat
          </button>
        </div>
      )}
    </div>
  );
}
