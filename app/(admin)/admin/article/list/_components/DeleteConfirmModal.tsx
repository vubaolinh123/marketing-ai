'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
}: DeleteConfirmModalProps) {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-start justify-center px-4 pt-28 sm:pt-32 pb-6 sm:pb-8 overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl max-w-md w-full mx-auto p-6 shadow-2xl"
                    >
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Xác nhận xóa
                            </h3>
                            <p className="text-gray-500">
                                Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
                            </p>
                            {title && (
                                <p className="mt-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg px-3 py-2">
                                    &ldquo;{title}&rdquo;
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-1 !bg-red-500 hover:!bg-red-600"
                                onClick={onConfirm}
                            >
                                Xóa
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
