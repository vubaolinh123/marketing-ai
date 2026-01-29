'use client';

import { useState } from 'react';
import { FacebookSettings } from '@/lib/api';

interface FacebookSettingsSectionProps {
    data: FacebookSettings;
    onChange: (data: FacebookSettings) => void;
}

export default function FacebookSettingsSection({ data, onChange }: FacebookSettingsSectionProps) {
    const [showToken, setShowToken] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-2">
                <div className="text-blue-500 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Facebook Page Access Token</p>
                    <p>Token này được sử dụng để đăng bài hoặc quản lý các trang Fanpage của bạn thông qua AI. Hãy đảm bảo token này được bảo mật.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Facebook Access Token
                    </label>
                    <div className="relative">
                        <input
                            type={showToken ? "text" : "password"}
                            value={data.facebookToken || ''}
                            onChange={(e) => onChange({ ...data, facebookToken: e.target.value })}
                            placeholder="Nhập Facebook Page Access Token..."
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showToken ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.244 4.244M9.88 9.88L4.22 4.22m15.56 15.56l-5.66-5.66m4.243-4.243a9.987 9.987 0 001.562-3.029C19.732 7.943 15.941 5 11.5 5c-1.123 0-2.204.188-3.21.53m0 0L4.22 4.22" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                        Lưu ý: Bạn có thể lấy token này từ Facebook Developer Console.
                    </p>
                </div>
            </div>
        </div>
    );
}
