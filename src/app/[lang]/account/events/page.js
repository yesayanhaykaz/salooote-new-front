"use client";
import { useState, useEffect } from "react";
import { Plus, Calendar, X, Pencil, Users, Trash2, PartyPopper } from "lucide-react";

const EVENT_TYPES = ["Wedding", "Birthday", "Baby Shower", "Corporate", "Graduation", "Anniversary", "Other"];

const STATUS_STYLES = {
  planning:  "bg-amber-50  text-amber-600  border-amber-200",
  confirmed: "bg-green-50  text-green-600  border-green-200",
  completed: "bg-blue-50   text-blue-600   border-blue-200",
  cancelled: "bg-red-50    text-red-500    border-red-200",
};

const GRADIENTS = [
  "from-pink-400 to-rose-500",
  "from-violet-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-green-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-cyan-500",
];

function Badge({ status }) {
  const cls = STATUS_STYLES[status] || STATUS_STYLES.planning;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}>
      {status}
    </span>
  );
}

function EventModal({ event, onClose, onSave }) {
  const isEdit = !!event?.id;
  const [form, setForm] = useState({
    name:       event?.name       || "",
    type:       event?.type       || "",
    date:       event?.date       || "",
    budget:     event?.budget     || "",
    notes:      event?.notes      || "",
    status:     event?.status     || "planning",
    vendors:    event?.vendors?.join(", ") || "",
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      id:      event?.id || crypto.randomUUID(),
      name:    form.name.trim(),
      type:    form.type,
      date:    form.date,
      budget:  form.budget,
      notes:   form.notes,
      status:  form.status,
      vendors: form.vendors.split(",").map(v => v.trim()).filter(Boolean),
      gradient: event?.gradient || GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    });
    onClose();
  };

  const inputCls = "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-bold text-surface-900">{isEdit ? "Edit Event" : "Plan New Event"}</h2>
            <p className="text-xs text-surface-400 mt-0.5">{isEdit ? "Update event details" : "Fill in the details to get started"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center cursor-pointer border-none bg-transparent">
            <X size={15} className="text-surface-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Name *</label>
            <input name="name" value={form.name} onChange={set} placeholder="e.g. Sarah's Wedding" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Type</label>
              <select name="type" value={form.type} onChange={set} className={inputCls}>
                <option value="">Select type…</option>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={set} className={inputCls}>
                <option value="planning">Planning</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Event Date</label>
              <input type="date" name="date" value={form.date} onChange={set} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">Budget</label>
              <input name="budget" value={form.budget} onChange={set} placeholder="e.g. 500,000 AMD" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Vendors (comma-separated)</label>
            <input name="vendors" value={form.vendors} onChange={set} placeholder="Sweet Dreams Bakery, Sound Wave DJ…" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Notes</label>
            <textarea name="notes" value={form.notes} onChange={set} rows={3}
              placeholder="Any special requirements or notes…"
              className={`${inputCls} resize-none`} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-100">
          <button onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!form.name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
            <Plus size={14} /> {isEdit ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

const STORAGE_KEY = "salooote_user_events";

export default function AccountEventsPage() {
  const [events,    setEvents]    = useState([]);
  const [modal,     setModal]     = useState(null); // null | "new" | event object
  const [deleteId,  setDeleteId]  = useState(null);

  // Persist events in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEvents(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (list) => {
    setEvents(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  };

  const handleSave = (event) => {
    persist(events.some(e => e.id === event.id)
      ? events.map(e => e.id === event.id ? event : e)
      : [event, ...events]
    );
  };

  const handleDelete = (id) => { persist(events.filter(e => e.id !== id)); setDeleteId(null); };

  const upcoming  = events.filter(e => e.status !== "completed" && e.status !== "cancelled");
  const past      = events.filter(e => e.status === "completed" || e.status === "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">My Events</h1>
          <p className="text-sm text-surface-400 mt-0.5">{events.length} event{events.length !== 1 ? "s" : ""} planned</p>
        </div>
        <button onClick={() => setModal("new")}
          className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
          <Plus size={15} /> Plan New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <PartyPopper size={28} className="text-brand-400" />
          </div>
          <p className="font-semibold text-surface-700 text-base">No events yet</p>
          <p className="text-sm text-surface-400 mt-1 mb-5">Start planning your first event — weddings, birthdays, corporate parties and more.</p>
          <button onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-brand-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-brand-700 transition-colors">
            <Plus size={14} /> Plan First Event
          </button>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-surface-700 mb-3 uppercase tracking-wide">Upcoming · {upcoming.length}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcoming.map(event => (
                  <EventCard key={event.id} event={event}
                    onEdit={() => setModal(event)}
                    onDelete={() => setDeleteId(event.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-surface-700 mb-3 uppercase tracking-wide">Past · {past.length}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-75">
                {past.map(event => (
                  <EventCard key={event.id} event={event}
                    onEdit={() => setModal(event)}
                    onDelete={() => setDeleteId(event.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {(modal === "new" || (modal && modal !== "new")) && (
        <EventModal
          event={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <p className="font-bold text-surface-900 mb-1">Delete Event?</p>
            <p className="text-sm text-surface-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-surface-600 border border-surface-200 rounded-xl hover:bg-surface-50 cursor-pointer bg-white transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 cursor-pointer border-none transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:border-surface-300 transition-colors">
      {/* Gradient banner */}
      <div className={`h-24 bg-gradient-to-br ${event.gradient || "from-brand-400 to-brand-600"} flex items-end px-5 pb-4`}>
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-white text-base font-bold leading-tight">{event.name}</p>
            {event.type && <p className="text-white/70 text-xs mt-0.5">{event.type}</p>}
          </div>
          <Badge status={event.status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-50 rounded-xl p-3">
            <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wide mb-1">Date</p>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-brand-500" />
              <p className="text-sm font-semibold text-surface-800">{event.date || "—"}</p>
            </div>
          </div>
          <div className="bg-surface-50 rounded-xl p-3">
            <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wide mb-1">Budget</p>
            <p className="text-sm font-bold text-brand-600">{event.budget || "—"}</p>
          </div>
        </div>

        {event.vendors?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={12} className="text-surface-400" />
              <p className="text-xs text-surface-500 font-medium">{event.vendors.length} vendor{event.vendors.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {event.vendors.map((v, i) => (
                <span key={i} className="text-xs bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded-full font-medium border border-brand-100">{v}</span>
              ))}
            </div>
          </div>
        )}

        {event.notes && (
          <p className="text-xs text-surface-500 mb-4 line-clamp-2">{event.notes}</p>
        )}

        <div className="flex items-center gap-2">
          <button onClick={onEdit}
            className="flex-1 py-2.5 text-xs font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 cursor-pointer border-none transition-colors">
            Edit Details
          </button>
          <button onClick={onDelete}
            className="w-9 h-9 flex items-center justify-center text-surface-400 bg-surface-100 rounded-xl hover:bg-red-50 hover:text-red-500 cursor-pointer border-none transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
