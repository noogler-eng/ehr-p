import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarClock, Plus, CheckCircle, Clock, AlertTriangle, X } from "lucide-react";
import { showToast } from "../components/Toast";
import { AddressSelector } from "../components/AddressSelector";

const API_BASE = "http://localhost:8080/api";

interface FollowUpsProps {
  account: string;
  userRole: string;
}

interface FollowUpItem {
  _id: string;
  patientAddress: string;
  doctorAddress: string;
  doctorName: string;
  otherName: string;
  followUpDate: string;
  reason: string;
  notes: string;
  priority: string;
  status: string;
  createdAt: string;
}

export const FollowUps = ({ account, userRole }: FollowUpsProps) => {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientAddress: "",
    followUpDate: "",
    reason: "",
    notes: "",
    priority: "routine"
  });

  useEffect(() => {
    fetchFollowUps();
  }, [account]);

  const fetchFollowUps = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/followup/list/${account}`);
      setFollowUps(data.followUps);
    } catch (err) {
      console.error("Failed to fetch follow-ups:", err);
    } finally {
      setLoading(false);
    }
  };

  const createFollowUp = async () => {
    if (!form.patientAddress || !form.followUpDate || !form.reason) {
      showToast({ type: "error", title: "Missing Fields", message: "Patient address, date, and reason are required" });
      return;
    }
    try {
      await axios.post(`${API_BASE}/followup/create`, {
        ...form,
        doctorAddress: account
      });
      showToast({ type: "success", title: "Follow-up Created", message: `Scheduled for ${new Date(form.followUpDate).toLocaleDateString()}` });
      setShowForm(false);
      setForm({ patientAddress: "", followUpDate: "", reason: "", notes: "", priority: "routine" });
      fetchFollowUps();
    } catch (err) {
      showToast({ type: "error", title: "Failed", message: "Could not create follow-up" });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_BASE}/followup/update/${id}`, { status });
      showToast({ type: "success", title: "Updated", message: `Follow-up marked as ${status}` });
      fetchFollowUps();
    } catch (err) {
      showToast({ type: "error", title: "Failed", message: "Could not update status" });
    }
  };

  const now = new Date();
  const upcoming = followUps.filter(f => f.status === 'pending' && new Date(f.followUpDate) >= now);
  const overdue = followUps.filter(f => f.status === 'pending' && new Date(f.followUpDate) < now);
  const completed = followUps.filter(f => f.status !== 'pending');

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "urgent": return "bg-white/10 border-white/30 text-white";
      case "important": return "bg-zinc-700/50 border-zinc-600 text-zinc-300";
      default: return "bg-zinc-900 border-zinc-700 text-zinc-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Follow-Up <span className="text-zinc-500">Schedule</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Doctor Notes & Appointment Reminders
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userRole === "Doctor" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={14} /> New Follow-Up
            </button>
          )}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
            <CalendarClock size={24} className="text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white uppercase">Schedule Follow-Up</h3>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AddressSelector
                type="patient"
                currentUserAddress={account}
                currentUserRole={userRole}
                value={form.patientAddress}
                onChange={(addr) => setForm({ ...form, patientAddress: addr })}
                label="Select Patient"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Follow-Up Date</label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-zinc-600 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Reason</label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="e.g., Check cholesterol levels"
                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-zinc-600 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-zinc-600 text-sm appearance-none"
              >
                <option value="routine">Routine</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Notes (Optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes for the follow-up..."
                rows={2}
                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-zinc-600 text-sm resize-none"
              />
            </div>
          </div>
          <button
            onClick={createFollowUp}
            className="mt-4 w-full py-3 bg-white text-black rounded-xl font-black uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Schedule Follow-Up
          </button>
        </div>
      )}

      {/* Overdue Alerts */}
      {overdue.length > 0 && (
        <div className="bg-white/5 border-2 border-white/20 rounded-[2rem] p-6 animate-emergency">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-white" />
            <h3 className="text-sm font-black text-white uppercase">Overdue Follow-Ups ({overdue.length})</h3>
          </div>
          <div className="space-y-2">
            {overdue.map((fu) => (
              <FollowUpCard key={fu._id} fu={fu} onUpdate={updateStatus} userRole={userRole} isOverdue />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Upcoming ({upcoming.length})
        </h3>
        {upcoming.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarClock size={32} className="text-zinc-800 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs font-bold">No upcoming follow-ups</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((fu) => (
              <FollowUpCard key={fu._id} fu={fu} onUpdate={updateStatus} userRole={userRole} />
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Completed / Past ({completed.length})
          </h3>
          <div className="space-y-2">
            {completed.map((fu) => (
              <FollowUpCard key={fu._id} fu={fu} onUpdate={updateStatus} userRole={userRole} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FollowUpCard = ({ fu, onUpdate, userRole, isOverdue }: { fu: FollowUpItem; onUpdate: (id: string, status: string) => void; userRole: string; isOverdue?: boolean }) => {
  const daysUntil = Math.ceil((new Date(fu.followUpDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
      isOverdue
        ? "bg-white/5 border-white/20"
        : fu.status === 'completed'
        ? "bg-zinc-900/50 border-zinc-800 opacity-60"
        : "bg-black/30 border-zinc-800 hover:border-zinc-600"
    }`}>
      <div className={`p-2 rounded-lg shrink-0 ${
        fu.priority === 'urgent' ? "bg-white/10" : fu.priority === 'important' ? "bg-zinc-700" : "bg-zinc-800"
      }`}>
        {fu.status === 'completed' ? (
          <CheckCircle size={16} className="text-zinc-500" />
        ) : isOverdue ? (
          <AlertTriangle size={16} className="text-white" />
        ) : (
          <Clock size={16} className="text-zinc-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-white">{fu.reason}</p>
          <span className={`px-2 py-0.5 rounded-lg border text-[7px] font-black uppercase tracking-wider ${
            fu.priority === 'urgent' ? "bg-white/10 border-white/20 text-white"
              : fu.priority === 'important' ? "bg-zinc-700 border-zinc-600 text-zinc-300"
              : "bg-zinc-800 border-zinc-700 text-zinc-500"
          }`}>
            {fu.priority}
          </span>
        </div>
        <p className="text-[9px] text-zinc-500 mt-0.5">
          {userRole === 'Doctor' ? `Patient: ${fu.otherName}` : `Dr. ${fu.doctorName || fu.otherName}`}
          {fu.notes ? ` — ${fu.notes}` : ""}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-xs font-bold ${isOverdue ? "text-white" : "text-zinc-400"}`}>
          {new Date(fu.followUpDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className={`text-[9px] font-bold ${isOverdue ? "text-white/60" : "text-zinc-600"}`}>
          {fu.status === 'completed' ? 'Completed' : isOverdue ? `${Math.abs(daysUntil)} days overdue` : `in ${daysUntil} days`}
        </p>
      </div>

      {fu.status === 'pending' && (
        <button
          onClick={() => onUpdate(fu._id, 'completed')}
          className="shrink-0 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
        >
          Done
        </button>
      )}
    </div>
  );
};
