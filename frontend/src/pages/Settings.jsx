import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, CreditCard } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);

    const SettingSection = ({ icon: Icon, title, description, children, divider = true }) => (
        <div className={`p-8 ${divider ? 'border-b border-slate-50' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{description}</p>
                    </div>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );

    const Toggle = ({ enabled, setEnabled }) => (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`w-14 h-8 rounded-full transition-all relative ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
        >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${enabled ? 'left-7 shadow-lg shadow-emerald-100' : 'left-1'}`} />
        </button>
    );

    return (
        <div className="min-h-screen bg-[#E6EEF2] py-12 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <SettingsIcon size={32} className="text-slate-800" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
                        <p className="text-slate-500 font-medium">Manage your account preferences and security</p>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border border-white overflow-hidden">
                    <SettingSection
                        icon={Bell}
                        title="Notifications"
                        description="Receive alerts about job matches and messages"
                    >
                        <Toggle enabled={notifications} setEnabled={setNotifications} />
                    </SettingSection>

                    <SettingSection
                        icon={CreditCard}
                        title="Payment Details"
                        description="Manage your credit card and billing information"
                        divider={false}
                    >
                        <button
                            onClick={() => navigate('/poster/payments')}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg text-sm"
                        >
                            Manage Billing
                        </button>
                    </SettingSection>

                    <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-between items-center">
                        <button className="text-red-500 font-black text-sm uppercase tracking-widest hover:underline">
                            Delete Account
                        </button>
                        <button className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
