"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { userAPI } from "@/lib/api";
import { Eye, EyeOff, Save, User, Lock, Check, AlertCircle } from "lucide-react";

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

const T = {
  en: {
    title: "Settings",
    profile: "Profile",
    password: "Password",
    profileInfo: "Profile Information",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    email: "Email",
    emailNote: "Email cannot be changed.",
    saveChanges: "Save Changes",
    saving: "Saving…",
    profileSaved: "Profile saved successfully.",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    newPasswordHint: "Min. 8 characters",
    confirmPassword: "Confirm New Password",
    changePasswordBtn: "Change Password",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "New password must be at least 8 characters.",
    passwordChanged: "Password changed successfully.",
  },



hy: {
  title: "Կարգավորումներ",
  profile: "Պրոֆիլ",
  password: "Գաղտնաբառ",
  profileInfo: "Պրոֆիլի տվյալներ",
  firstName: "Անուն",
  lastName: "Ազգանուն",
  phone: "Հեռախոս",
  email: "Էլ․ փոստ",
  emailNote: "Էլ․ փոստի հասցեն հնարավոր չէ փոփոխել։",
  saveChanges: "Պահպանել փոփոխությունները",
  saving: "Պահպանվում է…",
  profileSaved: "Պրոֆիլը հաջողությամբ պահպանվեց։",
  changePassword: "Փոխել գաղտնաբառը",
  currentPassword: "Ընթացիկ գաղտնաբառ",
  newPassword: "Նոր գաղտնաբառ",
  newPasswordHint: "Առնվազն 8 նիշ",
  confirmPassword: "Հաստատել գաղտնաբառը",
  changePasswordBtn: "Փոխել գաղտնաբառը",
  passwordMismatch: "Գաղտնաբառերը չեն համընկնում։",
  passwordTooShort: "Նոր գաղտնաբառը պետք է լինի առնվազն 8 նիշ։",
  passwordChanged: "Գաղտնաբառը հաջողությամբ փոխվեց։",
},


  ru: {
    title: "Настройки",
    profile: "Профиль",
    password: "Пароль",
    profileInfo: "Данные профиля",
    firstName: "Имя",
    lastName: "Фамилия",
    phone: "Телефон",
    email: "Email",
    emailNote: "Email нельзя изменить.",
    saveChanges: "Сохранить",
    saving: "Сохранение…",
    profileSaved: "Профиль сохранён.",
    changePassword: "Изменить пароль",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    newPasswordHint: "Мин. 8 символов",
    confirmPassword: "Подтвердите пароль",
    changePasswordBtn: "Сменить пароль",
    passwordMismatch: "Пароли не совпадают.",
    passwordTooShort: "Минимум 8 символов.",
    passwordChanged: "Пароль изменён.",
  },

};

export default function AccountSettingsPage() {
  const { lang } = useParams();
  const t = T[lang] || T.en;
  const [activeTab, setTab] = useState("profile");

  const TABS = [
    { key: "profile",  label: t.profile,  icon: User },
    { key: "password", label: t.password, icon: Lock },
  ];

  // Profile
  const [profile, setProfile]         = useState({ first_name: "", last_name: "", phone: "", email: "" });
  const [profileLoading, setPLoading] = useState(true);
  const [profileSaving,  setPSaving]  = useState(false);
  const [profileMsg, setPMsg]         = useState({ msg: "", type: "" });

  // Password
  const [pw, setPw]                   = useState({ current_password: "", new_password: "", confirm_new_password: "" });
  const [shows, setShows]             = useState({ current: false, newp: false, confirm: false });
  const [pwSaving,  setPwSaving]      = useState(false);
  const [pwMsg, setPwMsg]             = useState({ msg: "", type: "" });

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
      setPMsg({ msg: t.profileSaved, type: "success" });
    } catch (err) { setPMsg({ msg: err.message || "Failed to save profile.", type: "error" }); }
    finally { setPSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ msg: "", type: "" });
    if (pw.new_password !== pw.confirm_new_password) { setPwMsg({ msg: t.passwordMismatch, type: "error" }); return; }
    if (pw.new_password.length < 8) { setPwMsg({ msg: t.passwordTooShort, type: "error" }); return; }
    setPwSaving(true);
    try {
      await userAPI.changePassword({ current_password: pw.current_password, new_password: pw.new_password });
      setPwMsg({ msg: t.passwordChanged, type: "success" });
      setPw({ current_password: "", new_password: "", confirm_new_password: "" });
    } catch (err) { setPwMsg({ msg: err.message || "Failed to change password.", type: "error" }); }
    finally { setPwSaving(false); }
  };

  const inputCls = "w-full px-4 py-2.5 text-sm border border-surface-200 rounded-xl bg-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-surface-300";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-surface-900">{t.title}</h1>

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
          <h2 className="text-sm font-bold text-surface-900 mb-5">{t.profileInfo}</h2>
          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.firstName}</label>
                  <input name="first_name" value={profile.first_name} onChange={handleProfileChange} placeholder={t.firstName} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.lastName}</label>
                  <input name="last_name" value={profile.last_name} onChange={handleProfileChange} placeholder={t.lastName} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.phone}</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+374 xx xxx xxx" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-700 mb-1.5">{t.email}</label>
                  <input type="email" name="email" value={profile.email} disabled
                    className="w-full px-4 py-2.5 text-sm border border-surface-100 rounded-xl bg-surface-50 text-surface-400 cursor-not-allowed" />
                  <p className="text-[11px] text-surface-400 mt-1">{t.emailNote}</p>
                </div>
              </div>
              <Toast msg={profileMsg.msg} type={profileMsg.type} />
              <div className="flex justify-end pt-1">
                <button type="submit" disabled={profileSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 cursor-pointer border-none disabled:opacity-60 transition-colors">
                  <Save size={14} /> {profileSaving ? t.saving : t.saveChanges}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Password tab */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-surface-900 mb-5">{t.changePassword}</h2>
          <form onSubmit={savePassword} className="space-y-4">
            {[
              { name: "current_password",     showKey: "current", label: t.currentPassword },
              { name: "new_password",         showKey: "newp",    label: t.newPassword,    hint: t.newPasswordHint },
              { name: "confirm_new_password", showKey: "confirm", label: t.confirmPassword },
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
                <Save size={14} /> {pwSaving ? t.saving : t.changePasswordBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
