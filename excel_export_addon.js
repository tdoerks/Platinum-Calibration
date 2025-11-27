/**
 * Advanced Excel/CSV Export Add-on
 *
 * Provides enhanced export capabilities:
 * - Multi-sheet Excel workbooks
 * - Formatted CSV with proper headers
 * - Statistical summary sheets
 * - Regulatory compliance templates
 * - Batch export for multiple sessions
 *
 * Usage:
 * 1. Include SheetJS (xlsx) library:
 *    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
 *
 * 2. Call export functions:
 *    exportToExcel();
 *    exportAdvancedCSV();
 *    exportBatchSessions();
 */

/**
 * Export to multi-sheet Excel workbook
 */
function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('Excel library not loaded. Falling back to CSV export.');
        exportAdvancedCSV();
        return;
    }

    const workbook = XLSX.utils.book_new();
    const sessionInfo = getSessionInfo();

    // Sheet 1: Summary
    const summaryData = createSummarySheet();
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Environmental Conditions
    const envData = createEnvironmentalSheet(sessionInfo);
    const envSheet = XLSX.utils.aoa_to_sheet(envData);
    XLSX.utils.book_append_sheet(workbook, envSheet, 'Environmental');

    // Sheet 3-N: Individual Pipette Data
    pipettes.forEach((pipette, index) => {
        const pipetteData = createPipetteSheet(pipette, index);
        const pipetteSheet = XLSX.utils.aoa_to_sheet(pipetteData);
        const sheetName = `Pipette_${index + 1}`.substring(0, 31); // Excel limit
        XLSX.utils.book_append_sheet(workbook, pipetteSheet, sheetName);
    });

    // Sheet N+1: Statistical Analysis
    const statsData = createStatisticalSheet();
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');

    // Save file
    const fileName = `Calibration_Data_${sessionInfo.location || 'Lab'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

/**
 * Create summary sheet data
 */
function createSummarySheet() {
    const sessionInfo = getSessionInfo();
    const data = [
        ['PIPETTE CALIBRATION SUMMARY'],
        [''],
        ['Session Information'],
        ['Service Provider:', sessionInfo.serviceProvider || 'N/A'],
        ['Technician:', sessionInfo.technician || 'N/A'],
        ['Location:', sessionInfo.location || 'N/A'],
        ['Date:', sessionInfo.calibrationDate || new Date().toLocaleDateString()],
        [''],
        ['Pipette Summary'],
        ['#', 'Model', 'Serial Number', 'Nominal Volume', 'Accuracy %', 'Precision %', 'Status'],
    ];

    pipettes.forEach((p, i) => {
        data.push([
            i + 1,
            p.model || 'N/A',
            p.serialNumber || 'N/A',
            `${p.nominalVolume || 'N/A'} µL`,
            p.averageAccuracy ? p.averageAccuracy.toFixed(2) : 'N/A',
            p.averagePrecision ? p.averagePrecision.toFixed(2) : 'N/A',
            p.status || 'PENDING'
        ]);
    });

    data.push(['']);
    data.push(['Overall Statistics']);
    data.push(['Total Pipettes:', pipettes.length]);
    data.push(['Passed:', pipettes.filter(p => p.status === 'PASS').length]);
    data.push(['Failed:', pipettes.filter(p => p.status === 'FAIL').length]);
    data.push(['Pending:', pipettes.filter(p => !p.status || p.status === 'PENDING').length]);

    return data;
}

/**
 * Create environmental conditions sheet
 */
function createEnvironmentalSheet(sessionInfo) {
    return [
        ['ENVIRONMENTAL CONDITIONS'],
        [''],
        ['Parameter', 'Value', 'Unit', 'ISO 8655 Range', 'Compliant'],
        ['Temperature', sessionInfo.temperature || 'N/A', '°C', '15-30', checkTemp(sessionInfo.temperature)],
        ['Humidity', sessionInfo.humidity || 'N/A', '%', '30-75', checkHumidity(sessionInfo.humidity)],
        ['Pressure', sessionInfo.pressure || 'N/A', 'kPa', '95-105', checkPressure(sessionInfo.pressure)],
        [''],
        ['Balance Information'],
        ['Serial Number', sessionInfo.balanceSerial || 'N/A'],
        ['Calibration Date', sessionInfo.balanceCalDate || 'N/A'],
        ['Due Date', sessionInfo.balanceDueDate || 'N/A'],
        ['Status', checkBalanceValid(sessionInfo.balanceCalDate, sessionInfo.balanceDueDate)]
    ];
}

/**
 * Create individual pipette sheet
 */
function createPipetteSheet(pipette, index) {
    const data = [
        [`PIPETTE ${index + 1} CALIBRATION DATA`],
        [''],
        ['Pipette Information'],
        ['Model:', pipette.model || 'N/A'],
        ['Manufacturer:', pipette.manufacturer || 'N/A'],
        ['Serial Number:', pipette.serialNumber || 'N/A'],
        ['Nominal Volume:', `${pipette.nominalVolume || 'N/A'} µL`],
        ['Test Volume:', `${pipette.testVolume || 'N/A'} µL`],
        [''],
        ['Calibration Results'],
        ['Average Accuracy:', pipette.averageAccuracy ? `${pipette.averageAccuracy.toFixed(2)}%` : 'N/A'],
        ['Average Precision:', pipette.averagePrecision ? `${pipette.averagePrecision.toFixed(2)}%` : 'N/A'],
        ['Status:', pipette.status || 'PENDING'],
        [''],
        ['Measurement Data'],
        ['#', 'Mass (g)', 'Volume (µL)', 'Accuracy (%)', 'Precision (%)', 'Pass/Fail']
    ];

    if (pipette.measurements && pipette.measurements.length > 0) {
        pipette.measurements.forEach((m, i) => {
            data.push([
                i + 1,
                m.mass ? m.mass.toFixed(4) : 'N/A',
                m.volume ? m.volume.toFixed(2) : 'N/A',
                m.accuracy ? m.accuracy.toFixed(2) : 'N/A',
                m.precision ? m.precision.toFixed(2) : 'N/A',
                m.pass ? 'PASS' : 'FAIL'
            ]);
        });

        // Add statistics
        const volumes = pipette.measurements.map(m => m.volume).filter(v => v);
        if (volumes.length > 0) {
            const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
            const variance = volumes.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / volumes.length;
            const stdDev = Math.sqrt(variance);
            const cv = (stdDev / mean) * 100;

            data.push(['']);
            data.push(['Statistical Summary']);
            data.push(['Mean Volume:', mean.toFixed(2), 'µL']);
            data.push(['Std Deviation:', stdDev.toFixed(2), 'µL']);
            data.push(['CV%:', cv.toFixed(2), '%']);
            data.push(['Min Volume:', Math.min(...volumes).toFixed(2), 'µL']);
            data.push(['Max Volume:', Math.max(...volumes).toFixed(2), 'µL']);
            data.push(['Range:', (Math.max(...volumes) - Math.min(...volumes)).toFixed(2), 'µL']);
        }
    }

    return data;
}

/**
 * Create statistical analysis sheet
 */
function createStatisticalSheet() {
    const data = [
        ['STATISTICAL ANALYSIS'],
        [''],
        ['Overall Calibration Statistics'],
        ['Metric', 'Value'],
        ['Total Pipettes Calibrated', pipettes.length],
        ['Pass Rate', `${((pipettes.filter(p => p.status === 'PASS').length / pipettes.length) * 100).toFixed(1)}%`],
        [''],
        ['Accuracy Statistics'],
        ['Pipette', 'Mean Accuracy %', 'Std Dev', 'Min', 'Max'],
    ];

    pipettes.forEach((p, i) => {
        if (p.measurements && p.measurements.length > 0) {
            const accuracies = p.measurements.map(m => m.accuracy).filter(a => a);
            if (accuracies.length > 0) {
                const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
                const stdDev = Math.sqrt(accuracies.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / accuracies.length);
                data.push([
                    `Pipette ${i + 1}`,
                    mean.toFixed(2),
                    stdDev.toFixed(2),
                    Math.min(...accuracies).toFixed(2),
                    Math.max(...accuracies).toFixed(2)
                ]);
            }
        }
    });

    return data;
}

/**
 * Export advanced CSV with proper formatting
 */
function exportAdvancedCSV() {
    const sessionInfo = getSessionInfo();
    let csv = '';

    // Header
    csv += 'PIPETTE CALIBRATION DATA EXPORT\n';
    csv += `Generated: ${new Date().toLocaleString()}\n`;
    csv += `Location: ${sessionInfo.location || 'N/A'}\n`;
    csv += `Technician: ${sessionInfo.technician || 'N/A'}\n`;
    csv += '\n';

    // Environmental conditions
    csv += 'ENVIRONMENTAL CONDITIONS\n';
    csv += 'Parameter,Value,Unit\n';
    csv += `Temperature,${sessionInfo.temperature || 'N/A'},°C\n`;
    csv += `Humidity,${sessionInfo.humidity || 'N/A'},%\n`;
    csv += `Pressure,${sessionInfo.pressure || 'N/A'},kPa\n`;
    csv += '\n';

    // Pipette data
    csv += 'PIPETTE CALIBRATION RESULTS\n';
    csv += 'Pipette #,Model,Serial Number,Nominal Volume (µL),Accuracy %,Precision %,Status\n';

    pipettes.forEach((p, i) => {
        csv += `${i + 1},"${p.model || 'N/A'}","${p.serialNumber || 'N/A'}",${p.nominalVolume || 'N/A'},`;
        csv += `${p.averageAccuracy ? p.averageAccuracy.toFixed(2) : 'N/A'},`;
        csv += `${p.averagePrecision ? p.averagePrecision.toFixed(2) : 'N/A'},${p.status || 'PENDING'}\n`;
    });

    csv += '\n';

    // Detailed measurements
    csv += 'DETAILED MEASUREMENTS\n';
    pipettes.forEach((p, i) => {
        if (p.measurements && p.measurements.length > 0) {
            csv += `\nPipette ${i + 1}: ${p.model || 'Unknown'} (S/N: ${p.serialNumber || 'N/A'})\n`;
            csv += 'Measurement #,Mass (g),Volume (µL),Accuracy %,Precision %\n';
            p.measurements.forEach((m, j) => {
                csv += `${j + 1},${m.mass ? m.mass.toFixed(4) : 'N/A'},`;
                csv += `${m.volume ? m.volume.toFixed(2) : 'N/A'},`;
                csv += `${m.accuracy ? m.accuracy.toFixed(2) : 'N/A'},`;
                csv += `${m.precision ? m.precision.toFixed(2) : 'N/A'}\n`;
            });
        }
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Calibration_Export_${sessionInfo.location || 'Lab'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

/**
 * Helper functions for compliance checking
 */
function checkTemp(temp) {
    if (!temp) return 'N/A';
    return (temp >= 15 && temp <= 30) ? 'YES' : 'NO';
}

function checkHumidity(humidity) {
    if (!humidity) return 'N/A';
    return (humidity >= 30 && humidity <= 75) ? 'YES' : 'NO';
}

function checkPressure(pressure) {
    if (!pressure) return 'N/A';
    return (pressure >= 95 && pressure <= 105) ? 'YES' : 'NO';
}

function checkBalanceValid(calDate, dueDate) {
    if (!calDate || !dueDate) return 'N/A';
    const today = new Date();
    const due = new Date(dueDate);
    return today <= due ? 'VALID' : 'EXPIRED';
}

// Make functions globally available
window.exportToExcel = exportToExcel;
window.exportAdvancedCSV = exportAdvancedCSV;

console.log('✅ Excel/CSV Export Add-on loaded successfully');
console.log('Use exportToExcel() for multi-sheet workbook or exportAdvancedCSV() for detailed CSV');
