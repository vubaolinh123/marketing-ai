'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { FacebookSettings, settingsApi } from '@/lib/api';
import toast from '@/lib/toast';

interface FacebookSettingsSectionProps {
    data: FacebookSettings;
    onChange: (data: FacebookSettings) => void;
}

interface VerifyPreview {
    facebookToken: string;
    isValid: boolean;
    facebookPageId?: string;
    facebookPageName?: string;
    facebookTokenExpiresAt?: string;
}

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!error || typeof error !== 'object') return fallback;

    const candidate = error as {
        message?: string;
        response?: { data?: { message?: string } };
    };

    return candidate.response?.data?.message || candidate.message || fallback;
};

const formatExpiry = (value?: string) => {
    if (!value) return 'Không có thông tin';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export default function FacebookSettingsSection({ data, onChange }: FacebookSettingsSectionProps) {
    const [showToken, setShowToken] = useState(false);
    const [draftToken, setDraftToken] = useState(data.facebookToken || '');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyPreview, setVerifyPreview] = useState<VerifyPreview | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        setDraftToken(data.facebookToken || '');
    }, [data.facebookToken]);

    const isDraftChanged = useMemo(
        () => draftToken.trim() !== (data.facebookToken || '').trim(),
        [draftToken, data.facebookToken]
    );

    const handleVerifyToken = async () => {
        const token = draftToken.trim();

        if (!token) {
            toast.error('Vui lòng nhập Facebook token trước khi kiểm tra');
            return;
        }

        setIsVerifying(true);
        try {
            const response = await settingsApi.verifyFacebookToken(token);

            if (!response.success) {
                throw new Error(response.message || 'Không thể kiểm tra token Facebook');
            }

            const result = response.data || {};
            const isValid = typeof result.isValid === 'boolean'
                ? result.isValid
                : typeof result.valid === 'boolean'
                    ? result.valid
                    : true;

            setVerifyPreview({
                facebookToken: token,
                isValid,
                facebookPageId: result.pageId || '',
                facebookPageName: result.pageName || '',
                facebookTokenExpiresAt: result.tokenExpiresAt || result.expiresAt || '',
            });
            setIsConfirmOpen(true);
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Kiểm tra token thất bại'));
        } finally {
            setIsVerifying(false);
        }
    };

    const handleConfirmApply = () => {
        if (!verifyPreview) return;

        onChange({
            ...data,
            facebookToken: verifyPreview.facebookToken,
            facebookPageId: verifyPreview.facebookPageId || '',
            facebookPageName: verifyPreview.facebookPageName || '',
            facebookTokenExpiresAt: verifyPreview.facebookTokenExpiresAt || '',
        });

        setDraftToken(verifyPreview.facebookToken);
        setIsConfirmOpen(false);
        setVerifyPreview(null);
        toast.success('Đã áp dụng token Facebook đã kiểm tra');
    };

    const handleCancelConfirm = () => {
        setDraftToken(data.facebookToken || '');
        setIsConfirmOpen(false);
        setVerifyPreview(null);
    };

    return (
        <>
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
                        <div className="flex items-stretch gap-2">
                            <div className="relative flex-1">
                                <input
                                    type={showToken ? 'text' : 'password'}
                                    value={draftToken}
                                    onChange={(e) => setDraftToken(e.target.value)}
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

                            <Button
                                type="button"
                                variant="secondary"
                                className="rounded-xl px-4 whitespace-nowrap"
                                onClick={handleVerifyToken}
                                isLoading={isVerifying}
                            >
                                Kiểm tra token
                            </Button>
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Lưu ý: Bạn có thể lấy token này từ Facebook Developer Console.
                        </p>

                        {isDraftChanged && (
                            <p className="mt-2 text-xs text-amber-600">
                                Token mới chỉ được áp dụng sau khi kiểm tra và xác nhận.
                            </p>
                        )}

                        {(data.facebookPageName || data.facebookPageId || data.facebookTokenExpiresAt) && (
                            <div className="mt-3 p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-1 text-sm text-gray-700">
                                {data.facebookPageName && <p><span className="font-medium">Fanpage:</span> {data.facebookPageName}</p>}
                                {data.facebookPageId && <p><span className="font-medium">Page ID:</span> {data.facebookPageId}</p>}
                                {data.facebookTokenExpiresAt && <p><span className="font-medium">Hết hạn:</span> {formatExpiry(data.facebookTokenExpiresAt)}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isConfirmOpen && verifyPreview && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto"
                            onClick={handleCancelConfirm}
                        >
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.92, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl max-w-lg w-full mx-auto p-6 shadow-2xl border border-gray-100"
                            >
                                <div className="flex items-start gap-3 mb-5">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${verifyPreview.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {verifyPreview.isValid ? (
                                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Xác nhận token Facebook</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Vui lòng kiểm tra thông tin trước khi áp dụng vào Cài đặt.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm text-gray-700">
                                    <p>
                                        <span className="font-medium">Trạng thái:</span>{' '}
                                        <span className={verifyPreview.isValid ? 'text-green-700' : 'text-red-600'}>
                                            {verifyPreview.isValid ? 'Hợp lệ' : 'Không hợp lệ'}
                                        </span>
                                    </p>
                                    <p><span className="font-medium">Tên trang:</span> {verifyPreview.facebookPageName || 'Không có thông tin'}</p>
                                    <p><span className="font-medium">Page ID:</span> {verifyPreview.facebookPageId || 'Không có thông tin'}</p>
                                    <p><span className="font-medium">Hết hạn:</span> {formatExpiry(verifyPreview.facebookTokenExpiresAt)}</p>
                                </div>

                                {!verifyPreview.isValid && (
                                    <p className="mt-3 text-sm text-red-600">
                                        Token không hợp lệ. Vui lòng kiểm tra lại trước khi áp dụng.
                                    </p>
                                )}

                                <div className="mt-6 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={handleCancelConfirm}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="flex-1"
                                        onClick={handleConfirmApply}
                                        disabled={!verifyPreview.isValid}
                                    >
                                        Xác nhận áp dụng
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
