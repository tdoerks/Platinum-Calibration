# Pipette Calibration System - Changelog

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
