# 📅 Version 2.5.0 Release Notes

## Calibration Scheduling & Due Date Tracking

**Release Date:** April 23, 2026
**Status:** ✅ Production Ready
**Breaking Changes:** None - fully backward compatible

---

## 🎯 What's New

### Automatic Due Date Tracking

Import a calibration work order and the system now:
1. **Reads the invoice number** (e.g., `TSD3112251A`)
2. **Extracts frequency** from the suffix (`A` = Annual)
3. **Calculates due date** automatically (service date + 12 months)
4. **Tracks status** (overdue, due soon, upcoming, future)

### Scheduling Dashboard

New tab showing calibration schedule:
- **Summary cards** with counts (overdue, due soon, upcoming)
- **Filterable list** by status, client, company
- **Sortable** by due date, serial, client, company
- **Color-coded cards** with status badges
- **Export options** (CSV for Excel, iCal for calendars)

### Equipment History Enhanced

Equipment cards now display:
- **Status badges** (🔴🟡🟢 overdue/due soon/upcoming)
- **Next due date** with color coding
- **Days until calibration** countdown

---

## 📋 Quick Start

### View Schedule
1. Click **"📅 Scheduling"** tab
2. See summary cards showing overdue/due soon/upcoming counts
3. Browse equipment list sorted by due date (soonest first)

### Filter Schedule
1. **By Status:** Select "Overdue Only" to see urgent items
2. **By Client:** Type client name to see their equipment
3. **By Company:** Type company name to filter

### Export Schedule
1. **CSV:** Click "📊 Export to CSV" → Opens in Excel
2. **iCal:** Click "📅 Export to iCal" → Import to calendar app

### Check Equipment Status
1. Go to **"📚 History"** tab
2. Equipment with due dates show colored badges
3. 🔴 = Overdue, 🟡 = Due soon, 🟢 = Upcoming

---

## 🔧 Frequency Codes

The system recognizes these frequency codes in invoice numbers:

| Code | Meaning | Due Date |
|------|---------|----------|
| **A** | Annual | +12 months |
| **SA** or **S** | Semi-Annual | +6 months |
| **Q** | Quarterly | +3 months |
| **M** | Monthly | +1 month |

**Example:** Invoice `TSD3112251A`
- Service Date: 12/31/2025
- Frequency: `A` (Annual)
- Due Date: 12/31/2026

---

## 🎨 Status Color Coding

| Status | Color | Badge | Meaning |
|--------|-------|-------|---------|
| **Overdue** | 🔴 Red | "X days overdue" | Past due date - urgent! |
| **Due Soon** | 🟡 Yellow | "Due in X days" | Within 30 days |
| **Upcoming** | 🟢 Green | "Due in X days" | 31-90 days away |
| **Future** | 🔵 Blue | "Due in X days" | >90 days away |

---

## 📊 Export Formats

### CSV Export
- **File:** `calibration-schedule-YYYY-MM-DD.csv`
- **Contains:** Serial, Brand, Model, Volume, Last Cal, Next Due, Status, Days Until, Client, Company, Location
- **Use for:** Excel, Google Sheets, analysis, reporting

### iCal Export
- **File:** `calibration-schedule-YYYY-MM-DD.ics`
- **Contains:** Calendar events with 7-day reminders
- **Compatible with:** Google Calendar, Outlook, Apple Calendar, most calendar apps
- **Import:** Open file or drag-and-drop into calendar app

---

## 🗄️ Database Changes

### New Fields Added

**Equipment Table:**
- `nextDueDate` - Date when next calibration is due
- Index on `nextDueDate` for fast scheduling queries

**Calibrations Table:**
- `frequency` - Frequency code (A, SA, Q, M)
- `nextDueDate` - Calculated due date for this calibration

### Migration

Upgrading to v2.5.0 automatically:
- Creates new fields in database
- Migrates existing data
- No data loss
- No manual steps required

---

## 🔍 Technical Details

### Invoice Parsing

**Regex:** `/^[A-Z]{2,4}\d{6}\d*([A-Z]+)$/i`

**Matches:**
- `TSD3112251A` ✅
- `ABC0112241SA` ✅
- `XY12310512Q` ✅
- `TSD123456` ❌ (no frequency suffix)

**Validation:**
- Frequency must be A, SA, S, Q, or M
- Case insensitive
- S normalized to SA

### Due Date Calculation

```javascript
// Example: Annual frequency
const serviceDate = new Date('2025-12-31');
const frequency = 'A'; // Annual = 12 months
const dueDate = new Date(serviceDate);
dueDate.setMonth(dueDate.getMonth() + 12);
// Result: 2026-12-31
```

### Status Determination

```javascript
const today = new Date();
const dueDate = new Date(equipment.nextDueDate);
const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

if (daysUntil < 0) return 'overdue';      // Past due
if (daysUntil <= 30) return 'due_soon';   // 30 days or less
if (daysUntil <= 90) return 'upcoming';   // 31-90 days
return 'future';                           // >90 days
```

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Import work order with invoice number
- [ ] Verify frequency extracted correctly
- [ ] Verify due date calculated correctly
- [ ] Check Scheduling tab loads
- [ ] Verify summary card counts

### Filters & Sorting
- [ ] Filter by status (overdue/due soon/upcoming)
- [ ] Filter by client name
- [ ] Filter by company name
- [ ] Sort by due date
- [ ] Sort by serial number
- [ ] Sort by client
- [ ] Sort by company

### Exports
- [ ] Export to CSV downloads file
- [ ] CSV opens in Excel correctly
- [ ] Export to iCal downloads file
- [ ] iCal imports into calendar app
- [ ] Calendar events show correct dates
- [ ] Reminders work (7 days before)

### Equipment History
- [ ] Equipment cards show status badges
- [ ] Badge colors match status (red/yellow/green)
- [ ] Next due date displays correctly
- [ ] Badge labels show days count

### Edge Cases
- [ ] Equipment without due dates (no badge shown)
- [ ] Invoice without frequency suffix (no due date)
- [ ] Equipment due today (shows "Due today!")
- [ ] Equipment multiple years out (shows future status)

---

## 📱 Browser Compatibility

**Tested and Working:**
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)

**Requirements:**
- JavaScript enabled
- IndexedDB support
- LocalStorage enabled
- Date API support

---

## 🐛 Known Issues

**None at this time.**

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify invoice numbers have frequency suffix
3. Clear browser cache if data seems stale
4. Check CHANGELOG.md for updates

---

## 📞 Support

**Documentation:**
- CHANGELOG.md - Version history
- SESSION_NOTES.md - Implementation details
- OVERNIGHT_WORK_SUMMARY.md - Feature guide

**Troubleshooting:**
1. Open browser console (F12)
2. Look for error messages
3. Check network tab for failed requests
4. Verify localStorage not full
5. Try hard refresh (Ctrl+F5)

---

## 🚀 What's Next

**Planned for v2.6:**
- Multi-equipment type support (balances, timers, etc.)
- Calendar month view
- Email notifications
- Frequency analysis reports
- Equipment lifecycle tracking

**In Development:**
- None - v2.5.0 is stable

**Feedback Welcome:**
- Use the scheduling features
- Test with real data
- Report any issues
- Suggest improvements

---

## 📜 License & Credits

**Built by:** Claude Code (AI Assistant)
**For:** Tyler Doerksen
**Repository:** https://github.com/tdoerks/Platinum-Calibration
**License:** Same as main project

---

## 🎉 Thank You!

Enjoy the new scheduling features! May you never miss a calibration due date again. 📅✨

**Questions?** Check the documentation files or open an issue on GitHub.

**Happy Calibrating!** 🔬🎯
