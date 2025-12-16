# Platinum Pipette Calibration System

Professional web-based pipette calibration management tool with ISO 8655 compliance.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- ✅ **ISO 8655 Compliant** - Follows international pipette calibration standards
- 💾 **Auto-Save** - Automatic browser localStorage persistence
- 📊 **Real-time Validation** - Instant pass/fail calculations
- 📄 **Professional Certificates** - Industry-standard calibration reports
- 🎨 **Colorblind Accessible** - High-contrast colors with symbols
- 📱 **Mobile Responsive** - Works on tablets and phones
- 🖨️ **Print Optimized** - Beautiful certificates on standard paper
- 📚 **Session History** - Track and recall past calibrations
- 📥 **Import/Export** - JSON and CSV data exchange

## 🚀 Quick Start

### Online (Recommended)
Visit the live demo: **https://tdoerks.github.io/Platinum-Calibration/**

### Local Use
1. Download `index.html`
2. Open in any modern browser (Chrome, Firefox, Safari, Edge)
3. Start calibrating!

No installation, no dependencies, no server required.

## 📖 How to Use

### 1. Session Information
- Enter your details (technician, location, client, etc.)
- Fill in environmental conditions (temperature, humidity, pressure)
- Add balance calibration info for traceability

### 2. Add Pipettes
- Click "**+ Add Pipette**" button
- Enter pipette details (brand, serial, model)
- Choose single or multi-channel
- Select volume range

### 3. Enter Measurements
- Input 4 readings for each test point (LOW/MID/HIGH)
- Enter **As Found** measurements (initial state)
- Enter **As Left** measurements (after adjustment)
- Watch real-time validation (PASS/FAIL)

### 4. Generate Report
- Go to **Report** tab
- Review professional certificate
- Click **Print** or save as PDF (Ctrl+P / Cmd+P)
- Download JSON backup if needed

## 📊 Supported Pipette Types

### Single Channel
- P-2 (0.2-2 μL)
- P-10 (1-10 μL)
- P-20 (2-20 μL)
- P-100 (10-100 μL)
- P-200 (20-200 μL)
- P-1000 (100-1000 μL)
- P-5000 (500-5000 μL)
- P-10000 (1000-10000 μL)

### Multi-Channel
- 8-channel and 12-channel variants
- Same volume ranges as single-channel
- Multi-channel ISO 8655 specifications

## 🔬 Calibration Standards

### ISO 8655 Compliance
- Gravimetric analysis method (ISO 8655-6)
- Accuracy: Systematic error within ±% limits
- Precision: CV% or SD within specification limits
- Service Level 3: 4 As Found + 4 As Left measurements

### Specifications
- Automatic volume-based decimal precision
- ≤25 μL: 2 decimal places (e.g., 19.85 μL)
- >25 μL: 1 decimal place (e.g., 99.5 μL)

### Traceability
- NIST-traceable measurements
- Balance calibration tracking
- Certificate number generation
- Environmental condition documentation

## 💾 Data Management

### Auto-Save
- Changes saved automatically to browser localStorage
- Saves every 500ms after edits
- Visual "Saved" indicator
- Data persists across browser sessions

### Session History
- Keeps last 50 calibration sessions
- Click to load previous sessions
- Delete old/test sessions
- Current session marked with badge

### Import/Export
- **JSON Export**: Full session data backup
- **CSV Export**: Formatted data for Excel/Sheets
- **Print to PDF**: Professional certificates

## 🎨 Accessibility

- **Colorblind Friendly**: Red/green with ✓/✗ symbols
- **High Contrast**: WCAG 2.1 Level AA compliant
- **Keyboard Navigation**: Tab through all fields
- **Screen Reader Compatible**: Proper ARIA labels

## 🖨️ Print Features

Professional calibration certificates include:
- Certificate number and issue date
- Service provider and client information
- Environmental conditions table
- Complete measurement data tables
- As Found and As Left results
- Pass/fail status for each test point
- Traceability statements
- Technician signature line
- ISO 8655 compliance statements

## 📚 Documentation

- **[Demo Instructions](DEMO_INSTRUCTIONS.md)** - How to test features
- **[Improvements Roadmap](IMPROVEMENTS_ROADMAP.md)** - Planned enhancements
- **[Changelog](CHANGELOG.md)** - Version history

## 🛠️ Technical Details

### Technology Stack
- Pure HTML5/CSS3/JavaScript
- No frameworks or dependencies
- Single-file application (143KB)
- Client-side only (no server needed)

### Browser Compatibility
- ✅ Chrome/Edge (Modern versions)
- ✅ Firefox (Modern versions)
- ✅ Safari (Modern versions)
- ❌ IE11 (Not supported - ES6 required)

### Storage
- LocalStorage for persistence
- ~5-10MB storage limit (browser dependent)
- Stores up to 50 sessions
- Automatic cleanup of old sessions

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional pipette models/brands
- More export formats (Excel, XML)
- Multi-language support
- Backend integration for team use

## 📝 License

MIT License - Free to use and modify for your lab.

## 👨‍🔬 Credits

Developed for laboratory calibration professionals.

Based on ISO 8655 international standards for piston-operated volumetric apparatus.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the [Demo Instructions](DEMO_INSTRUCTIONS.md)
- Review the [Improvements Roadmap](IMPROVEMENTS_ROADMAP.md)

## 🔄 Version History

**v2.0** (December 2024)
- Professional calibration certificates (ISO 8655/17025 compliant)
- Enhanced print CSS for beautiful output
- Improved colorblind accessibility
- Side-by-side status badges
- Multi-channel calculation fixes

**v1.0** (November 2024)
- Initial release with auto-save
- Session history management
- Basic calibration functionality

---

**Made with 🧪 for laboratory professionals**
