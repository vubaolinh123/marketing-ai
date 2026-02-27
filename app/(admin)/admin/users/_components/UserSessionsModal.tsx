'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui';
import { adminUserApi, type AdminUserSession, type AdminUserSessionsData } from '@/lib/api';
import { showError, showSuccess } from '@/lib/toast';

interface SessionsTargetUser {
    id: string;
    name: string;
    email: string;
}

interface UserSessionsModalProps {
    isOpen: boolean;
    targetUser: SessionsTargetUser | null;
    onClose: () => void;
}

const UNKNOWN_TEXT = 'Không rõ';

function getSessionId(session: AdminUserSession): string {
    return String(session.sessionId || session.id || session._id || '');
}

function isCurrentSession(session: AdminUserSession): boolean {
    return !!(session.current ?? session.isCurrent);
}

function isRevokedSession(session: AdminUserSession): boolean {
    return !!(session.isRevoked || session.revokedAt);
}

function getDeviceLabel(session: AdminUserSession): string {
    return session.deviceName || session.device || 'Thiết bị chưa xác định';
}

function getIpLabel(session: AdminUserSession): string {
    return session.ipAddress || session.ip || 'Không rõ IP';
}

function getLocationLabel(session: AdminUserSession): string {
    const location = session.location;

    if (!location) return UNKNOWN_TEXT;
    if (typeof location === 'string') return location || UNKNOWN_TEXT;

    const parts = [location.city, location.region, location.country]
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean);

    if (parts.length > 0) {
        return parts.join(', ');
    }

    if (location.source) {
        return String(location.source);
    }

    return UNKNOWN_TEXT;
}

function getLoginCityLabel(session: AdminUserSession): string {
    const location = session.location;
    if (!location) return UNKNOWN_TEXT;

    if (typeof location === 'string') {
        return location.trim() || UNKNOWN_TEXT;
    }

    const city = typeof location.city === 'string' ? location.city.trim() : '';
    const region = typeof location.region === 'string' ? location.region.trim() : '';
    const country = typeof location.country === 'string' ? location.country.trim() : '';
    const source = typeof location.source === 'string' ? location.source.trim() : '';

    if (source === 'browser-geo' && Number.isFinite(session.browserGeo?.latitude) && Number.isFinite(session.browserGeo?.longitude)) {
        return `Tọa độ (${session.browserGeo?.latitude?.toFixed(3)}, ${session.browserGeo?.longitude?.toFixed(3)})`;
    }

    if (city) return city;
    if (region) return region;
    if (country) return country;

    if (source === 'private-ip') {
        return 'Mạng nội bộ (Local)';
    }

    return UNKNOWN_TEXT;
}

function getLastUsed(session: AdminUserSession): string | undefined {
    return session.lastUsedAt || session.lastActiveAt || session.createdAt;
}

function sortByLastUsedDesc(items: AdminUserSession[]): AdminUserSession[] {
    return [...items].sort((a, b) => {
        const aTime = new Date(getLastUsed(a) || 0).getTime();
        const bTime = new Date(getLastUsed(b) || 0).getTime();
        return bTime - aTime;
    });
}

function formatDateTime(value?: string) {
    if (!value) return 'Chưa có dữ liệu';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function getGeoPermissionLabel(session: AdminUserSession): string {
    const state = session.geoPermissionState;

    if (state === 'granted') return 'Đã cấp';
    if (state === 'denied') return 'Đã từ chối';
    if (state === 'prompt') return 'Đang chờ xác nhận';
    if (state === 'error') return 'Lỗi khi lấy vị trí';
    if (state === 'unavailable') return 'Không khả dụng';
    if (state === 'unsupported') return 'Trình duyệt không hỗ trợ';

    return 'Chưa rõ';
}

function getBrowserGeoLabel(session: AdminUserSession): string {
    const geo = session.browserGeo;
    if (!geo) return 'Không có dữ liệu';

    const latitude = Number.isFinite(geo.latitude) ? geo.latitude.toFixed(5) : UNKNOWN_TEXT;
    const longitude = Number.isFinite(geo.longitude) ? geo.longitude.toFixed(5) : UNKNOWN_TEXT;
    const accuracy = Number.isFinite(geo.accuracy) ? `±${Math.round(geo.accuracy)}m` : UNKNOWN_TEXT;

    return `${latitude}, ${longitude} (${accuracy})`;
}

function getDeviceMetaLabel(session: AdminUserSession): string {
    const meta = session.deviceMeta;
    if (!meta) return 'Không có dữ liệu';

    const platform = meta.platform || UNKNOWN_TEXT;
    const language = meta.language || UNKNOWN_TEXT;
    const timezone = meta.timezone || UNKNOWN_TEXT;
    const screenWidth = typeof meta.screen?.width === 'number' ? meta.screen.width : UNKNOWN_TEXT;
    const screenHeight = typeof meta.screen?.height === 'number' ? meta.screen.height : UNKNOWN_TEXT;

    return `${platform} · ${language} · ${timezone} · ${screenWidth}x${screenHeight}`;
}

function getUserAgentLabel(session: AdminUserSession): string {
    return session.userAgent?.trim() || 'Không có User-Agent';
}

function getBrowserLabel(session: AdminUserSession): string {
    const ua = (session.userAgent || '').toLowerCase();

    if (ua.includes('edg/')) return 'Edge';
    if (ua.includes('firefox/')) return 'Firefox';
    if (ua.includes('safari/') && !ua.includes('chrome/') && !ua.includes('crios/')) return 'Safari';
    if (ua.includes('chrome/') || ua.includes('crios/')) return 'Chrome';

    return 'Unknown';
}

function getOsLabel(session: AdminUserSession): string {
    const ua = (session.userAgent || '').toLowerCase();
    const platform = (session.deviceMeta?.platform || '').toLowerCase();

    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
    if (ua.includes('windows') || platform.includes('win')) return 'Windows';
    if (ua.includes('mac os') || ua.includes('macintosh') || platform.includes('mac')) return 'macOS';
    if (ua.includes('linux') || platform.includes('linux') || platform.includes('x11')) return 'Linux';

    return UNKNOWN_TEXT;
}

function getDeviceTypeLabel(session: AdminUserSession): string {
    const ua = (session.userAgent || '').toLowerCase();
    const platform = (session.deviceMeta?.platform || '').toLowerCase();
    const width = typeof session.deviceMeta?.screen === 'object' ? session.deviceMeta.screen?.width : undefined;

    if (ua.includes('ipad') || ua.includes('tablet')) return 'Tablet';
    if (ua.includes('iphone') || ua.includes('mobile')) return 'Mobile';
    if (ua.includes('android') && !ua.includes('mobile')) return 'Tablet';

    const isDesktopPlatform =
        platform.includes('win') ||
        platform.includes('mac') ||
        platform.includes('linux') ||
        platform.includes('x11');

    if (isDesktopPlatform) {
        if (typeof width === 'number' && width > 0 && width <= 1600) {
            return 'Laptop';
        }
        return 'PC';
    }

    return UNKNOWN_TEXT;
}

export default function UserSessionsModal({ isOpen, targetUser, onClose }: UserSessionsModalProps) {
    const [sessions, setSessions] = useState<AdminUserSession[]>([]);
    const [loginHistory, setLoginHistory] = useState<AdminUserSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

    const applySessionPayload = useCallback((payload?: AdminUserSessionsData | null) => {
        const activeSessions = Array.isArray(payload?.activeSessions)
            ? payload.activeSessions
            : Array.isArray(payload?.sessions)
                ? payload.sessions
                : [];

        const historySource = Array.isArray(payload?.loginHistory)
            ? payload.loginHistory
            : activeSessions;

        setSessions(sortByLastUsedDesc(activeSessions));
        setLoginHistory(sortByLastUsedDesc(historySource).slice(0, 10));
    }, []);

    const fetchSessions = useCallback(async (silent = false) => {
        if (!targetUser) return;

        try {
            if (silent) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const response = await adminUserApi.getUserSessions(targetUser.id);
            if (!response.success) {
                throw new Error(response.message || 'Không thể tải danh sách thiết bị');
            }

            applySessionPayload(response.data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tải danh sách thiết bị';
            showError(message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [applySessionPayload, targetUser]);

    useEffect(() => {
        if (isOpen && targetUser) {
            fetchSessions(false);
            return;
        }

        if (!isOpen) {
            setSessions([]);
            setLoginHistory([]);
            setRevokingSessionId(null);
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [fetchSessions, isOpen, targetUser]);

    const handleRevokeSession = async (session: AdminUserSession) => {
        if (!targetUser) return;

        const sessionId = getSessionId(session);
        if (!sessionId) {
            showError('Không tìm thấy mã phiên đăng nhập để thu hồi');
            return;
        }

        try {
            setRevokingSessionId(sessionId);

            const response = await adminUserApi.revokeUserSession(targetUser.id, sessionId);
            if (!response.success) {
                throw new Error(response.message || 'Không thể thu hồi phiên đăng nhập');
            }

            const revokedAt = new Date().toISOString();
            const markRevoked = (items: AdminUserSession[]) => items.map((item) => (
                getSessionId(item) === sessionId
                    ? { ...item, isRevoked: true, revokedAt: item.revokedAt || revokedAt }
                    : item
            ));

            setSessions((prev) => markRevoked(prev));
            setLoginHistory((prev) => markRevoked(prev));
            showSuccess('Đã thu hồi phiên đăng nhập');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể thu hồi phiên đăng nhập';
            showError(message);
        } finally {
            setRevokingSessionId(null);
        }
    };

    const sessionCountText = useMemo(() => {
        if (isLoading) return 'Đang tải dữ liệu thiết bị...';
        return `${sessions.length} phiên đang hiển thị`;
    }, [isLoading, sessions.length]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && targetUser && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto"
                    onClick={() => !revokingSessionId && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full max-w-5xl mx-auto p-5 md:p-6 shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Thiết bị đăng nhập</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {targetUser.name} · {targetUser.email}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{sessionCountText}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchSessions(true)}
                                    disabled={isRefreshing || isLoading}
                                    className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 104.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Làm mới
                                </button>

                                <button
                                    onClick={onClose}
                                    className="h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                                >
                                    <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                                <section className="rounded-2xl border border-gray-200 p-4 bg-[#FCFDFF]">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Phiên đang hoạt động</h4>

                                    {isLoading && (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((item) => (
                                                <div key={item} className="animate-pulse rounded-xl border border-gray-100 bg-white p-3">
                                                    <div className="h-4 w-2/5 bg-gray-200 rounded mb-2" />
                                                    <div className="h-3 w-3/4 bg-gray-100 rounded mb-1.5" />
                                                    <div className="h-3 w-1/2 bg-gray-100 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!isLoading && sessions.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                                            Chưa có phiên đăng nhập nào.
                                        </div>
                                    )}

                                    {!isLoading && sessions.length > 0 && (
                                        <div className="space-y-3">
                                            {sessions.map((session, index) => {
                                                const sessionId = getSessionId(session);
                                                const revoked = isRevokedSession(session);
                                                const current = isCurrentSession(session);
                                                const isRevoking = revokingSessionId === sessionId;

                                                return (
                                                    <div
                                                        key={`${sessionId || 'session'}-${index}`}
                                                        className="rounded-xl border border-gray-200 bg-white p-3"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <div className="text-sm font-semibold text-gray-900">{getDeviceLabel(session)}</div>
                                                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{getBrowserLabel(session)} · {getOsLabel(session)} · {getDeviceTypeLabel(session)}</div>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                                                {current && (
                                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                                                                        Hiện tại
                                                                    </span>
                                                                )}
                                                                {revoked && (
                                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold border border-red-200">
                                                                        Đã thu hồi
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mt-3">
                                                            <div>Thành phố đăng nhập: <span className="font-medium text-gray-800">{getLoginCityLabel(session)}</span></div>
                                                            <div>Trình duyệt: <span className="font-medium text-gray-800">{getBrowserLabel(session)}</span></div>
                                                            <div>Loại thiết bị: <span className="font-medium text-gray-800">{getDeviceTypeLabel(session)}</span></div>
                                                            <div>Hệ điều hành: <span className="font-medium text-gray-800">{getOsLabel(session)}</span></div>
                                                            <div className="sm:col-span-2">Lần dùng gần nhất: <span className="font-medium text-gray-800">{formatDateTime(getLastUsed(session))}</span></div>
                                                            <div>Quyền vị trí: <span className="font-medium text-gray-800">{getGeoPermissionLabel(session)}</span></div>
                                                            <div>Vị trí tổng quát: <span className="font-medium text-gray-800">{getLocationLabel(session)}</span></div>
                                                            <details className="sm:col-span-2 rounded-lg border border-gray-200 px-2.5 py-2 bg-gray-50/80">
                                                                <summary className="cursor-pointer font-medium text-gray-700">Thông tin kỹ thuật</summary>
                                                                <div className="mt-1.5 space-y-1 text-gray-600">
                                                                    <div>IP: <span className="font-medium text-gray-800">{getIpLabel(session)}</span></div>
                                                                    <div>User-Agent: <span className="font-medium text-gray-800 break-all">{getUserAgentLabel(session)}</span></div>
                                                                    <div>Geo trình duyệt: <span className="font-medium text-gray-800">{getBrowserGeoLabel(session)}</span></div>
                                                                    <div>Meta thiết bị: <span className="font-medium text-gray-800">{getDeviceMetaLabel(session)}</span></div>
                                                                </div>
                                                            </details>
                                                        </div>

                                                        <div className="mt-3 flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => handleRevokeSession(session)}
                                                                isLoading={isRevoking}
                                                                disabled={revoked || !sessionId || isRevoking}
                                                                className="!rounded-lg !h-8 !px-3 !text-xs"
                                                            >
                                                                {revoked ? 'Đã thu hồi' : 'Thu hồi phiên'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-gray-200 p-4 bg-[#FCFDFF]">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Lịch sử đăng nhập (10 gần nhất)</h4>

                                    {isLoading && (
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4].map((item) => (
                                                <div key={item} className="animate-pulse flex gap-3 items-start">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200 mt-1.5" />
                                                    <div className="flex-1">
                                                        <div className="h-4 w-3/5 bg-gray-200 rounded mb-2" />
                                                        <div className="h-3 w-2/5 bg-gray-100 rounded" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!isLoading && loginHistory.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                                            Chưa có dữ liệu lịch sử đăng nhập.
                                        </div>
                                    )}

                                    {!isLoading && loginHistory.length > 0 && (
                                        <ul className="space-y-3">
                                            {loginHistory.map((item, index) => {
                                                const revoked = isRevokedSession(item);
                                                const current = isCurrentSession(item);

                                                return (
                                                    <li key={`${getSessionId(item) || 'history'}-${index}`} className="flex gap-3 items-start">
                                                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${revoked ? 'bg-red-400' : 'bg-blue-500'}`} />
                                                        <div className="flex-1 min-w-0 rounded-lg border border-gray-100 bg-white p-2.5">
                                                            <div className="text-sm font-medium text-gray-900 truncate">{getDeviceLabel(item)}</div>
                                                            <div className="text-xs text-gray-600 mt-0.5 truncate">{getLoginCityLabel(item)} · {getBrowserLabel(item)} · {getDeviceTypeLabel(item)}</div>
                                                            <div className="text-[11px] text-gray-500 mt-1">{formatDateTime(getLastUsed(item))}</div>
                                                            <div className="text-[11px] text-gray-500 mt-1 truncate">Trình duyệt: {getBrowserLabel(item)} · HĐH: {getOsLabel(item)}</div>
                                                            <div className="text-[11px] text-gray-500 mt-1 truncate">Quyền vị trí: {getGeoPermissionLabel(item)}</div>
                                                            <details className="mt-1 rounded-md border border-gray-200 px-2 py-1.5 bg-gray-50/80">
                                                                <summary className="cursor-pointer text-[11px] text-gray-600 font-medium">Xem chi tiết kỹ thuật</summary>
                                                                <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
                                                                    <div>IP: {getIpLabel(item)}</div>
                                                                    <div>User-Agent: {getUserAgentLabel(item)}</div>
                                                                    <div>Geo trình duyệt: {getBrowserGeoLabel(item)}</div>
                                                                    <div>Meta thiết bị: {getDeviceMetaLabel(item)}</div>
                                                                </div>
                                                            </details>
                                                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                                                {current && (
                                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                                                                        Hiện tại
                                                                    </span>
                                                                )}
                                                                {revoked && (
                                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold border border-red-200">
                                                                        Đã thu hồi
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
