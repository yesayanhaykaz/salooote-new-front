"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  CheckSquare,
  Heart,
  Users,
  Music,
  Camera,
  Flower2,
  Utensils,
  Car,
  Mail,
  Shirt,
  Scissors,
  Building2,
  Cake,
  Sparkles,
  Pencil,
  RotateCcw,
  Plus,
  Trash2,
  X,
  ChevronDown,
  PartyPopper,
  TrendingUp,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "salooote_event_plan";

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Anniversary", "Other"];

const DEFAULT_CHECKLIST = [
  { id: "venue",        label: "Choose venue",               icon: Building2,  done: false },
  { id: "photographer", label: "Book photographer",          icon: Camera,     done: false },
  { id: "cake",         label: "Order wedding cake",         icon: Cake,       done: false },
  { id: "florist",      label: "Book florist",               icon: Flower2,    done: false },
  { id: "catering",     label: "Arrange catering",           icon: Utensils,   done: false },
  { id: "dj",           label: "Book DJ / Music",            icon: Music,      done: false },
  { id: "invitations",  label: "Send invitations",           icon: Mail,       done: false },
  { id: "attire",       label: "Choose wedding dress / suit",icon: Shirt,      done: false },
  { id: "hairmakeup",   label: "Book hair & makeup",         icon: Scissors,   done: false },
  { id: "transport",    label: "Arrange transportation",     icon: Car,        done: false },
];

const INITIAL_STATE = {
  name:      "",
  type:      "",
  date:      "",
  budget:    "",
  checklist: DEFAULT_CHECKLIST,
  vendors:   [],           // [{ id, name, note, budget }]
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatAMD(value) {
  const n = parseInt(value, 10);
  if (isNaN(n)) return "—";
  return n.toLocaleString("hy-AM") + " AMD";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white text-surface-900 placeholder:text-surface-400";

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-2 ${accent ? "bg-brand-600 text-white" : "bg-white border border-surface-200 shadow-sm"}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-white/20" : "bg-brand-50"}`}>
        <Icon size={18} className={accent ? "text-white" : "text-brand-500"} />
      </div>
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-wide ${accent ? "text-white/70" : "text-surface-400"}`}>{label}</p>
        <p className={`text-lg font-bold mt-0.5 leading-tight ${accent ? "text-white" : "text-surface-900"}`}>{value}</p>
        {sub && <p className={`text-xs mt-0.5 ${accent ? "text-white/60" : "text-surface-400"}`}>{sub}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ pct }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color = clamped > 90 ? "bg-red-500" : clamped > 70 ? "bg-amber-500" : "bg-brand-500";
  return (
    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

// ─── Setup Card ──────────────────────────────────────────────────────────────

function SetupCard({ onCreate }) {
  const [form, setForm] = useState({ name: "", type: "Wedding", date: "", budget: "" });
  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleStart = () => {
    if (!form.name.trim()) return;
    onCreate(form);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Hero mark */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-4 shadow-lg shadow-brand-200">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Plan Your Event</h1>
          <p className="text-sm text-surface-400 mt-1.5 max-w-xs">
            Set up your event details and get a beautiful planning dashboard to track everything.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={set}
              placeholder='e.g. "Our Wedding" or "Anna&apos;s Birthday"'
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Type</label>
              <div className="relative">
                <select name="type" value={form.type} onChange={set} className={`${inputCls} appearance-none pr-9`}>
                  {EVENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Date</label>
              <input type="date" name="date" value={form.date} onChange={set} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Budget (AMD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">֏</span>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={set}
                placeholder="e.g. 2500000"
                className={`${inputCls} pl-8`}
              />
            </div>
            <p className="text-xs text-surface-400 mt-1">Leave blank to skip budget tracking</p>
          </div>

          <button
            onClick={handleStart}
            disabled={!form.name.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none transition-colors shadow-sm"
          >
            <Sparkles size={15} />
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Vendor Modal ─────────────────────────────────────────────────────────

function VendorModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", note: "", budget: "" });
  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-900">Add Vendor</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={14} className="text-surface-500" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Vendor Name *</label>
            <input name="name" value={form.name} onChange={set} placeholder="e.g. Sound Wave DJ" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Note</label>
            <input name="note" value={form.note} onChange={set} placeholder="e.g. Confirmed, deposit paid" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Cost (AMD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">֏</span>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={set}
                placeholder="e.g. 150000"
                className={`${inputCls} pl-8`}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { if (form.name.trim()) { onAdd(form); onClose(); } }}
            disabled={!form.name.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-50 cursor-pointer border-none transition-colors"
          >
            <Plus size={14} /> Add Vendor
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Event Modal ─────────────────────────────────────────────────────────

function EditModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({
    name:   event.name   || "",
    type:   event.type   || "Wedding",
    date:   event.date   || "",
    budget: event.budget || "",
  });
  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-900">Edit Event</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={14} className="text-surface-500" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Name *</label>
            <input name="name" value={form.name} onChange={set} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Type</label>
              <div className="relative">
                <select name="type" value={form.type} onChange={set} className={`${inputCls} appearance-none pr-9`}>
                  {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Date</label>
              <input type="date" name="date" value={form.date} onChange={set} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Budget (AMD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">֏</span>
              <input type="number" name="budget" value={form.budget} onChange={set} className={`${inputCls} pl-8`} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }}
            disabled={!form.name.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-50 cursor-pointer border-none transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ plan, onUpdate, onReset }) {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Budget maths
  const totalBudget  = parseInt(plan.budget, 10) || 0;
  const spentBudget  = plan.vendors.reduce((sum, v) => sum + (parseInt(v.budget, 10) || 0), 0);
  const remaining    = totalBudget - spentBudget;
  const budgetPct    = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  // Checklist progress
  const doneCount  = plan.checklist.filter((t) => t.done).length;
  const totalCount = plan.checklist.length;
  const checkPct   = Math.round((doneCount / totalCount) * 100);

  // Countdown
  const days = daysUntil(plan.date);

  // Helpers
  const toggleTask = (id) => {
    const next = { ...plan, checklist: plan.checklist.map((t) => t.id === id ? { ...t, done: !t.done } : t) };
    onUpdate(next);
  };

  const addVendor = (v) => {
    const next = { ...plan, vendors: [...plan.vendors, { ...v, id: crypto.randomUUID() }] };
    onUpdate(next);
  };

  const removeVendor = (id) => {
    const next = { ...plan, vendors: plan.vendors.filter((v) => v.id !== id) };
    onUpdate(next);
  };

  const saveEdit = (fields) => {
    onUpdate({ ...plan, ...fields });
  };

  // Countdown label
  let countdownLabel = "";
  let countdownColor = "text-brand-600";
  if (days === null) countdownLabel = "Date not set";
  else if (days < 0)  { countdownLabel = `${Math.abs(days)} days ago`; countdownColor = "text-surface-400"; }
  else if (days === 0) countdownLabel = "Today!";
  else if (days === 1) countdownLabel = "Tomorrow!";
  else                { countdownLabel = `${days} days away`; }

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-surface-900 truncate">{plan.name}</h1>
            {plan.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-600 border border-brand-100">
                {plan.type}
              </span>
            )}
          </div>
          {plan.date && (
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar size={13} className="text-surface-400" />
              <span className="text-sm text-surface-500">
                {new Date(plan.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className={`text-sm font-semibold ${countdownColor}`}>· {countdownLabel}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-surface-400 border border-surface-200 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 cursor-pointer bg-white transition-colors"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Event Date"
          value={plan.date ? new Date(plan.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not set"}
          sub={days !== null && days >= 0 ? `${days} days away` : undefined}
        />
        <StatCard
          icon={DollarSign}
          label="Total Budget"
          value={totalBudget > 0 ? formatAMD(totalBudget) : "Not set"}
          sub={totalBudget > 0 ? `${budgetPct}% allocated` : undefined}
        />
        <StatCard
          icon={TrendingUp}
          label="Spent So Far"
          value={spentBudget > 0 ? formatAMD(spentBudget) : "֏ 0"}
          sub={totalBudget > 0 ? `${formatAMD(remaining)} remaining` : undefined}
        />
        <StatCard
          icon={CheckSquare}
          label="Tasks Done"
          value={`${doneCount} / ${totalCount}`}
          sub={`${checkPct}% complete`}
          accent
        />
      </div>

      {/* ── Budget progress bar ── */}
      {totalBudget > 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-surface-800">Budget Tracker</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${budgetPct > 90 ? "bg-red-50 text-red-500" : budgetPct > 70 ? "bg-amber-50 text-amber-500" : "bg-green-50 text-green-600"}`}>
              {budgetPct}% used
            </span>
          </div>
          <ProgressBar pct={budgetPct} />
          <div className="flex justify-between mt-2 text-xs text-surface-400">
            <span>Spent: <strong className="text-surface-700">{formatAMD(spentBudget)}</strong></span>
            <span>Remaining: <strong className={remaining < 0 ? "text-red-500" : "text-surface-700"}>{formatAMD(remaining)}</strong></span>
          </div>
        </div>
      )}

      {/* ── Two-column layout below ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Checklist ── */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-brand-500" />
              <p className="text-sm font-bold text-surface-900">Planning Checklist</p>
            </div>
            <span className="text-xs font-semibold text-surface-400">{doneCount}/{totalCount}</span>
          </div>

          {/* Progress mini bar */}
          <div className="px-5 pt-4">
            <ProgressBar pct={checkPct} />
            <p className="text-xs text-surface-400 mt-1.5 mb-3">{checkPct}% complete</p>
          </div>

          <ul className="px-5 pb-5 space-y-1">
            {plan.checklist.map((task) => {
              const Icon = task.icon;
              return (
                <li key={task.id}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer border-none text-left ${
                      task.done
                        ? "bg-brand-50 text-brand-700"
                        : "bg-surface-50 text-surface-700 hover:bg-surface-100"
                    }`}
                  >
                    {/* Checkbox */}
                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.done ? "bg-brand-600 border-brand-600" : "border-surface-300 bg-white"
                    }`}>
                      {task.done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <Icon size={14} className={task.done ? "text-brand-500" : "text-surface-400"} />
                    <span className={`flex-1 text-sm font-medium ${task.done ? "line-through opacity-70" : ""}`}>
                      {task.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Vendor Wishlist ── */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-brand-500" />
              <p className="text-sm font-bold text-surface-900">Vendor Wishlist</p>
            </div>
            <button
              onClick={() => setShowVendorModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 cursor-pointer border-none transition-colors"
            >
              <Plus size={12} /> Add
            </button>
          </div>

          <div className="p-5">
            {plan.vendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-3">
                  <Users size={20} className="text-brand-400" />
                </div>
                <p className="text-sm font-semibold text-surface-600">No vendors yet</p>
                <p className="text-xs text-surface-400 mt-1 mb-4 max-w-[180px]">
                  Add vendors you're considering or have booked.
                </p>
                <button
                  onClick={() => setShowVendorModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 rounded-xl hover:bg-brand-100 cursor-pointer border border-brand-100 transition-colors"
                >
                  <Plus size={12} /> Add First Vendor
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {plan.vendors.map((v) => (
                  <li key={v.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 group">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart size={13} className="text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-800 truncate">{v.name}</p>
                      {v.note && <p className="text-xs text-surface-400 mt-0.5 truncate">{v.note}</p>}
                      {v.budget && (
                        <p className="text-xs font-semibold text-brand-600 mt-0.5">{formatAMD(v.budget)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeVendor(v.id)}
                      className="w-7 h-7 flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer border-none bg-transparent transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}

                {/* Vendor total */}
                {spentBudget > 0 && (
                  <div className="mt-3 pt-3 border-t border-surface-100 flex justify-between items-center">
                    <span className="text-xs text-surface-400 font-medium">Total vendor cost</span>
                    <span className="text-sm font-bold text-surface-800">{formatAMD(spentBudget)}</span>
                  </div>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showVendorModal && (
        <VendorModal onClose={() => setShowVendorModal(false)} onAdd={addVendor} />
      )}
      {showEditModal && (
        <EditModal event={plan} onClose={() => setShowEditModal(false)} onSave={saveEdit} />
      )}

      {/* ── Reset confirm ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <RotateCcw size={20} className="text-red-500" />
            </div>
            <p className="font-bold text-surface-900 mb-1">Reset Event Plan?</p>
            <p className="text-sm text-surface-400 mb-5">
              This will clear all your event data, checklist progress, and vendors. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
                Cancel
              </button>
              <button onClick={() => { setShowResetConfirm(false); onReset(); }} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 cursor-pointer border-none transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function AccountEventsPage() {
  const [plan,   setPlan]   = useState(null);   // null = not created yet
  const [loaded, setLoaded] = useState(false);  // hydration guard

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure checklist has icon functions (they don't survive JSON, re-hydrate from DEFAULT_CHECKLIST)
        if (parsed.checklist) {
          parsed.checklist = DEFAULT_CHECKLIST.map((def) => {
            const stored = parsed.checklist.find((t) => t.id === def.id);
            return stored ? { ...def, done: stored.done } : def;
          });
        }
        setPlan(parsed);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Persist whenever plan changes
  useEffect(() => {
    if (!loaded) return;
    if (plan) {
      try {
        // Strip icon functions before serialising (not JSON-safe)
        const serialisable = {
          ...plan,
          checklist: plan.checklist.map(({ id, label, done }) => ({ id, label, done })),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable));
      } catch {}
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  }, [plan, loaded]);

  const handleCreate = (form) => {
    setPlan({
      ...INITIAL_STATE,
      name:   form.name.trim(),
      type:   form.type,
      date:   form.date,
      budget: form.budget,
    });
  };

  const handleUpdate = (next) => setPlan(next);
  const handleReset  = ()     => setPlan(null);

  // Avoid hydration mismatch
  if (!loaded) return null;

  return plan
    ? <Dashboard plan={plan} onUpdate={handleUpdate} onReset={handleReset} />
    : <SetupCard onCreate={handleCreate} />;
}
