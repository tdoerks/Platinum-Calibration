# Pipette Calibration System - Changelog

## Version 2.5.0 (April 2026)

### 📅 Calibration Scheduling & Due Date Tracking

Major new feature: Automatic due date calculation and scheduling dashboard!

### ✨ New Features

#### **Automatic Due Date Calculation**
- **Parse invoice frequency** - Extracts frequency code from invoice number suffix (A, SA, Q, M)
- **Calculate due dates** - Automatically adds months based on frequency:
  - `A` = Annual (12 months)
  - `SA` / `S` = Semi-Annual (6 months)
  - `Q` = Quarterly (3 months)
  - `M` = Monthly (1 month)
- **Smart status detection** - Determines if equipment is overdue, due soon, upcoming, or future
- **Color-coded badges** - Visual indicators on equipment cards (red/yellow/green/blue)

#### **Scheduling Dashboard Tab**
- **Summary Cards** showing:
  - 🔴 Overdue equipment (past due date)
  - 🟡 Due Soon (within 30 days)
  - 🟢 Upcoming (31-90 days)
  - 📋 Total equipment tracked
- **Filter Controls:**
  - Filter by status (all/overdue/due soon/upcoming)
  - Filter by client/PI with autocomplete
  - Filter by company with autocomplete
- **Sort Options:**
  - By due date (soonest first)
  - By serial number
  - By client/PI
  - By company
- **Equipment Cards** displaying:
  - Status badge with icon and label
  - Serial, brand, model, volume
  - Last calibration date
  - Next due date (color-coded)
  - Days until/overdue countdown
  - Client, company info
  - Quick link to view full history

#### **Export Functionality**
- **Export to CSV** - Download schedule in Excel-compatible format with all details
- **Export to iCal** - Import into Google Calendar, Outlook, or Apple Calendar
  - Creates calendar events for each due date
  - 7-day advance reminder for each calibration
  - Includes equipment details in event description

#### **Equipment History Enhancements**
- **Due date badges** on equipment cards showing status at a glance
- **Next due date** displayed with color coding
- **Status indicators:**
  - 🔴 Red badge: Overdue equipment
  - 🟡 Yellow badge: Due within 30 days
  - 🟢 Green badge: Due within 31-90 days
  - 🔵 Blue badge: Due beyond 90 days

### 🗄️ Database Schema Evolution

**Version 4 Schema:**
```javascript
equipment: '++id, serial, [brand+pipetteModel], firstCalibrationDate, lastCalibrationDate, nextDueDate, lastPI, lastCompany, lastLocation'
calibrations: '++id, serial, calibrationDate, workOrderNo, [serial+calibrationDate], client, location, frequency, nextDueDate'
```

**New Fields:**
- `frequency` - Calibration frequency code (A, SA, Q, M)
- `nextDueDate` - Calculated next calibration due date

### 🔧 Technical Implementation

**Due Date Functions** (lines 1617-1753)
- `parseFrequencyFromInvoice(invoiceNo)` - Regex-based frequency extraction
- `calculateDueDate(calibrationDate, frequency)` - Date math with month addition
- `getEquipmentStatus(dueDate)` - Status determination with days-until calculation

**Scheduling Functions** (lines 2805-3139)
- `loadSchedule()` - Load dashboard with summary and filters
- `updateScheduleSummary(equipment)` - Count equipment by status
- `updateScheduleFilters(equipment)` - Populate client/company dropdowns
- `filterSchedule()` - Apply filters and sort, render cards
- `clearScheduleFilters()` - Reset all filters to defaults
- `exportScheduleCSV()` - Generate and download CSV file
- `exportScheduleICal()` - Generate iCal file with VEVENT entries

**Equipment History Integration** (lines 3184-3222)
- Status badge display in card header
- Color-coded next due date
- Badge colors match status (red/yellow/green)

### 🎯 Use Cases Enabled

- **Track calibration schedules** - Never miss a due date
- **Prioritize workload** - See overdue and due soon equipment at a glance
- **Plan ahead** - View upcoming calibrations 90 days out
- **Client scheduling** - Filter by client to plan visits
- **Calendar integration** - Export to your calendar app for reminders
- **Compliance tracking** - Ensure all equipment stays current
- **Workload forecasting** - See calibration volume by month

### 📊 Example Workflow

1. **Import legacy work order** with invoice `TSD3112251A`
2. **System automatically:**
   - Parses `A` frequency (Annual)
   - Calculates due date: 12/31/2025 + 12 months = 12/31/2026
   - Saves to database
3. **Scheduling tab shows:**
   - Equipment in "Upcoming" section (>90 days away)
   - Status badge: 🟢 Due in 245 days
4. **Export to calendar** for automatic reminders
5. **30 days before due date:**
   - Equipment moves to "Due Soon" section
   - Badge changes to: 🟡 Due in 28 days
6. **After due date passes:**
   - Equipment moves to "Overdue" section
   - Badge changes to: 🔴 5 days overdue

### 🚀 What's Next

**Planned for Version 2.6:**
- Legacy import for Balance, Timer, Centrifuge, Temperature equipment
- Multi-equipment type scheduling
- Email notifications for upcoming calibrations (requires backend)
- Calendar view with month grid
- Frequency analysis and reporting

## Version 2.4.0 (April 2026)

### 📚 Equipment History Database - Legacy Document Import

Major new feature: Import legacy calibration work orders (Word documents) directly into equipment history database!

### ✨ New Features

#### **Word Document Parser for Legacy Imports**
- **Auto-detects Serial Number column** in calibration tables
- **Handles Mammoth.js quirks** - Works with both `<td>` and `<th>` HTML table cells
- **Extracts client information** - PI name, company, location, phone from work order headers
- **Uses actual service dates** - Reads dates from work orders, not upload timestamps
- **Smart P/F detection** - Always reads last column for Pass/Fail status

#### **Client Information Tracking**
- Equipment records now track last PI name, company, location, and phone
- Client data extracted automatically from Word document headers
- Equipment cards display client info for easy reference
- Database schema Version 3 adds: `lastPI`, `lastCompany`, `lastLocation`, `lastPhone`

#### **Enhanced Search Functionality**
- **Search by client** - Find equipment by PI name, company, or location
- **Search by date** - Search calibration dates (e.g., "12/31/2025", "2025", "December")
- **Autocomplete suggestions** - Dropdown shows all known companies, PIs, locations, brands, models
- **Smart filtering** - Search works across all relevant fields simultaneously

#### **Professional Data Management**
- **Delete with audit trail** - Deleted records preserved with reason and timestamp
- **Bulk delete** - Select multiple equipment records with checkboxes
- **Soft delete pattern** - Data archived to `deletedEquipment` and `deletedCalibrations` tables
- **Required deletion reason** - Must provide justification before deleting

### 🔧 Bug Fixes

**Company/Location Extraction**
- **Issue:** Company and location fields captured entire header text including "Date of Service", "Balance Information", etc.
- **Fix:** Updated regex to capture only first line after label, reject known junk patterns
- **Result:** Empty fields now properly show "N/A" instead of header text

**P/F Column Index**
- **Issue:** Parser tried to read `cells[18]` when only 18 cells exist (0-17)
- **Fix:** Changed to `cells[cells.length - 1]` to always get last cell
- **Result:** No more array index errors on P/F column

**Serial Number Overwrite**
- **Issue:** Line 2126 overwrote extracted serial numbers with pipette numbers (01, 02, 03, 04)
- **Fix:** Changed to `serial: pipetteData.serial || pipetteData.number || ...`
- **Result:** Actual serial numbers (C202358375, F03069, etc.) now preserved

**Calibration Dates Wrong**
- **Issue:** Equipment showing upload date (4/21/2026) instead of service date (12/31/2025)
- **Fix:** Use `sessionInfo.calDate || sessionInfo.serviceDate` instead of `new Date()`
- **Result:** Calibration dates match work order service dates

**Equipment Card Layout**
- **Issue:** Cards appeared nested/weird due to missing closing `</div>` tag
- **Fix:** Added missing closing tag at line 2650
- **Result:** Each equipment record has clean, individual card layout

### 🗄️ Database Schema Evolution

**Version 3 Schema:**
```javascript
equipment: '++id, serial, [brand+pipetteModel], firstCalibrationDate, lastCalibrationDate, lastPI, lastCompany, lastLocation'
calibrations: '++id, serial, calibrationDate, workOrderNo, [serial+calibrationDate], client, location'
deletedEquipment: '++id, serial, deletedDate, deletedReason'
deletedCalibrations: '++id, serial, deletedDate, deletedReason'
```

### 🎯 Use Cases Enabled

- **Import legacy archives** - Upload old Word work orders to build equipment history
- **Track client equipment** - See which pipettes belong to which labs/institutions
- **Search by institution** - "Kansas State University" finds all their equipment
- **Search by PI** - "Doerksen" finds equipment calibrated for that researcher
- **Audit trail** - Know who deleted what and why
- **Bulk operations** - Delete multiple test records at once

### 📝 Technical Changes

**Word Document Parser** (`extractCalibrationDataFromHtml`)
- Lines 1895-1900: Added `<th>` cell fallback when `<td>` cells not found
- Lines 1912-1935: Client info extraction (phone, company, location)
- Line 1987: Fixed P/F column to use `cells.length - 1`
- Lines 2127-2134: Fixed serial/model/volume field mapping

**Equipment History Functions**
- Lines 1615-1654: Updated to save client info to database
- Lines 2275-2319: Added `updateEquipmentSuggestions()` for autocomplete
- Lines 2638-2651: Equipment cards now display client info
- Lines 1690-1715: Search function includes PI, company, location, phone, dates

**Deletion Features**
- Lines 2268-2375: `showDeleteEquipmentConfirmation()` with required reason
- Lines 2422-2584: Bulk delete with checkbox selection

### 🚀 What's Next

**Planned Features:**
- Legacy import for Balance, Timer, Centrifuge, Temperature calibrations
- Scheduling tab showing equipment coming due for calibration
- Due date calculation from invoice suffix (A=Annual, M=Monthly, etc.)
- Calendar view for calibration scheduling

## Version 2.3.5 (January 2026)

### 🏗️ Major Architectural Change
- **Separated Platinum and Basic into distinct sections** - Platinum and Basic now work exactly like Balance/Timer/Centrifuge with completely separate containers
- **Eliminated filter conflicts** - No more competing filter systems causing display issues
- **Guaranteed reliable switching** - Show/hide sections just like other calibration types (Balance, Timer, etc.)

### ✨ What's Changed
- **Two separate HTML sections:**
  - `platinumPipetteSection` with `platinumPipettesContainer`
  - `basicPipetteSection` with `basicPipettesContainer`
- **Simplified switching logic:**
  - `switchCalibrationType()` now just shows/hides sections (no filtering needed)
  - No more calls to `handleServiceLevelChange()` or `renderAllPipettes(serviceLevel)`
- **Independent search/filter bars:**
  - Each section has its own search and filter controls
  - Platinum: `searchPipettesPlatinum`, `filterStatusPlatinum`
  - Basic: `searchPipettesBasic`, `filterStatusBasic`
- **Automatic routing:**
  - `renderPipette()` automatically routes each pipette to correct container
  - `renderAllPipettes()` renders all pipettes to both containers
  - `addPipette()` creates pipettes with correct service level

### 🔧 Technical Changes
- Duplicated pipette section HTML (lines 9178-9280)
- Removed service level filtering from `renderAllPipettes()` (line 4095)
- Updated `filterPipettes(section)` to accept section parameter (line 4633)
- Updated `clearFilters(section)` to work with separate sections (line 4686)
- Simplified `updateServiceLevelStatus()` to stub (no longer needed)
- Updated all `pipettesContainer` references to use section-specific containers
- Updated `renderPlatinumPipette()` → `platinumPipettesContainer` (line 4168)
- Updated `renderBasicPipette()` → `basicPipettesContainer` (line 4410)

### 🎯 Benefits
- ✅ Simple, reliable switching (same as Balance/Timer)
- ✅ No DOM timing issues
- ✅ No filter conflicts
- ✅ Each section completely independent
- ✅ Easier to maintain and debug

## Version 2.3.4 (January 2026)

### 🔧 Bug Fixes
- **Fixed service level switching DOM timing issue** - Modified `renderAllPipettes()` to accept service level as parameter instead of reading from DOM
- **Improved reliability** - Eliminates race condition where pipettes might not filter immediately when switching service levels

**What's Fixed:**
- **Issue:** Service level switching still had timing problems where `renderAllPipettes()` would read the hidden field value before it was updated
- **Root Cause:** DOM updates aren't always synchronous, causing `renderAllPipettes()` to sometimes read the old value
- **Fix:** Pass service level directly as parameter to `renderAllPipettes(newLevel)` from `handleServiceLevelChange()`, avoiding DOM dependency
- **Result:** Immediate, reliable filtering when switching between Platinum and Basic

**Technical Changes:**
- Modified `renderAllPipettes()` signature to accept optional `serviceLevel` parameter (line 4098)
- Uses parameter if provided, otherwise reads from DOM (line 4103)
- Updated `handleServiceLevelChange()` to call `renderAllPipettes(newLevel)` (line 3545)
- All other callers unchanged (they don't pass parameter, so DOM read still works)

## Version 2.3.3 (January 2026)

### ✨ New Features
- **Added Adjustments Made section to Platinum calibration** - Platinum pipettes now have same adjustment tracking as Basic (Seal, Corrosion, Grease, Shaft, Friction Ring, O-Ring, Other)
- **Inventory auto-detection now includes Platinum pipettes** - Auto-detect button in Inventory tab now tracks parts used from both Platinum and Basic calibrations

### 🔧 Bug Fixes
- **Fixed service level switching not working consistently** - Removed conditional checks that prevented re-rendering when switching between Platinum and Basic calibration types
- **Improved UX** - Switching between service levels now ALWAYS updates the display immediately, even when clicking the same service level twice

**What's Fixed:**
- **Issue 1 (Switching):** When on Platinum and selecting Platinum again from dropdown, pipettes wouldn't update. Now always calls `handleServiceLevelChange()` to ensure display updates.
- **Issue 2 (Adjustments):** Platinum pipettes had no way to track adjustments (seals, shafts, etc.). Now have identical adjustment fields as Basic.
- **Issue 3 (Inventory):** Inventory auto-detection only worked for Basic pipettes. Now works for both Platinum and Basic.

**Technical Changes:**
- Removed `value !== 'platinum'` and `value !== 'basic'` conditional checks in `switchCalibrationType()` (lines 3870, 3879)
- Added full adjustments section to `renderPlatinumPipette()` function (lines 4272-4329)
- Updated `autoDetectInventory()` to filter for both service levels (line 8273)
- Updated error message to be service-level agnostic (line 8301)

## Version 2.3.2 (January 2026)

### 🔧 Bug Fixes
- **Fixed service level display not updating on calibration type switch** - Pipettes now immediately re-render when switching between Platinum and Basic calibration types
- **Improved UX** - No longer need to add a pipette to trigger display update after switching service levels

**What's Fixed:**
- **Issue:** When switching from Platinum to Basic (or vice versa) using the calibration type dropdown, pipettes stayed on the previous service level display until adding a new pipette
- **Fix:** Added explicit `renderAllPipettes()` call at end of `switchCalibrationType()` function (line 3896)
- **Result:** Display immediately updates to show only matching service level pipettes when switching

## Version 2.3.1 (January 2026)

### 🔧 Bug Fixes
- **Fixed service level filtering on page load** - Loaded sessions now correctly filter pipettes by service level
- **Fixed environmental section always visible** - Environmental conditions (temperature, humidity, pressure, balance info) now remain visible for all calibration types

**What's Fixed:**
- **Issue:** When loading a saved session with mixed Platinum/Basic pipettes, ALL pipettes displayed regardless of selected service level
- **Fix:** Added `renderAllPipettes()` call after `loadCurrentSession()` to apply filtering (line 8899)
- **Issue:** Environmental section disappeared when switching to Basic calibration
- **Fix:** Removed all show/hide logic for environmental section (lines 3522-3547, 8935)
- **Result:** Environmental data always visible, filtering works on page load

## Version 2.3.0 (January 2026)

### 🔀 Separate Platinum and Basic Pipette Views
- **Fixed Platinum/Basic mixing** - Platinum and Basic pipettes now display on separate screens
- **Service level filtering** - Switching between Platinum and Basic shows only matching pipettes
- **Smart status bar** - Shows count of visible/hidden pipettes with quick switch link
- **Improved UX** - Clear separation between Platinum (full gravimetric) and Basic (quick pass/fail) workflows

**How it works:**
- Select "Platinum" service level → See only Platinum pipettes
- Select "Basic" service level → See only Basic pipettes
- Status bar shows: "Viewing 🏆 Platinum Pipettes: Showing 3 Platinum pipette(s). 2 Basic pipette(s) hidden. Switch to Basic"
- All pipettes saved together (easier session management)
- Click underlined "Switch to Basic/Platinum" link to toggle views

**Technical Changes:**
- Added `renderAllPipettes()` function to filter pipettes by service level
- Added `updateServiceLevelStatus()` to show visible/hidden counts
- Modified `handleServiceLevelChange()` to re-render filtered pipettes
- Updated `addPipette()`, `removePipette()`, `loadCurrentSession()`, `loadSessionFromHistory()` to use filtered rendering

## Version 2.2.2 (January 2026)

### 🔧 Bug Fix: Session Deletion
- **Fixed session deletion not clearing UI** - Deleting current session now properly clears all pipettes, session info, and manifest display
- **Fixed manifest showing old data** - Equipment manifest now updates correctly when session is deleted
- **Improved UX** - Deleting current session now gives you a clean slate, just like "New Session"

**What's Fixed:**
- When you delete the currently active session, it now:
  - Clears all in-memory data (pipettes, balances, timers, etc.)
  - Clears all UI containers (no more ghost pipettes)
  - Clears session form fields (technician, location, client, etc.)
  - Updates progress, analysis, and manifest displays
  - Shows "Session deleted. Starting fresh with new session." message

## Version 2.2.1 (January 2026)

### 🔧 Bug Fixes & UI Improvements
- **Removed empty state display** - Disabled "Add Your First Pipette" box that wasn't updating properly
- **Fixed Platinum/Basic data mixing** - Added "platinum" prefix to all localStorage keys to prevent data conflicts between Platinum and Basic calibration systems
- **Separated localStorage** - Platinum and Basic calibration data now completely isolated

**Important:** This update will clear existing Platinum session data (fresh start). Basic calibration data is unaffected.

**localStorage Keys Updated:**
- `currentSession` → `platinumCurrentSession`
- `calibrationSessions` → `platinumCalibrationSessions`
- `recentValues` → `platinumRecentValues`
- `lastBackupDate` → `platinumLastBackupDate`
- `backupReminderDismissedUntil` → `platinumBackupReminderDismissedUntil`
- `darkMode` → `platinumDarkMode`
- `pipetteTemplates` → `platinumPipetteTemplates`

## Version 2.2 (January 2026)

### 🏷️ Brand & Model Autocomplete
- **Combined Brand & Model field** - Merged separate Brand and Model fields into single "Brand & Model" input
- **Pre-loaded common brands** - 100+ pipette brands/models available in autocomplete dropdown
- **Smart history** - Automatically saves custom brand entries to localStorage (keeps last 10)
- **Type to filter** - Quick search through 100+ options as you type
- **Includes brands**: Eppendorf, Gilson, Rainin, Finnpipette, VWR, Thermo Fisher, and many more
- **Cleaner UI** - Reduced form clutter by removing redundant Model field

## Version 2.1 (December 2024) - Persistent Version

## Overview
This is an enhanced version of the Pipette Calibration System with **automatic browser persistence** using localStorage. All your work is automatically saved as you type!

## New Features

### 🔄 Auto-Save
- **Automatic saving** every 500ms after changes
- Visual "Saved" indicator appears after each save
- No more lost data from accidental browser closes
- All pipette data, measurements, and session info automatically persisted

### 💾 Session Management
- **Current session** automatically loads when you open the page
- Create **new sessions** to start fresh calibrations
- All sessions saved to browser history (keeps last 50)
- Switch between sessions anytime

### 📚 History Tab
- View all your past calibration sessions
- Click any session to load and continue working
- See session summaries (date, technician, pipette counts)
- Delete old sessions you no longer need
- Current session is marked with a badge

### 📥 Import/Export
- **Export to JSON**: Original "Save Session" button downloads JSON file
- **Import from JSON**: New button to load sessions from files
- Share sessions between browsers or devices
- Backup important calibrations to files

## How to Use

### Getting Started
1. Open `pipette_calibration_persistent.html` in your browser
2. Your last session will automatically load
3. Start entering data - it saves automatically!

### Creating a New Session
1. Click "🆕 New Session" button on Session Info tab
2. Confirm to save current work to history
3. Start fresh with empty form

### Viewing History
1. Go to the "📚 History" tab
2. See all past sessions with summaries
3. Click any session to load it
4. Click "Delete" to remove unwanted sessions

### Import/Export
- **To Export**: Click "💾 Save Session" in Report tab (downloads JSON)
- **To Import**: Click "📥 Import JSON" in Session Info tab

## Data Storage

### Where Data is Saved
- All data stored in **browser localStorage**
- Persists across browser sessions
- Separate per browser (Chrome data ≠ Firefox data)

### Storage Limits
- Keeps last **50 sessions** in history
- Older sessions automatically removed
- Current session always preserved

### Clearing Data
To start completely fresh:
```javascript
// In browser console:
localStorage.clear()
// Then refresh page
```

## Compatibility

### Browser Support
- ✅ Chrome/Edge (Modern versions)
- ✅ Firefox (Modern versions)
- ✅ Safari (Modern versions)
- ❌ IE11 (localStorage works but ES6 features not supported)

### Mobile Browsers
- Fully responsive design
- Works on tablets and phones
- Touch-friendly interface

## Technical Details

### Auto-Save Triggers
Data saves automatically when you:
- Add or remove pipettes
- Enter measurements
- Change pipette information
- Update session info (technician, location, etc.)
- Modify any form field

### Session Structure
```json
{
  "id": "session_<timestamp>_<random>",
  "timestamp": "2024-11-24T08:00:00.000Z",
  "lastModified": "2024-11-24T08:30:00.000Z",
  "sessionInfo": {
    "serviceProvider": "...",
    "technician": "...",
    ...
  },
  "pipettes": [...],
  "currentPipetteId": 3
}
```

## Differences from Original

| Feature | Original | Persistent Version |
|---------|----------|-------------------|
| Save method | Manual download only | Auto-save + manual |
| Data persistence | None (lost on refresh) | localStorage |
| Session history | Empty placeholder | Full history UI |
| Load sessions | Manual file import only | Click to load from history |
| Visual feedback | None | Save indicator |
| Session management | No concept | Full session lifecycle |

## Tips & Best Practices

### Daily Use
1. **Let it auto-save** - Don't worry about saving manually
2. **Use New Session** - Start each day with a fresh session
3. **Export important sessions** - Download JSON backups of critical data
4. **Clean up history** - Delete test/practice sessions to keep history clean

### Collaboration
- **Share via JSON files**: Export and email to colleagues
- **Same device only**: Browser localStorage doesn't sync across devices
- **Consider backend version**: For team use, see full-stack version (coming soon)

### Troubleshooting

**Data not saving?**
- Check browser console for errors
- Ensure localStorage is enabled
- Try clearing browser cache

**Session not loading?**
- Check History tab for available sessions
- Try refreshing the page
- Clear localStorage and start fresh if corrupted

**Save indicator not showing?**
- It appears for 2 seconds after changes
- Make a change to any field to test

## Future Enhancements
- [ ] Export to Excel format
- [ ] PDF generation with certificate
- [ ] Backend sync for multi-device access
- [ ] User authentication
- [ ] Team collaboration features
- [ ] Email notifications for calibration due dates

## Files
- `pipette_calibration_persistent.html` - Main application file (all-in-one)
- `original_with_minimal_fixv13.html` - Original version (no persistence)
- Other `*.html` - Earlier versions

## Support
For issues or questions, refer to the original repository documentation.

---

**Version**: 1.0 Persistent
**Date**: November 2024
**Based on**: original_with_minimal_fixv13.html
