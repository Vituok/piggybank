import React, { useState, useEffect, useRef } from "react";
import AmountButtons from "./components/AmountButtons";
import WithdrawSection from "./components/WithdrawSection";
import HistoryList from "./components/HistoryList";
import "./styles.css";

export default function App() {
  const [selectedAmount, setSelectedAmount] = useState(0);

  const [total, setTotal] = useState(() => {
    const saved = localStorage.getItem("piggybank-total");
    return saved !== null ? Number(saved) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("piggybank-history");
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("piggybank-theme");
    return saved !== null ? saved : "light";
  });

  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const fileInputRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("piggybank-total", total);
    localStorage.setItem("piggybank-history", JSON.stringify(history));
  }, [total, history]);

  useEffect(() => {
    localStorage.setItem("piggybank-theme", theme);
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleAdd = () => {
    if (selectedAmount <= 0) return;
    const now = new Date();
    const entry = {
      type: "add",
      amount: selectedAmount,
      timestamp: now.toLocaleString(),
    };
    setTotal(prev => prev + selectedAmount);
    setHistory([entry, ...history]);
    setSelectedAmount(0);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > total) {
      alert("Недостаточно средств!");
      return;
    }
    const now = new Date();
    const entry = {
      type: "withdraw",
      amount,
      timestamp: now.toLocaleString(),
    };
    setTotal(prev => prev - amount);
    setHistory([entry, ...history]);
    setWithdrawAmount("");
    setShowWithdrawInput(false);
  };

  const handleSave = () => {
    const data = {
      total,
      history,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "savings-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (
          typeof data.total === "number" &&
          Array.isArray(data.history)
        ) {
          setTotal(data.total);
          setHistory(data.history);
          alert("Данные успешно загружены!");
        } else {
          alert("Неверный формат файла.");
        }
      } catch (err) {
        alert("Ошибка при чтении файла.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`container ${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          Переключить на {theme === "light" ? "тёмную" : "светлую"} тему
        </button>
      </div>

      <h2 className="title">Копилка</h2>

      <AmountButtons setSelectedAmount={setSelectedAmount} />
      <div className="selected">
        Выбрано: <strong>${selectedAmount}</strong>
      </div>
      <button onClick={handleAdd} className="confirm-button">
        Подтвердить
      </button>

      <WithdrawSection
        show={showWithdrawInput}
        setShow={setShowWithdrawInput}
        value={withdrawAmount}
        setValue={setWithdrawAmount}
        onWithdraw={handleWithdraw}
      />

      <div className="total">
        <h3>Общая сумма: ${total}</h3>
        <h4>Журнал операций:</h4>
        <HistoryList history={history} />
      </div>

      <div className="save-load-buttons">
        <button onClick={handleSave}>💾 Сохранить</button>
        <button onClick={handleLoadClick}>📂 Загрузить</button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
