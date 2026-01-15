import React from 'react';
import { X, BookOpen, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { RESEARCH_SUMMARY } from '../historicalData';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const DocumentationModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Historical Truths</h2>
                                    <p className="text-blue-100 text-sm">50 Years of Canadian Housing Data</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">

                        {/* Key Findings */}
                        <section className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={18} className="text-blue-600" />
                                <h3 className="font-bold text-slate-900">What History Tells Us (1975-2025)</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {RESEARCH_SUMMARY.keyFindings.map((finding, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            {finding.label}
                                        </p>
                                        <p className="text-xl font-bold text-slate-900 mb-1">{finding.value}</p>
                                        <p className="text-xs text-slate-600">{finding.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Historical Timeline */}
                        <section className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar size={18} className="text-purple-600" />
                                <h3 className="font-bold text-slate-900">Key Milestones</h3>
                            </div>
                            <div className="space-y-2">
                                {RESEARCH_SUMMARY.historicalMilestones.map((milestone, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-md min-w-[50px] text-center">
                                            {milestone.year}
                                        </span>
                                        <p className="text-sm text-slate-600 leading-relaxed">{milestone.event}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Sources */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <ExternalLink size={18} className="text-green-600" />
                                <h3 className="font-bold text-slate-900">Data Sources</h3>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <ul className="space-y-2">
                                    {RESEARCH_SUMMARY.sources.map((source, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                            >
                                                {source.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Disclaimer */}
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <p className="text-xs text-amber-800">
                                <strong>Heads up:</strong> History is a great teacher, but it can't predict the future perfectly. Your mileage may vary.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                        <button
                            onClick={onClose}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
