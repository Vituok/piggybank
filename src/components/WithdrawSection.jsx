import React from "react";

export default function WithdrawSection({ show, setShow, value, setValue, onWithdraw }) {
  return (
    <div className="withdraw-section">
      <button onClick={() => setShow(prev => !prev)} className="withdraw-toggle">
        Забрать часть денег
      </button>
      {show && (
        <div className="withdraw-input-block">
          <input
            type="number"
            placeholder="Введите сумму"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="input"
          />
          <button onClick={onWithdraw} className="ok-button">OK</button>
        </div>
      )}
    </div>
  );
}