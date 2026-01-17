'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ArticleMode = 'ai_image' | 'manual';

interface ModeSelectorProps {
    selectedMode: ArticleMode | null;
    onSelectMode: (mode: ArticleMode) => void;
}

const modes = [
    {
        id: 'ai_image' as ArticleMode,
        title: 'Tạo bài viết kèm ảnh AI',
        description: 'AI sẽ tự động tạo bài viết và hình ảnh phù hợp',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        id: 'manual' as ArticleMode,
        title: 'Tạo bài viết thủ công',
        description: 'AI tạo bài viết, bạn tự upload hình ảnh',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        gradient: 'from-amber-500 to-orange-500',
    },
];

export default function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modes.map((mode, index) => (
                <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode(mode.id)}
                    className={cn(
                        'relative p-6 rounded-2xl border-2 transition-all duration-300 text-left',
                        selectedMode === mode.id
                            ? 'border-transparent bg-gradient-to-br ' + mode.gradient + ' text-white shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    )}
                >
                    {/* Icon */}
                    <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                        selectedMode === mode.id
                            ? 'bg-white/20'
                            : `bg-gradient-to-br ${mode.gradient} text-white`
                    )}>
                        {mode.icon}
                    </div>

                    {/* Content */}
                    <h3 className={cn(
                        'text-lg font-semibold mb-2',
                        selectedMode === mode.id ? 'text-white' : 'text-gray-900'
                    )}>
                        {mode.title}
                    </h3>
                    <p className={cn(
                        'text-sm',
                        selectedMode === mode.id ? 'text-white/80' : 'text-gray-500'
                    )}>
                        {mode.description}
                    </p>

                    {/* Check mark */}
                    {selectedMode === mode.id && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                    )}
                </motion.button>
            ))}
        </div>
    );
}
