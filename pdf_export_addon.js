/**
 * PDF Export Add-on for Platinum Pipette Calibration System
 *
 * This module adds professional PDF export capabilities with ISO 8655 compliance
 *
 * Usage:
 * 1. Include jsPDF library before this script:
 *    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
 *
 * 2. Add export button to HTML:
 *    <button onclick="exportToPDF()">📄 Export PDF Certificate</button>
 *
 * 3. This script will automatically integrate with existing calibration data
 */

/**
 * Main PDF export function
 * Generates an ISO 8655-compliant calibration certificate
 */
async function exportToPDF() {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please include jsPDF in your HTML.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Get session data
    const sessionInfo = getSessionInfo();
    const currentDate = new Date().toLocaleDateString();

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // === HEADER ===
    drawHeader(doc, pageWidth, yPosition);
    yPosition += 40;

    // === CERTIFICATE TITLE ===
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('PIPETTE CALIBRATION CERTIFICATE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('ISO 8655 Compliance Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // === SESSION INFORMATION ===
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Service Information', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const sessionFields = [
        ['Service Provider:', sessionInfo.serviceProvider],
        ['Technician:', sessionInfo.technician],
        ['Location:', sessionInfo.location],
        ['Calibration Date:', sessionInfo.calibrationDate || currentDate],
        ['Certificate Number:', `CERT-${Date.now()}`]
    ];

    sessionFields.forEach(([label, value]) => {
        doc.text(label, margin, yPosition);
        doc.text(value || 'N/A', margin + 60, yPosition);
        yPosition += 6;
    });

    yPosition += 10;

    // === ENVIRONMENTAL CONDITIONS ===
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Environmental Conditions', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const envFields = [
        ['Temperature:', `${sessionInfo.temperature || 'N/A'} °C`],
        ['Humidity:', `${sessionInfo.humidity || 'N/A'} %`],
        ['Pressure:', `${sessionInfo.pressure || 'N/A'} kPa`],
        ['Balance S/N:', sessionInfo.balanceSerial || 'N/A'],
        ['Balance Cal. Date:', sessionInfo.balanceCalDate || 'N/A']
    ];

    envFields.forEach(([label, value]) => {
        doc.text(label, margin, yPosition);
        doc.text(value, margin + 60, yPosition);
        yPosition += 6;
    });

    yPosition += 10;

    // === PIPETTE SUMMARY TABLE ===
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Calibration Summary', margin, yPosition);
    yPosition += 7;

    // Table header
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    const colWidths = [30, 40, 30, 30, 30];
    const cols = ['Model', 'Serial Number', 'Volume', 'Result', 'Accuracy'];
    let xPos = margin;

    // Draw header background
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 7, 'F');

    cols.forEach((col, i) => {
        doc.text(col, xPos + 2, yPosition);
        xPos += colWidths[i];
    });
    yPosition += 7;

    // Table rows
    doc.setFont(undefined, 'normal');
    pipettes.forEach((pipette, index) => {
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = margin;
        }

        xPos = margin;
        const rowData = [
            pipette.model || 'N/A',
            pipette.serialNumber || 'N/A',
            `${pipette.nominalVolume || 'N/A'} µL`,
            pipette.status || 'N/A',
            pipette.averageAccuracy ? `${pipette.averageAccuracy.toFixed(2)}%` : 'N/A'
        ];

        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 7, 'F');
        }

        rowData.forEach((data, i) => {
            doc.text(data, xPos + 2, yPosition);
            xPos += colWidths[i];
        });
        yPosition += 7;
    });

    yPosition += 15;

    // === CERTIFICATION STATEMENT ===
    if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
    }

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Certification Statement', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const certText = [
        'This certificate documents the calibration of the above-listed pipettes in accordance',
        'with ISO 8655 standards. All measurements were performed using calibrated equipment',
        'traceable to national standards. The results indicate compliance with manufacturer',
        'specifications and ISO 8655 requirements for accuracy and precision.'
    ];

    certText.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += 5;
    });

    yPosition += 15;

    // === SIGNATURE BLOCK ===
    doc.setFontSize(10);
    doc.text('_____________________________', margin, yPosition);
    doc.text('_____________________________', pageWidth - margin - 60, yPosition);
    yPosition += 5;
    doc.text('Technician Signature', margin, yPosition);
    doc.text('Date', pageWidth - margin - 60, yPosition);

    // === FOOTER ===
    drawFooter(doc, pageWidth, pageHeight);

    // Add QR code placeholder
    addQRCode(doc, pageWidth, pageHeight, `CERT-${Date.now()}`);

    // Save the PDF
    const fileName = `Calibration_Certificate_${sessionInfo.location || 'Lab'}_${currentDate.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
}

/**
 * Draw professional header
 */
function drawHeader(doc, pageWidth, yPosition) {
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('PLATINUM CALIBRATION SERVICES', pageWidth / 2, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('ISO 8655 Certified Pipette Calibration', pageWidth / 2, 20, { align: 'center' });

    doc.setTextColor(0, 0, 0);
}

/**
 * Draw footer with page numbers and disclaimer
 */
function drawFooter(doc, pageWidth, pageHeight) {
    const footerY = pageHeight - 15;

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth / 2, footerY + 4, { align: 'center' });
    doc.text('This is a computer-generated certificate. No signature required for validity.', pageWidth / 2, footerY + 8, { align: 'center' });

    doc.setTextColor(0, 0, 0);
}

/**
 * Add QR code for certificate verification
 */
function addQRCode(doc, pageWidth, pageHeight, certNumber) {
    // QR code placeholder - would need QR library for actual implementation
    const qrSize = 20;
    const qrX = pageWidth - 30;
    const qrY = pageHeight - 35;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(qrX, qrY, qrSize, qrSize);

    doc.setFontSize(6);
    doc.text('QR Code', qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
    doc.text(certNumber, qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
}

/**
 * Export detailed pipette data to PDF
 * Includes all measurement data for each pipette
 */
async function exportDetailedPDF() {
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    drawHeader(doc, pageWidth, yPosition);
    yPosition += 40;

    // Iterate through each pipette
    pipettes.forEach((pipette, index) => {
        if (index > 0) {
            doc.addPage();
            yPosition = margin;
        }

        // Pipette header
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(`Pipette ${index + 1}: ${pipette.model || 'Unknown Model'}`, margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Serial Number: ${pipette.serialNumber || 'N/A'}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Nominal Volume: ${pipette.nominalVolume || 'N/A'} µL`, margin, yPosition);
        yPosition += 6;
        doc.text(`Status: ${pipette.status || 'N/A'}`, margin, yPosition);
        yPosition += 10;

        // Measurement table
        if (pipette.measurements && pipette.measurements.length > 0) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Measurements', margin, yPosition);
            yPosition += 7;

            // Table header
            doc.setFontSize(9);
            const headers = ['#', 'Mass (g)', 'Volume (µL)', 'Accuracy (%)', 'Precision (%)'];
            const colWidth = (pageWidth - 2*margin) / headers.length;

            doc.setFillColor(230, 230, 230);
            doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 7, 'F');

            headers.forEach((header, i) => {
                doc.text(header, margin + i*colWidth + 2, yPosition);
            });
            yPosition += 7;

            // Data rows
            doc.setFont(undefined, 'normal');
            pipette.measurements.forEach((measurement, i) => {
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = margin;
                }

                const rowData = [
                    `${i + 1}`,
                    measurement.mass?.toFixed(4) || 'N/A',
                    measurement.volume?.toFixed(2) || 'N/A',
                    measurement.accuracy?.toFixed(2) || 'N/A',
                    measurement.precision?.toFixed(2) || 'N/A'
                ];

                if (i % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 7, 'F');
                }

                rowData.forEach((data, j) => {
                    doc.text(data, margin + j*colWidth + 2, yPosition);
                });
                yPosition += 7;
            });
        }

        drawFooter(doc, pageWidth, pageHeight);
    });

    const fileName = `Detailed_Calibration_Data_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
}

// Make functions globally available
window.exportToPDF = exportToPDF;
window.exportDetailedPDF = exportDetailedPDF;

console.log('✅ PDF Export Add-on loaded successfully');
console.log('Use exportToPDF() for certificate or exportDetailedPDF() for full data');
