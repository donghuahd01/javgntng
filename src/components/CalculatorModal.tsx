import React, { useState } from "react";
import { Calculator, ArrowLeft, Delete, RotateCcw, Equal } from "lucide-react";

interface CalculatorModalProps {
  onBack: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ onBack }) => {
  const [display, setDisplay] = useState<string>("0");
  const [equation, setEquation] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  const handleNum = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleCalculate = () => {
    try {
      const fullExpr = (equation + display).replace(/×/g, "*").replace(/÷/g, "/");
      // Safe math eval
      const res = Function(`'use strict'; return (${fullExpr})`)();
      const formattedRes = String(Number.isInteger(res) ? res : Number(res.toFixed(6)));
      setHistory((prev) => [fullExpr + " = " + formattedRes, ...prev.slice(0, 4)]);
      setDisplay(formattedRes);
      setEquation("");
    } catch (e) {
      setDisplay("Error");
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-pink-400">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Calculator Online</h2>
        </div>
      </div>

      {/* Screen Display */}
      <div className="rounded-2xl bg-[#0e071e] border border-purple-500/40 p-4 text-right shadow-inner">
        <div className="text-xs text-purple-400 font-mono h-4">{equation}</div>
        <div className="text-3xl font-bold font-mono text-pink-300 tracking-wider truncate mt-1">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 text-sm font-bold">
        <button
          onClick={handleClear}
          className="p-3.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 transition-all active:scale-95 flex items-center justify-center"
        >
          AC
        </button>
        <button
          onClick={handleDelete}
          className="p-3.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/40 transition-all active:scale-95 flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOp("%")}
          className="p-3.5 rounded-2xl bg-purple-900/50 hover:bg-purple-800/70 text-pink-300 border border-purple-700/40 transition-all active:scale-95"
        >
          %
        </button>
        <button
          onClick={() => handleOp("÷")}
          className="p-3.5 rounded-2xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 transition-all active:scale-95"
        >
          ÷
        </button>

        {["7", "8", "9"].map((n) => (
          <button
            key={n}
            onClick={() => handleNum(n)}
            className="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-100 border border-purple-800/30 transition-all active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOp("×")}
          className="p-3.5 rounded-2xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 transition-all active:scale-95"
        >
          ×
        </button>

        {["4", "5", "6"].map((n) => (
          <button
            key={n}
            onClick={() => handleNum(n)}
            className="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-100 border border-purple-800/30 transition-all active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOp("-")}
          className="p-3.5 rounded-2xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 transition-all active:scale-95"
        >
          -
        </button>

        {["1", "2", "3"].map((n) => (
          <button
            key={n}
            onClick={() => handleNum(n)}
            className="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-100 border border-purple-800/30 transition-all active:scale-95"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOp("+")}
          className="p-3.5 rounded-2xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 transition-all active:scale-95"
        >
          +
        </button>

        <button
          onClick={() => handleNum("0")}
          className="col-span-2 p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-100 border border-purple-800/30 transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={() => handleNum(".")}
          className="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-100 border border-purple-800/30 transition-all active:scale-95"
        >
          .
        </button>
        <button
          onClick={handleCalculate}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-600/30 border border-pink-400/50 transition-all active:scale-95 flex items-center justify-center"
        >
          <Equal className="w-5 h-5" />
        </button>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="p-3 rounded-2xl bg-[#120a27] border border-purple-800/40 text-xs space-y-1">
          <p className="text-[10px] text-purple-400 font-bold uppercase">Riwayat Hitungan:</p>
          {history.map((item, idx) => (
            <p key={idx} className="font-mono text-purple-200">{item}</p>
          ))}
        </div>
      )}
    </div>
  );
};
