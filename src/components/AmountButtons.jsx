import React from "react";

export default function AmountButtons({ setSelectedAmount }) {
  return (
    <div className="button-grid">
      {[10, 20, 50, 100].map(val => (
        <button
          key={val}
          onClick={() => setSelectedAmount(val)}
          className="amount-button"
        >
          ${val}
        </button>
      ))}
    </div>
  );
}