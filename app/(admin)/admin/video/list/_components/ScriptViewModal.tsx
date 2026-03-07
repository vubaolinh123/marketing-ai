'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { VideoScript, videoScriptApi } from '@/lib/api';


interface ScriptViewModalProps {
    isOpen: boolean;
    script: VideoScript | null;
    onClose: () => void;
}

// Shot type labels
const SHOT_TYPE_LABELS: Record<string, string> = {
    'goc_trung': 'Góc trung',
    'can_canh': 'Cận cảnh',
    'goc_rong': 'Góc rộng',
    'overlay': 'Overlay'
};

export default function ScriptViewModal({ isOpen, script, onClose }: ScriptViewModalProps) {
    const [exporting, setExporting] = useState(false);
    const [copying, setCopying] = useState(false);

    const handleExportExcel = useCallback(async () => {
        if (!script) return;
        setExporting(true);
        try {
            await videoScriptApi.exportToExcel(script._id);
            alert('Đã tải xuống file Excel!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Lỗi khi xuất file Excel');
        } finally {
            setExporting(false);
        }
    }, [script]);

    const handleCopyToClipboard = useCallback(async () => {
        if (!script) return;
        setCopying(true);

        try {
            // Format script as text
            let text = `KỊCH BẢN VIDEO: ${script.title}\n`;
            text += `${'='.repeat(50)}\n\n`;
            text += `Thời lượng: ${script.duration || 'N/A'}\n`;
            text += `Số cảnh: ${script.scenes?.length || 0}\n`;
            text += `Voice Over: ${script.hasVoiceOver ? 'Có' : 'Không'}\n\n`;
            text += `TÓM TẮT:\n${script.summary || 'Không có'}\n\n`;
            text += `${'='.repeat(50)}\n`;
            text += `CHI TIẾT CÁC CẢNH:\n`;
            text += `${'='.repeat(50)}\n\n`;

            script.scenes?.forEach((scene) => {
                text += `CẢNH ${scene.sceneNumber}: ${SHOT_TYPE_LABELS[scene.shotType] || scene.shotType}\n`;
                text += `Địa điểm: ${scene.location || 'N/A'}\n`;
                text += `Mô tả: ${scene.description}\n`;
                if (scene.voiceOver) text += `Voice Over: ${scene.voiceOver}\n`;
                text += `Nguồn: ${scene.source || 'Quay mới'}\n`;
                if (scene.note) text += `Ghi chú: ${scene.note}\n`;
                text += `\n${'-'.repeat(30)}\n\n`;
            });

            await navigator.clipboard.writeText(text);
            alert('Đã copy kịch bản vào clipboard!');
        } catch (error) {
            console.error('Copy error:', error);
            alert('Lỗi khi copy');
        } finally {
            setCopying(false);
        }
    }, [script]);

    if (typeof window === 'undefined' || !isOpen || !script) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1300] flex items-stretch justify-center p-0 sm:p-2 md:p-5 overflow-y-auto overscroll-contain bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full max-w-[1480px] h-full overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📹</span>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{script.title}</h2>
                                <p className="text-sm text-gray-500">
                                    {script.duration} • {script.scenes?.length || 0} cảnh
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-5 lg:px-6 py-5 space-y-5">
                        {/* Summary */}
                        {script.summary && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                                <h3 className="text-sm font-medium text-purple-700 mb-2">📝 Tóm tắt ý tưởng</h3>
                                <p className="text-gray-700">{script.summary}</p>
                            </div>
                        )}

                        {/* Scenes Table */}
                        <div className="border rounded-xl overflow-hidden bg-white">
                            <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">STT</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Góc quay</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voice Over</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Nguồn</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {script.scenes?.map((scene, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap align-top">
                                                {scene.sceneNumber}
                                            </td>
                                            <td className="px-4 py-3 align-top whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                                                    {SHOT_TYPE_LABELS[scene.shotType] || scene.shotType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 min-w-[300px] align-top">
                                                <p className="line-clamp-3">{scene.description}</p>
                                                {scene.location && (
                                                    <p className="text-xs text-gray-400 mt-1">📍 {scene.location}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 min-w-[260px] align-top">
                                                <p className="line-clamp-2">{scene.voiceOver || '-'}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap align-top">
                                                {scene.source || 'Quay mới'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 md:px-6 py-4 border-t border-gray-100 flex gap-3">
                        <button
                            onClick={handleCopyToClipboard}
                            disabled={copying}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                        >
                            {copying ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            )}
                            Copy kịch bản
                        </button>
                        <button
                            onClick={handleExportExcel}
                            disabled={exporting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg transition-all"
                        >
                            {exporting ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                            Xuất Excel
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
