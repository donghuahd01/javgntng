import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  PiggyBank,
  Plus,
  Minus,
  Sparkles,
  Trash2,
  Calendar,
  CheckCircle2,
  Coins,
  Target,
  Award,
  History,
  Laptop,
  Smartphone,
  Plane,
  Car,
  Home,
  Heart,
  X,
  TrendingUp,
  AlertCircle,
  Gift,
  Clock,
} from "lucide-react";
import { PiggyGoal, PiggyTransaction } from "../types";

interface PiggyBankViewProps {
  onBack: () => void;
}

// Icon mapper
const ICON_MAP = {
  piggy: PiggyBank,
  laptop: Laptop,
  phone: Smartphone,
  plane: Plane,
  car: Car,
  home: Home,
  heart: Heart,
};

// Initial default demo data if localStorage is empty
const DEFAULT_GOALS: PiggyGoal[] = [
  {
    id: "goal-1",
    title: "Laptop Kerja Baru",
    targetAmount: 8000000,
    currentAmount: 4800000,
    targetDate: "2026-12-31",
    categoryIcon: "laptop",
    colorTheme: "from-purple-600 to-pink-600",
    createdAt: new Date().toISOString(),
    isCompleted: false,
  },
  {
    id: "goal-2",
    title: "Liburan Ke Bali",
    targetAmount: 3000000,
    currentAmount: 1850000,
    targetDate: "2026-10-15",
    categoryIcon: "plane",
    colorTheme: "from-cyan-600 to-blue-600",
    createdAt: new Date().toISOString(),
    isCompleted: false,
  },
];

const DEFAULT_TRANSACTIONS: PiggyTransaction[] = [
  {
    id: "tx-1",
    goalId: "goal-1",
    type: "deposit",
    amount: 500000,
    note: "Setoran rutin gaji bulanan",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "tx-2",
    goalId: "goal-2",
    type: "deposit",
    amount: 250000,
    note: "Sisa jajan mingguan",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const PiggyBankView: React.FC<PiggyBankViewProps> = ({ onBack }) => {
  const [goals, setGoals] = useState<PiggyGoal[]>(() => {
    const saved = localStorage.getItem("JAVA_TOOLS_PIGGY_GOALS");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_GOALS;
      }
    }
    return DEFAULT_GOALS;
  });

  const [transactions, setTransactions] = useState<PiggyTransaction[]>(() => {
    const saved = localStorage.getItem("JAVA_TOOLS_PIGGY_TXS");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TRANSACTIONS;
      }
    }
    return DEFAULT_TRANSACTIONS;
  });

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<PiggyGoal | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showTransactionModal, setShowTransactionModal] = useState<{
    type: "deposit" | "withdraw";
    goalId: string;
  } | null>(null);

  const [showCelebration, setShowCelebration] = useState<PiggyGoal | null>(null);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState<string>("");
  const [newTarget, setNewTarget] = useState<string>("");
  const [newInitial, setNewInitial] = useState<string>("0");
  const [newDate, setNewDate] = useState<string>("");
  const [newIcon, setNewIcon] = useState<PiggyGoal["categoryIcon"]>("piggy");

  // Transaction Form State
  const [txAmount, setTxAmount] = useState<string>("");
  const [txNote, setTxNote] = useState<string>("");

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("JAVA_TOOLS_PIGGY_GOALS", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("JAVA_TOOLS_PIGGY_TXS", JSON.stringify(transactions));
  }, [transactions]);

  // If no selected goal and goals exist, default to first goal
  useEffect(() => {
    if (!selectedGoalId && goals.length > 0) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  const activeGoal = goals.find((g) => g.id === selectedGoalId) || goals[0] || null;

  // Format IDR Currency
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Format Date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate Totals
  const totalSaved = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const totalTarget = goals.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const totalProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  // Add Goal Handler
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || Number(newTarget) <= 0) return;

    const targetNum = Number(newTarget);
    const initialNum = Number(newInitial) || 0;

    const newGoal: PiggyGoal = {
      id: "goal-" + Date.now(),
      title: newTitle.trim(),
      targetAmount: targetNum,
      currentAmount: Math.min(initialNum, targetNum),
      targetDate: newDate || new Date(Date.now() + 86400000 * 90).toISOString().split("T")[0],
      categoryIcon: newIcon,
      colorTheme: "from-pink-600 to-purple-600",
      createdAt: new Date().toISOString(),
      isCompleted: initialNum >= targetNum,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setSelectedGoalId(newGoal.id);

    if (initialNum > 0) {
      const newTx: PiggyTransaction = {
        id: "tx-" + Date.now(),
        goalId: newGoal.id,
        type: "deposit",
        amount: initialNum,
        note: "Setoran awal celengan",
        timestamp: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    // Reset Form
    setNewTitle("");
    setNewTarget("");
    setNewInitial("0");
    setNewDate("");
    setShowAddModal(false);
  };

  // Deposit or Withdraw Handler
  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTransactionModal || !txAmount || Number(txAmount) <= 0) return;

    const amountNum = Number(txAmount);
    const goal = goals.find((g) => g.id === showTransactionModal.goalId);
    if (!goal) return;

    let newAmount = goal.currentAmount;
    if (showTransactionModal.type === "deposit") {
      newAmount += amountNum;
    } else {
      newAmount = Math.max(0, newAmount - amountNum);
    }

    const wasCompleted = goal.isCompleted;
    const isNowCompleted = newAmount >= goal.targetAmount;

    // Update goal amount
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goal.id) {
          return {
            ...g,
            currentAmount: newAmount,
            isCompleted: isNowCompleted,
          };
        }
        return g;
      })
    );

    // Add transaction record
    const newTx: PiggyTransaction = {
      id: "tx-" + Date.now(),
      goalId: goal.id,
      type: showTransactionModal.type,
      amount: amountNum,
      note: txNote.trim() || (showTransactionModal.type === "deposit" ? "Setor Uang" : "Tarik Uang"),
      timestamp: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Show celebration if goal reached for the first time
    if (!wasCompleted && isNowCompleted) {
      setShowCelebration({ ...goal, currentAmount: newAmount, isCompleted: true });
    }

    // Reset modal state
    setTxAmount("");
    setTxNote("");
    setShowTransactionModal(null);
  };

  // Delete Goal Handler
  const handleDeleteGoal = (goalId: string) => {
    const targetGoal = goals.find((g) => g.id === goalId);
    if (targetGoal) {
      setDeletingGoal(targetGoal);
    }
  };

  const confirmDeleteGoal = () => {
    if (!deletingGoal) return;
    const goalId = deletingGoal.id;
    setGoals((prev) => {
      const next = prev.filter((g) => g.id !== goalId);
      if (selectedGoalId === goalId) {
        setSelectedGoalId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
    setTransactions((prev) => prev.filter((t) => t.goalId !== goalId));
    setDeletingGoal(null);
  };

  // Break / Complete Piggy Bank
  const handleBreakPiggy = (goal: PiggyGoal) => {
    setShowCelebration(goal);
  };

  return (
    <div className="space-y-5 animate-fade-in text-purple-100">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-800/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 text-xs font-semibold border border-purple-700/40 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-pink-400" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-600/30">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-wide uppercase">
              Celengan Online
            </h1>
            <p className="text-[10px] text-purple-300/70 font-mono">
              Digital Savings & Financial Goals
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-md border border-pink-400/50 transition-all active:scale-90"
          title="Tambah Target Celengan Baru"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Overall Savings Summary Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1b0a38] via-[#14072b] to-[#0d031d] border border-pink-500/30 p-5 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-pink-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pink-300 tracking-wider uppercase flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-pink-400" />
              Total Saldo Seluruh Celengan
            </span>
            <span className="text-[10px] font-mono bg-purple-900/60 text-purple-200 border border-purple-700/50 px-2.5 py-0.5 rounded-full">
              {goals.length} Target Aktif
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              {formatIDR(totalSaved)}
            </h2>
            <div className="flex items-center justify-between mt-1 text-xs text-purple-300/80 font-mono">
              <span>Target Keseluruhan:</span>
              <span className="font-bold text-pink-200">{formatIDR(totalTarget)}</span>
            </div>
          </div>

          {/* Combined Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-purple-300/70">Progres Pengumpulan Dana</span>
              <span className="font-black text-cyan-300">{totalProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-purple-950/80 border border-purple-800/60 p-0.5 shadow-inner relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 transition-all duration-500 relative"
                style={{ width: `${totalProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Cards Selection Carousel / Horizontal Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-pink-400" />
            Pilih Target Tabungan
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-[11px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Buat Target</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {goals.map((g) => {
            const isSelected = g.id === selectedGoalId;
            const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
            const IconComp = ICON_MAP[g.categoryIcon] || PiggyBank;

            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoalId(g.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left min-w-[200px] flex-shrink-0 transition-all active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-900/90 via-fuchsia-950/90 to-purple-950/90 border-pink-400 shadow-lg shadow-pink-600/20"
                    : "bg-purple-950/40 border-purple-800/40 hover:bg-purple-900/30 text-purple-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md ${
                    isSelected
                      ? "bg-gradient-to-tr from-pink-500 to-purple-600"
                      : "bg-purple-900/70 border border-purple-700/50"
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-xs text-white truncate">{g.title}</h3>
                  <div className="flex items-center justify-between text-[10px] text-purple-300/80 font-mono mt-0.5">
                    <span>{pct}%</span>
                    <span className="font-semibold text-pink-300">{formatIDR(g.currentAmount)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Goal Detailed View & Controls */}
      {activeGoal ? (
        <div className="rounded-3xl bg-[#12082b]/90 border border-purple-500/30 p-5 space-y-5 shadow-2xl relative overflow-hidden">
          {/* Active Goal Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-purple-800/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 border border-pink-400/50 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
                {React.createElement(ICON_MAP[activeGoal.categoryIcon] || PiggyBank, {
                  className: "w-6 h-6",
                })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-white">{activeGoal.title}</h2>
                  {activeGoal.isCompleted && (
                    <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      TERCAPAI
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-purple-300/70 font-mono flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3 text-pink-400" />
                  Target Selesai: {formatDate(activeGoal.targetDate)}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDeleteGoal(activeGoal.id)}
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/50 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all"
              title="Hapus Celengan Ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Goal Progress Ring & Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-purple-950/40 border border-purple-800/30 p-4 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[11px] text-purple-300/80 font-mono uppercase tracking-wider">
                Terkumpul Saat Ini
              </span>
              <div className="text-2xl font-black text-pink-300 tracking-tight">
                {formatIDR(activeGoal.currentAmount)}
              </div>
              <div className="text-[11px] text-purple-300/70 font-mono flex items-center justify-between pt-1">
                <span>Target: {formatIDR(activeGoal.targetAmount)}</span>
                <span>Sisa: {formatIDR(Math.max(0, activeGoal.targetAmount - activeGoal.currentAmount))}</span>
              </div>
            </div>

            {/* Circular or Bar Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-purple-200">Pencapaian Target</span>
                <span className="text-cyan-300 text-sm">
                  {Math.min(100, Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100))}%
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-purple-950 border border-purple-800/60 p-0.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_#ec4899]"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100)
                    )}%`,
                  }}
                />
              </div>

              {activeGoal.currentAmount >= activeGoal.targetAmount && (
                <button
                  onClick={() => handleBreakPiggy(activeGoal)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 animate-pulse border border-amber-300/50"
                >
                  <Gift className="w-4 h-4 text-amber-200" />
                  <span>Pecahkan Celengan! (Pencapaian 100%)</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: Setor & Tarik */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setShowTransactionModal({
                  type: "deposit",
                  goalId: activeGoal.id,
                })
              }
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-950/40 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Setor Uang</span>
            </button>

            <button
              onClick={() =>
                setShowTransactionModal({
                  type: "withdraw",
                  goalId: activeGoal.id,
                })
              }
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-900/80 to-pink-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 font-bold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Minus className="w-4 h-4" />
              <span>- Tarik Uang</span>
            </button>
          </div>

          {/* Daily Saving Tip calculation */}
          {activeGoal.targetAmount > activeGoal.currentAmount && (
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-200/90">
              <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-cyan-300">Tips Menabung Kerapian Finance:</p>
                <p className="text-[11px] text-purple-300/80 mt-0.5">
                  Sisihkan sekitar{" "}
                  <strong className="text-white">
                    {formatIDR(
                      Math.ceil(
                        (activeGoal.targetAmount - activeGoal.currentAmount) / 30
                      )
                    )}
                  </strong>
                  /hari selama 30 hari kedepan untuk menuntaskan celengan ini secara konsisten.
                </p>
              </div>
            </div>
          )}

          {/* Goal Transaction Log */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-pink-400" />
                Riwayat Transaksi Celengan Ini
              </span>
              <span className="text-[10px] text-purple-300/60 font-mono">
                {transactions.filter((t) => t.goalId === activeGoal.id).length} Catatan
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
              {transactions.filter((t) => t.goalId === activeGoal.id).length === 0 ? (
                <div className="text-center py-6 text-purple-300/50 text-xs font-mono">
                  Belum ada catatan setoran atau penarikan.
                </div>
              ) : (
                transactions
                  .filter((t) => t.goalId === activeGoal.id)
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/30 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            tx.type === "deposit"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                              : "bg-rose-950/80 text-rose-400 border border-rose-500/40"
                          }`}
                        >
                          {tx.type === "deposit" ? (
                            <Plus className="w-3.5 h-3.5" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{tx.note}</p>
                          <p className="text-[10px] text-purple-300/60 font-mono flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {formatDate(tx.timestamp)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-mono font-bold ${
                          tx.type === "deposit" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {tx.type === "deposit" ? "+" : "-"} {formatIDR(tx.amount)}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 space-y-3 rounded-3xl bg-purple-950/30 border border-purple-800/30 p-6">
          <PiggyBank className="w-12 h-12 text-purple-400/50 mx-auto" />
          <p className="text-xs text-purple-300/80">Belum ada target celengan.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
          >
            Buat Celengan Pertama
          </button>
        </div>
      )}

      {/* MODAL: Deposit or Withdraw Form */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#140a2f] border border-pink-500/40 p-6 space-y-5 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => {
                setShowTransactionModal(null);
                setTxAmount("");
                setTxNote("");
              }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-purple-900/40 text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                {showTransactionModal.type === "deposit" ? (
                  <>
                    <Plus className="w-5 h-5 text-emerald-400" />
                    Setor Uang Ke Celengan
                  </>
                ) : (
                  <>
                    <Minus className="w-5 h-5 text-rose-400" />
                    Tarik Uang Dari Celengan
                  </>
                )}
              </h3>
              <p className="text-xs text-purple-300/70">
                {goals.find((g) => g.id === showTransactionModal.goalId)?.title}
              </p>
            </div>

            <form onSubmit={handleProcessTransaction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  min="1000"
                  placeholder="Masukkan nominal, contoh: 50000"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                  className="w-full py-3 px-4 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-white text-sm font-mono placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Quick Presets for Deposit */}
              {showTransactionModal.type === "deposit" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-purple-300/70 uppercase tracking-wider font-mono">
                    Nominal Cepat:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                    {[10000, 20000, 50000, 100000, 200000, 500000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTxAmount(preset.toString())}
                        className="py-1.5 px-2 rounded-xl bg-purple-900/40 hover:bg-pink-600/30 border border-purple-700/40 text-purple-200 hover:text-white font-semibold transition-all text-[11px]"
                      >
                        +{preset / 1000}rb
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                  Catatan / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sisa jajan, Hadiah, Keperluan mendadak"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full py-3 px-4 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-white text-xs placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 ${
                  showTransactionModal.type === "deposit"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40"
                    : "bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 shadow-rose-900/40"
                }`}
              >
                Konfirmasi {showTransactionModal.type === "deposit" ? "Setoran" : "Penarikan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Goal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#140a2f] border border-pink-500/40 p-6 space-y-5 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-purple-900/40 text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                Buat Target Celengan Baru
              </h3>
              <p className="text-xs text-purple-300/70">Atur impian & target tabungan keuanganmu</p>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-purple-200 uppercase tracking-wider">
                  Nama Target / Barang Impian
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Beli HP Baru, Liburan, Dana Darurat"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full py-3 px-4 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-purple-200 uppercase tracking-wider">
                  Target Dana (Rp)
                </label>
                <input
                  type="number"
                  min="10000"
                  placeholder="Contoh: 5000000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  required
                  className="w-full py-3 px-4 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-white font-mono placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-purple-200 uppercase tracking-wider">
                  Setoran Awal (Rp) - Opsional
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newInitial}
                  onChange={(e) => setNewInitial(e.target.value)}
                  className="w-full py-3 px-4 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-white font-mono placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-purple-200 uppercase tracking-wider">
                  Target Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full py-3 px-4 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-purple-200 uppercase tracking-wider">
                  Pilih Ikon Target
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {(
                    ["piggy", "laptop", "phone", "plane", "car", "home", "heart"] as const
                  ).map((ic) => {
                    const IcComponent = ICON_MAP[ic];
                    const isSelected = newIcon === ic;
                    return (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setNewIcon(ic)}
                        className={`p-3 rounded-2xl border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-pink-600 to-purple-600 border-pink-300 text-white shadow-md scale-105"
                            : "bg-purple-950/60 border-purple-800/40 text-purple-300 hover:text-white"
                        }`}
                      >
                        <IcComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 border border-pink-400/50 transition-all active:scale-95"
              >
                Simpan Target Celengan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL: When Piggy Bank Goal Completed */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#240a4a] via-[#1a0738] to-[#100326] border-2 border-pink-400/70 p-6 text-center space-y-5 shadow-[0_0_50px_rgba(236,72,153,0.5)] relative animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-2xl animate-bounce">
              <div className="w-full h-full rounded-[22px] bg-[#0f0426] flex items-center justify-center text-amber-300">
                <Award className="w-10 h-10 text-amber-400 drop-shadow-[0_0_12px_#f59e0b]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-pink-300 bg-pink-950/80 border border-pink-500/50 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                CELENGAN TERCAPAI 100%!
              </span>

              <h3 className="text-2xl font-black text-white tracking-tight">Selamat! 🎉</h3>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Anda berhasil mengumpulkan total{" "}
                <strong className="text-cyan-300">{formatIDR(showCelebration.targetAmount)}</strong> untuk{" "}
                <strong className="text-pink-300">"{showCelebration.title}"</strong>!
              </p>
            </div>

            <button
              onClick={() => setShowCelebration(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/40 border border-amber-300/60"
            >
              Mantap, Rayakan Impian Ini! 🚀
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#140a2f] border border-rose-500/50 p-6 space-y-5 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setDeletingGoal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-purple-900/40 text-purple-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-950/50">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-extrabold text-base text-white">
                Hapus Celengan Ini?
              </h3>
              <p className="text-xs font-bold text-pink-300 bg-purple-950/60 border border-purple-800/50 py-1 px-3 rounded-xl inline-block">
                "{deletingGoal.title}"
              </p>
              <p className="text-[11px] text-purple-300/80 leading-relaxed pt-1">
                Apakah Anda yakin ingin menghapus target celengan ini? Seluruh riwayat transaksi terkait celengan ini akan dihapus permanen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeletingGoal(null)}
                className="py-3 px-4 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 font-bold text-xs transition-all active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteGoal}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 border border-rose-400/50 transition-all active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
