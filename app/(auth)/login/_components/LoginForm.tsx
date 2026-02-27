'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button, Input } from '@/components/ui';
import type { LoginContext, LoginDeviceMeta, LoginGeoPermissionState } from '@/types';

const GEO_CAPTURE_TIMEOUT_MS = 8000;

function getDeviceMeta(): LoginDeviceMeta {
    const nav = navigator as Navigator & { deviceMemory?: number };

    return {
        platform: nav.platform || 'unknown',
        language: nav.language || 'unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
        screen: {
            width: window.screen?.width ?? 0,
            height: window.screen?.height ?? 0,
            pixelRatio: typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : undefined
        },
        deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined,
        deviceCores: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined
    };
}

function getCurrentPositionWithTimeout(timeoutMs: number): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('geolocation_unsupported'));
            return;
        }

        let settled = false;
        const timer = window.setTimeout(() => {
            if (settled) return;
            settled = true;
            reject(new Error('geolocation_timeout'));
        }, timeoutMs);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                resolve(position);
            },
            (error) => {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                reject(error);
            },
            {
                enableHighAccuracy: false,
                timeout: timeoutMs,
                maximumAge: 0
            }
        );
    });
}

async function readGeoPermissionState(): Promise<Exclude<LoginGeoPermissionState, 'granted'>> {
    const nav = navigator as Navigator & {
        permissions?: {
            query: (descriptor: { name: string }) => Promise<{ state?: string }>;
        };
    };

    if (!nav.permissions?.query) {
        return 'unknown';
    }

    try {
        const result = await nav.permissions.query({ name: 'geolocation' });
        const state = String(result?.state || '').toLowerCase();

        if (state === 'prompt') return 'prompt';
        if (state === 'denied') return 'denied';
        if (state === 'granted') return 'unknown';
        return 'unknown';
    } catch {
        return 'unknown';
    }
}

function resolveGeoPermissionState(error: unknown): LoginGeoPermissionState {
    const errorCode = typeof error === 'object' && error !== null && 'code' in error
        ? Number((error as { code?: number }).code)
        : undefined;

    if (errorCode === 1) {
        return 'denied';
    }

    if (errorCode === 2 || errorCode === 3) {
        return 'error';
    }

    return 'unknown';
}

async function collectLoginContext(): Promise<LoginContext> {
    const loginContext: LoginContext = {
        geoPermissionState: 'unknown',
        deviceMeta: getDeviceMeta()
    };

    if (!navigator.geolocation) {
        loginContext.geoPermissionState = 'unsupported';
        return loginContext;
    }

    loginContext.geoPermissionState = await readGeoPermissionState();

    try {
        const position = await getCurrentPositionWithTimeout(GEO_CAPTURE_TIMEOUT_MS);

        loginContext.geoPermissionState = 'granted';
        loginContext.browserGeo = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            capturedAt: new Date().toISOString()
        };
    } catch (error) {
        loginContext.geoPermissionState = resolveGeoPermissionState(error);
    }

    return loginContext;
}

type PermissionStatusTone = 'neutral' | 'info' | 'success' | 'warning';

interface PermissionStatusView {
    state: LoginGeoPermissionState | 'idle' | 'requesting';
    title: string;
    detail: string;
    tone: PermissionStatusTone;
}

function getSiteSettingsGuideText(): string {
    return 'Nếu trình duyệt không hiện lại hộp thoại cấp quyền, hãy nhấn biểu tượng ổ khóa cạnh thanh địa chỉ → Quyền vị trí (Location) → Chọn "Cho phép", sau đó bấm "Thử lại quyền vị trí".';
}

function getPermissionHint(state: LoginGeoPermissionState, source: 'submit' | 'retry'): string {
    if (state === 'granted') {
        return source === 'retry'
            ? 'Đã cập nhật quyền vị trí thành công.'
            : '';
    }

    if (state === 'denied') {
        return `Bạn đang từ chối quyền vị trí. ${getSiteSettingsGuideText()}`;
    }

    if (state === 'prompt') {
        if (source === 'retry') {
            return `Trình duyệt đang ở trạng thái chờ cấp quyền. Nếu chưa thấy popup, ${getSiteSettingsGuideText().toLowerCase()}`;
        }

        return 'Trình duyệt đang chờ bạn cho phép quyền vị trí. Nếu không cấp quyền, hệ thống vẫn đăng nhập bình thường và ghi nhận trạng thái quyền.';
    }

    if (state === 'error') {
        return 'Không thể lấy vị trí lúc này. Hệ thống vẫn cho phép đăng nhập.';
    }

    return '';
}

function getInitialPermissionStatus(): PermissionStatusView {
    return {
        state: 'idle',
        title: 'Bước 1: Quyền vị trí',
        detail: 'Hệ thống sẽ yêu cầu quyền vị trí trước khi gửi yêu cầu đăng nhập.',
        tone: 'neutral'
    };
}

function mapPermissionStatus(state: LoginGeoPermissionState): PermissionStatusView {
    if (state === 'granted') {
        return {
            state,
            title: 'Bước 1: Quyền vị trí - Đã cấp',
            detail: 'Đã lấy thông tin vị trí từ trình duyệt. Tiếp tục đăng nhập.',
            tone: 'success'
        };
    }

    if (state === 'denied') {
        return {
            state,
            title: 'Bước 1: Quyền vị trí - Đã từ chối',
            detail: 'Bạn đã từ chối quyền vị trí. Hệ thống vẫn cho phép đăng nhập.',
            tone: 'warning'
        };
    }

    if (state === 'prompt') {
        return {
            state,
            title: 'Bước 1: Quyền vị trí - Đang chờ xác nhận',
            detail: 'Trình duyệt đang chờ bạn xác nhận quyền vị trí.',
            tone: 'info'
        };
    }

    if (state === 'unsupported') {
        return {
            state,
            title: 'Bước 1: Quyền vị trí - Không hỗ trợ',
            detail: 'Trình duyệt không hỗ trợ vị trí. Hệ thống vẫn cho phép đăng nhập.',
            tone: 'neutral'
        };
    }

    if (state === 'error') {
        return {
            state,
            title: 'Bước 1: Quyền vị trí - Không lấy được',
            detail: 'Không thể lấy vị trí lúc này. Hệ thống vẫn cho phép đăng nhập.',
            tone: 'warning'
        };
    }

    return {
        state,
        title: 'Bước 1: Quyền vị trí - Chưa xác định',
        detail: 'Không xác định được trạng thái quyền vị trí, vẫn tiếp tục đăng nhập bình thường.',
        tone: 'neutral'
    };
}

function getStatusToneClass(tone: PermissionStatusTone): string {
    if (tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-700';
    if (tone === 'info') return 'border-blue-200 bg-blue-50 text-blue-700';
    return 'border-slate-200 bg-slate-50 text-slate-700';
}

function waitForUiFrame(): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
            window.setTimeout(resolve, 0);
            return;
        }

        window.requestAnimationFrame(() => resolve());
    });
}

export default function LoginForm() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [geoHint, setGeoHint] = useState('');
    const [geoStatus, setGeoStatus] = useState<PermissionStatusView>(getInitialPermissionStatus);
    const [isRequestingGeo, setIsRequestingGeo] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const runPermissionFlow = async (source: 'submit' | 'retry'): Promise<LoginContext> => {
        setIsRequestingGeo(true);
        setGeoStatus({
            state: 'requesting',
            title: 'Bước 1: Quyền vị trí - Đang yêu cầu',
            detail: 'Đang yêu cầu quyền vị trí từ trình duyệt...',
            tone: 'info'
        });
        setGeoHint('Đang kiểm tra quyền vị trí...');

        try {
            const loginContext = await collectLoginContext();
            const resolvedState = loginContext.geoPermissionState || 'unknown';

            setGeoStatus(mapPermissionStatus(resolvedState));
            setGeoHint(getPermissionHint(resolvedState, source));

            return loginContext;
        } finally {
            setIsRequestingGeo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || isRequestingGeo) return;

        setError('');
        setGeoHint('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const loginContext = await runPermissionFlow('submit');

        if (loginContext.geoPermissionState === 'denied' || loginContext.geoPermissionState === 'prompt') {
            await waitForUiFrame();
        }

        const result = await login({
            email: formData.email,
            password: formData.password,
            rememberMe,
            loginContext
        });

        if (result.success) {
            const role = result.user?.role;

            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/admin/article');
            }
        } else {
            setError(result.error || 'Đã xảy ra lỗi');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRetryPermission = async () => {
        if (isLoading || isRequestingGeo) return;
        setError('');
        setGeoHint('');
        await runPermissionFlow('retry');
    };

    const submitLoading = isLoading || isRequestingGeo;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-3 animate-scale-in">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {geoHint && (
                <div className="px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs">
                    {geoHint}
                </div>
            )}

            <div className={`rounded-xl border px-3 py-2.5 text-xs ${getStatusToneClass(geoStatus.tone)}`}>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="font-semibold">{geoStatus.title}</div>
                        <div className="mt-1 opacity-90">{geoStatus.detail}</div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRetryPermission}
                        disabled={submitLoading}
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md border border-current/30 hover:bg-white/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Thử lại quyền vị trí
                    </button>
                </div>
            </div>

            {/* Email Input */}
            <Input
                name="email"
                type="email"
                label="Email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                }
                autoComplete="email"
                required
            />

            {/* Password Input */}
            <Input
                name="password"
                type="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                }
                autoComplete="current-password"
                required
            />

            {/* Remember Me */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${rememberMe
                            ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] border-transparent'
                            : 'border-gray-300 group-hover:border-[#F59E0B]'
                            }`}>
                            {rememberMe && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span className="text-sm text-[#71717A] group-hover:text-[#18181B] transition-colors">
                        Ghi nhớ đăng nhập
                    </span>
                </label>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={submitLoading}
            >
                Đăng nhập
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </Button>

            {/* Hint for creating account */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        Chưa có tài khoản? Liên hệ admin để được cấp quyền truy cập.
                    </span>
                </p>
            </div>
        </form>
    );
}
