'use client';

import { motion } from 'framer-motion';
import type { GeneratedScript } from '@/lib/fakeData';
import ShotBadge from './ShotBadge';

interface SceneTableProps {
    script: GeneratedScript;
    onReset: () => void;
}

export default function SceneTable({ script, onReset }: SceneTableProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tóm tắt kịch bản
                </h3>
                <p className="text-gray-600 leading-relaxed">{script.summary}</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                                    Phân cảnh
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                                    Địa điểm
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                                    Cỡ cảnh
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mô tả cảnh chi tiết
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Voice over / Highlight
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                                    Source
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
                                    Ghi chú
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {script.scenes.map((scene, index) => (
                                <motion.tr
                                    key={scene.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                                            {scene.id}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                                        {scene.location}
                                    </td>
                                    <td className="px-4 py-4">
                                        <ShotBadge shotType={scene.shotType} />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">
                                        {scene.description}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600 italic">
                                        {scene.voiceOver || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500">
                                        {scene.source}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-amber-600 font-medium">
                                        {scene.note || '-'}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={onReset}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo kịch bản mới
                </button>
                <button
                    onClick={() => {
                        const text = script.scenes.map(s =>
                            `${s.id}. ${s.location} | ${s.description} | ${s.voiceOver}`
                        ).join('\n');
                        navigator.clipboard.writeText(text);
                        alert('Đã copy kịch bản!');
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy kịch bản
                </button>
            </div>
        </motion.div>
    );
}
