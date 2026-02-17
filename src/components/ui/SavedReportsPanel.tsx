/**
 * SavedReportsPanel
 * Shows previously saved compatibility reports for logged-in users.
 * Displays on the landing page with report cards users can click to reload.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import { loadReportSummaries, loadFullReport, deleteReport, deleteAllReports } from '../../lib/supabaseService';
import type { SavedReportSummary } from '../../lib/supabaseService';
import { FileText, Trash2, Loader2, Star, Clock, ChevronRight } from 'lucide-react';

export const SavedReportsPanel: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { setCurrentReport } = useAppStore();
    const [reports, setReports] = useState<SavedReportSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingReportId, setLoadingReportId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeletingAll, setIsDeletingAll] = useState(false);

    useEffect(() => {
        if (!user) {
            setReports([]);
            return;
        }

        const fetchReports = async () => {
            setIsLoading(true);
            const data = await loadReportSummaries(user.id);
            setReports(data);
            setIsLoading(false);
        };

        fetchReports();
    }, [user]);

    const handleLoadReport = async (reportId: string) => {
        setLoadingReportId(reportId);
        const fullReport = await loadFullReport(reportId);
        if (fullReport) {
            setCurrentReport(fullReport);
            navigate('/report');
        }
        setLoadingReportId(null);
    };

    const handleDeleteReport = async (e: React.MouseEvent, reportId: string) => {
        e.stopPropagation();
        if (!confirm('Delete this report? This cannot be undone.')) return;

        setDeletingId(reportId);
        const success = await deleteReport(reportId);
        if (success) {
            setReports((prev) => prev.filter((r) => r.id !== reportId));
        }
        setDeletingId(null);
    };

    const handleDeleteAll = async () => {
        if (!user) return;
        if (!confirm('Are you sure you want to delete ALL saved reports? This action cannot be undone.')) return;

        setIsDeletingAll(true);
        const success = await deleteAllReports(user.id);
        if (success) {
            setReports([]);
        }
        setIsDeletingAll(false);
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'excellent': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
            case 'very_good': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
            case 'good': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
            case 'fair': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
            case 'challenging': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
            case 'poor': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
        }
    };

    const formatVerdict = (verdict: string) => verdict.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Don't show panel if not logged in or no reports
    if (!user) return null;
    if (isLoading) {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">
                    Your Saved Reports
                </h2>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                    <span className="ml-2 text-gray-500 dark:text-gray-400">Loading reports...</span>
                </div>
            </div>
        );
    }
    if (reports.length === 0) return null;

    return (
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                    Your Saved Reports
                </h2>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>

                {reports.length > 0 && (
                    <button
                        onClick={handleDeleteAll}
                        disabled={isDeletingAll || deletingId !== null}
                        className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeletingAll ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Delete All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                    <button
                        key={report.id}
                        onClick={() => handleLoadReport(report.id)}
                        disabled={loadingReportId === report.id}
                        className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                    >
                        {/* Delete button */}
                        <button
                            onClick={(e) => handleDeleteReport(e, report.id)}
                            disabled={deletingId === report.id}
                            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete report"
                        >
                            {deletingId === report.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>

                        {/* Partner names */}
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 pr-8 transition-colors">
                            {report.chart_a_name} & {report.chart_b_name}
                        </h3>

                        {/* Score + Verdict */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{report.overall_score}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVerdictColor(report.overall_verdict)}`}>
                                {formatVerdict(report.overall_verdict)}
                            </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                {formatDate(report.created_at)}
                            </div>
                            {loadingReportId === report.id ? (
                                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SavedReportsPanel;
