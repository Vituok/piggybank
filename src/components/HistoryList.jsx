import React from "react";

export default function HistoryList({ history }) {
  return (
    <ul className="history-list">
      {history.map((entry, index) => (
        <li key={index} className={entry.type === "add" ? "add" : "withdraw"}>
          [{entry.timestamp}] {entry.type === "add" ? "+" : "-"}${entry.amount}
        </li>
      ))}
    </ul>
  );
}