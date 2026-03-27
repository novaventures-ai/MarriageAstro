/**
 * usePdfExport hook
 * Lazily loads @react-pdf/renderer and triggers browser download.
 * Only loaded when the user clicks "Export PDF" — keeps bundle lean.
 */

import { useState, useCallback } from 'react';

export type PdfExportStatus = 'idle' | 'generating' | 'done' | 'error';

export function usePdfExport() {
  const [status, setStatus] = useState<PdfExportStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const exportPdf = useCallback(async (report: any, filename?: string) => {
    setStatus('generating');
    setError(null);

    try {
      // Dynamic import — only bundled when called
      const [pdfRenderer, { ReportPdf }, React] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../components/pdf/ReportPdf'),
        import('react'),
      ]);

      const nameA = report.chartA?.name || 'PartnerA';
      const nameB = report.chartB?.name || 'PartnerB';
      const pdfFilename = filename || `AstroMarriage_${nameA}_${nameB}_Report.pdf`;

      const element = React.createElement(ReportPdf, { report }) as any;
      const blob = await pdfRenderer.pdf(element).toBlob();

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error('PDF export failed:', err);
      setError(err.message || 'Failed to generate PDF');
      setStatus('error');
    }
  }, []);

  return { exportPdf, status, error };
}
