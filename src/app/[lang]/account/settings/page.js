"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { userAPI, clearAuth } from "@/lib/api";
import { Eye, EyeOff, Save, AlertTriangle, User, Lock, Check, AlertCircle, LogOut } from "lucide-react";

function Toast({ msg, type }) {
  if (!msg) return null;
  const cls = type === "success"
    ? "bg-green-50 border-green-200 text-green-700"
    : "bg-red-50 border-red-200 text-red-600";
  const Icon = type === "success" ? Check : AlertCircle;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm ${cls}`}>
      <Icon size={14} className="flex-shrink-0" /> {msg}
    </div>
  );
}

const TABS = [
  { key: "profile",  label: "Profile",  icon: User },
  { key: "password", label: "Password", icon: Lock },
];

export default function AccountSettingsPage() {
  const { lang } = useParams();
  const router   = useRouter();
  const [activeTab, setTab] = useState("profile");

  // Profile
  const [profile, setProfile]           = useState({ first_name: "", last_name: "", phone: "", email: "" });
  const [profileLoading, setPLoading]   = useState(true);
  const [profileSaving,  setPSaving]    = useState(false);
  const [profileMsg, setPMsg]           = useState({ msg: "", type: "" });

  // Password
  const [pw, setPw]                     = useState({ current_password: "", new_password: "", confirm_new_password: "" });
  const [shows, setShows]               = useState({ current: false, newp: false, confirm: false });
  const [pwSaving,  setPwSaving]        = useState(false);
  const [pwMsg, setPwMsg]               = useState({ msg: "", type: "" });

  useEffect(() => {
    userAPI.getProfile()
      .then(res => {
        const d = res?.data || res;
        setProfile({ first_name: d?.first_name || "", last_name: d?.last_name || "", phone: d?.phone || "", email: d?.email || "" });
      })
      .catch(() => {})
      .finally(() => setPLoading(false));
  }, []);

  const handleProfileChange = (e) => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePwChange      = (e) => setPw(p => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setPSaving(true); setPMsg({ msg: "", type: "" });
    try {
      await userAPI.updateProfile({ first_name: profile.first_name, last_name: profile.last_name, phone: profile.phone });
      setPMsg({ msg: "Profile saved successfully.", type: "success" });
    } catch (err) { setPMsg({ msg: err.message || "Failed to save profile.", type: "error" }); }
    finally { setPSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ msg: "", type: "" });
    if (pw.new_password !== pw.confirm_new_password) { setPwMsg({ msg: "Passwords do not match.", type: "error" }); return; }
    if (pw.new_password.length < 8) { setPwMsg({ msg: "New password must be at least 8 characters.", type: "error" }); return; }
    setPwSaving(true);
    try {
      await userAPI.changePassword({ current_password: pw.current_password, new_password: pw.new_password });
      setPwMsg({ msg: "Password changed successfully.", type: "success" });
      setPw({ current_password: "", new_password: "", confirm_new_password: "" });
    } catch (err) { setPwMsg({ msg: err.message || "Failed to change password.", type: "error" }); }
    finally { setPwSaving(false); }
  };

  const handleLogout = () => { clearAuth(); router.push(`/${lang}/login`); };

  const inputCls = "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl bg-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-surface-900">Settings</h1>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-xl px-2 py-1.5 w-fit shadow-sm">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-none ${
              activeTab === tab.key ? "bg-brand-600 text-white" : "text-surface-500 hover:bg-surface-100 bg-transparent"
            }`}
          >
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-surface-900 mb-5">Profile Information</h2>
          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">First Name</label>
                  <input name="first_name" value={profile.first_name} onChange={handleProfileChange} placeholder="First name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Last Name</label>
                  <input name="last_name" value={profile.last_name} onChange={handleProfileChange} placeholder="Last name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+374 xx xxx xxx" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">Email</label>
                  <input type="email" name="email" value={profile.email} disabled
                    className="w-full px-4 py-2.5 text-sm border border-surface-100 rounded-xl bg-surface-50 text-surface-400 cursor-not-allowed" />
                  <p className="text-[11px] text-surface-400 mt-1">Email cannot be changed.</p>
                </div>
              </div>
              <Toast msg={profileMsg.msg} type={profileMsg.type} />
              <div className="flex justify-end pt-1">
                <button type="submit" disabled={profileSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
                  <Save size={14} /> {profileSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Password tab */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-surface-900 mb-5">Change Password</h2>
          <form onSubmit={savePassword} className="space-y-4">
            {[
              { name: "current_password",     showKey: "current", label: "Current Password" },
              { name: "new_password",         showKey: "newp",    label: "New Password",     hint: "Min. 8 characters" },
              { name: "confirm_new_password", showKey: "confirm", label: "Confirm New Password" },
            ].map(({ name, showKey, label, hint }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-surface-700 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    name={name}
                    type={shows[showKey] ? "text" : "password"}
                    value={pw[name]}
                    onChange={handlePwChange}
                    placeholder={hint || "••••••••"}
                    className={`${inputCls} pr-11`}
                  />
                  <button type="button" onClick={() => setShows(p => ({ ...p, [showKey]: !p[showKey] }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 border-none bg-transparent cursor-pointer p-0">
                    {shows[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
            <Toast msg={pwMsg.msg} type={pwMsg.type} />
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={pwSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
                <Save size={14} /> {pwSaving ? "Saving…" : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sign out */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-surface-900 mb-1">Sign Out</h2>
        <p className="text-xs text-surface-400 mb-4">You will be signed out of your account on this device.</p>
        <button onClick={handleLogout}
          className="flex items-center gap-2 border border-red-200 text-red-500 bg-transparent rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-red-50 transition-colors">
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-surface-900">Danger Zone</h2>
            <p className="text-xs text-surface-400 mt-0.5">These actions are permanent and cannot be undone.</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
          <div>
            <p className="text-sm font-semibold text-surface-800">Delete Account</p>
            <p className="text-xs text-surface-400 mt-0.5">Permanently remove your account and all your data</p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-100 cursor-pointer bg-white transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
