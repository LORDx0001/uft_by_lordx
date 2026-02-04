import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useGraphics, GraphicsQuality } from '../contexts/GraphicsContext';
import { useTranslation } from 'react-i18next';

const SettingsModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { quality, setQuality } = useGraphics();
    const { t } = useTranslation();

    const qualities: { value: GraphicsQuality; label: string; description: string }[] = [
        { value: 'low', label: t('qualityLow'), description: t('qualityLowDesc') },
        { value: 'medium', label: t('qualityMedium'), description: t('qualityMediumDesc') },
        { value: 'high', label: t('qualityHigh'), description: t('qualityHighDesc') },
    ];

    const handleQualityChange = (newQuality: GraphicsQuality) => {
        setQuality(newQuality);
        // Reload page to apply changes
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    return (
        <>
            {/* Gear Icon Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                aria-label={t('settings')}
            >
                <Settings
                    className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
                />
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Settings className="w-6 h-6" />
                                {t('settings')}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Graphics Quality Section */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {t('graphicsQuality')}
                            </h3>
                            <div className="space-y-3">
                                {qualities.map((q) => (
                                    <button
                                        key={q.value}
                                        onClick={() => handleQualityChange(q.value)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${quality === q.value
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-white">
                                                    {q.label}
                                                </div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {q.description}
                                                </div>
                                            </div>
                                            {quality === q.value && (
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-200">
                                {t('settingsReloadNote')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsModal;
