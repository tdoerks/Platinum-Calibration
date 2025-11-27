# Integration Guide for Enhanced Features

## Overview

This guide shows how to integrate the PDF export and visualization add-ons into the existing Pipette Calibration System.

## Quick Start

### Option 1: Add to Existing HTML

Add these lines to your `pipette_calibration_persistent.html`:

```html
<!-- Add before closing </body> tag -->

<!-- External Libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Add-on Scripts -->
<script src="pdf_export_addon.js"></script>
<script src="charts_addon.js"></script>
```

### Option 2: Use Enhanced Version

Open `pipette_calibration_enhanced_demo.html` which includes everything pre-integrated.

## PDF Export Features

### Basic Certificate Export

```javascript
// Export ISO 8655 calibration certificate
exportToPDF();
```

**Features:**
- Professional header with branding
- Session and environmental information
- Summary table of all pipettes
- Certification statement
- Signature block
- QR code placeholder for verification
- Automated file naming

### Detailed Data Export

```javascript
// Export full measurement data for all pipettes
exportDetailedPDF();
```

**Features:**
- Separate page for each pipette
- Complete measurement tables
- Individual pipette statistics
- Professional formatting

### Adding Export Buttons

```html
<!-- In the Report tab -->
<div class="button-group">
    <button class="btn btn-success" onclick="exportToPDF()">
        📄 Export Certificate PDF
    </button>
    <button class="btn btn-primary" onclick="exportDetailedPDF()">
        📊 Export Detailed PDF
    </button>
</div>
```

## Data Visualization Features

### Individual Charts

```javascript
// Show accuracy comparison chart
showAccuracyChart();

// Show control chart for first pipette
showControlChart(0);

// Show pass/fail distribution
showPassFailChart();

// Show volume distribution histogram
showDistributionChart(0);
```

### Complete Dashboard

```javascript
// Create a dashboard with all charts
createDashboard();
```

### Adding Chart Containers

```html
<!-- Add a new tab for Analytics -->
<div id="analytics" class="tab-content">
    <h2>📊 Analytics Dashboard</h2>

    <div id="chartDashboard">
        <!-- Charts will be inserted here automatically -->
    </div>

    <button class="btn btn-primary" onclick="createDashboard()">
        🔄 Refresh Charts
    </button>
</div>
```

## Advanced Customization

### Customize PDF Header

Edit `pdf_export_addon.js`:

```javascript
function drawHeader(doc, pageWidth, yPosition) {
    // Change colors
    doc.setFillColor(0, 123, 255);  // Your brand color

    // Add logo
    // doc.addImage(logoData, 'PNG', x, y, width, height);

    // Customize text
    doc.text('YOUR COMPANY NAME', pageWidth / 2, 12, { align: 'center' });
}
```

### Customize Chart Colors

Edit `charts_addon.js`:

```javascript
// Change accuracy chart colors
backgroundColor: 'rgba(YOUR_R, YOUR_G, YOUR_B, 0.6)'
```

### Add Custom Environmental Fields

The system already tracks:
- Temperature (°C)
- Humidity (%)
- Barometric Pressure (kPa)
- Balance Serial Number
- Balance Calibration Date

To add more fields, edit the session info section and PDF export function.

## Full Feature Integration Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Enhanced Pipette Calibration System</title>
    <!-- Your existing CSS -->
</head>
<body>
    <!-- Your existing HTML structure -->

    <!-- Add new Analytics tab -->
    <div class="nav-tabs">
        <button class="nav-tab" onclick="showTab('sessionInfo', this)">📋 Session Info</button>
        <button class="nav-tab" onclick="showTab('calibration', this)">⚖️ Calibration</button>
        <button class="nav-tab" onclick="showTab('analysis', this)">📊 Analysis</button>
        <button class="nav-tab" onclick="showTab('analytics', this)">📈 Analytics</button>
        <button class="nav-tab" onclick="showTab('report', this)">📄 Report</button>
        <button class="nav-tab" onclick="showTab('history', this)">📚 History</button>
    </div>

    <!-- Analytics Tab -->
    <div id="analytics" class="tab-content">
        <div style="margin-bottom: 20px;">
            <h2>📈 Data Visualization</h2>
            <p>Interactive charts and analytics for your calibration data</p>
        </div>

        <div class="button-group" style="margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="createDashboard()">
                🔄 Generate Dashboard
            </button>
            <button class="btn btn-secondary" onclick="destroyAllCharts()">
                🗑️ Clear Charts
            </button>
        </div>

        <div id="chartDashboard"></div>
    </div>

    <!-- Enhanced Report Tab -->
    <div id="report" class="tab-content">
        <!-- Existing report content -->

        <div class="button-group">
            <button class="btn btn-success" onclick="exportFormattedCSV()">
                📊 Export CSV
            </button>
            <button class="btn btn-primary" onclick="exportToPDF()">
                📄 Export Certificate PDF
            </button>
            <button class="btn btn-info" onclick="exportDetailedPDF()">
                📊 Export Detailed PDF
            </button>
            <button class="btn btn-secondary" onclick="saveSession()">
                💾 Save JSON
            </button>
        </div>
    </div>

    <!-- External Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Your existing JavaScript -->
    <script>
        // All your existing code
    </script>

    <!-- Add-on Scripts -->
    <script src="pdf_export_addon.js"></script>
    <script src="charts_addon.js"></script>

    <script>
        // Auto-generate dashboard when switching to analytics tab
        const originalShowTab = window.showTab;
        window.showTab = function(tabId, element) {
            originalShowTab(tabId, element);
            if (tabId === 'analytics' && pipettes.length > 0) {
                setTimeout(createDashboard, 100);
            }
        };
    </script>
</body>
</html>
```

## Browser Compatibility

### PDF Export
- ✅ Chrome/Edge (Modern)
- ✅ Firefox (Modern)
- ✅ Safari (Modern)
- ❌ IE11

### Charts
- ✅ All modern browsers
- ✅ Mobile browsers
- ❌ IE11

## Performance Considerations

- Charts update automatically when data changes
- Call `destroyAllCharts()` before recreating to prevent memory leaks
- Large datasets (>100 pipettes) may slow down chart rendering
- PDF generation is synchronous - UI may freeze briefly for large reports

## Troubleshooting

### PDF Export Not Working

**Issue**: "PDF library not loaded" error

**Solution**:
```html
<!-- Ensure jsPDF is loaded BEFORE the addon script -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="pdf_export_addon.js"></script>
```

### Charts Not Displaying

**Issue**: Canvas elements not found

**Solution**:
```javascript
// Ensure canvas elements exist in HTML
<canvas id="accuracyChart"></canvas>
<canvas id="controlChart"></canvas>
<canvas id="passFailChart"></canvas>
<canvas id="distributionChart"></canvas>
```

### Memory Issues with Charts

**Issue**: Browser slowing down after multiple chart regenerations

**Solution**:
```javascript
// Always destroy charts before regenerating
destroyAllCharts();
createDashboard();
```

## Advanced Features (Future)

### Coming Soon:
- QR code generation with verification link
- Digital signatures for PDF certificates
- Email PDF directly from application
- Excel export with multiple worksheets
- Real-time chart updates during measurement entry
- Comparative analysis across calibration sessions
- Machine learning predictions for calibration drift

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify all libraries are loaded
3. Ensure pipettes array has data
4. Test with sample data first

## Example Data for Testing

```javascript
// Load sample data to test features
autoFillSampleData();

// Then try:
exportToPDF();
createDashboard();
```

---

**Last Updated**: November 26, 2025
**Version**: 1.0 Enhanced
**Addons**: PDF Export, Data Visualization
