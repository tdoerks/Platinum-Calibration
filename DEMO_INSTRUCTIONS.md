# Quick Demo Instructions

## How to Test the Persistent Version

### 1. Open the File
```bash
# From your browser, open:
file:///path/to/Platinum-Calibration/pipette_calibration_persistent.html

# Or if you have a local server:
cd Platinum-Calibration
python3 -m http.server 8000
# Then visit: http://localhost:8000/pipette_calibration_persistent.html
```

### 2. Test Auto-Save Feature

**Step 1**: Fill in Session Info
- Enter your name in "Technician" field
- Notice the green "Saved" indicator appears in top-right corner
- Wait 2 seconds for it to fade

**Step 2**: Add a Pipette
- Go to "Calibration" tab
- Click "+ Add Pipette" button
- Fill in some pipette details (serial number, etc.)
- Notice "Saved" indicator appears after each change

**Step 3**: Test Persistence
- **Close the browser tab completely**
- **Reopen the HTML file**
- ✅ All your data should still be there!

### 3. Test Session History

**Step 1**: Create Multiple Sessions
- Enter some data in current session
- Click "New Session" button
- Confirm to save current work
- Enter different data in new session

**Step 2**: View History
- Go to "History" tab
- You should see 2 sessions listed
- Click on the older session to load it
- Data switches back to that session

**Step 3**: Delete a Session
- In History tab, click "Delete" button on a session
- Confirm deletion
- Session is removed from history

### 4. Test Import/Export

**Step 1**: Export
- Go to "Report" tab
- Click "💾 Save Session" button
- A JSON file downloads to your computer

**Step 2**: Import
- Go to "Session Info" tab
- Click "📥 Import JSON" button
- Select the JSON file you just downloaded
- Data loads into the app

### 5. Test Measurements

**Step 1**: Add Sample Data
- Click "📊 Load Sample Data" button
- 3 pipettes load with complete measurements
- Go to "Analysis" tab to see statistics

**Step 2**: Real-time Validation
- Go back to "Calibration" tab
- Modify one of the measurement values
- Watch the status badge update (PASS/FAIL)
- See the calculations update in real-time

### Expected Behavior

✅ **Auto-Save Works** if:
- Green "Saved" indicator appears after changes
- Data persists after closing/reopening browser
- Session appears in History tab

✅ **Session Management Works** if:
- Can create new session
- Can load old sessions from history
- Can delete sessions
- Current session marked with badge

✅ **Import/Export Works** if:
- JSON file downloads successfully
- Can import the JSON back into the app
- Imported data appears correctly

### Common Issues

**"Saved" indicator doesn't appear**
- Make sure you're making actual changes to fields
- Check browser console for errors (F12)

**Data doesn't persist**
- Ensure localStorage is enabled in browser
- Check if you're in private/incognito mode (localStorage disabled)

**History is empty**
- You need to make changes for auto-save to create a session
- Try adding a pipette first

### Browser Console Checks

Open browser console (F12) and try:
```javascript
// Check if data is saved
JSON.parse(localStorage.getItem('currentSession'))

// See all sessions
JSON.parse(localStorage.getItem('calibrationSessions'))

// Clear everything (reset)
localStorage.clear()
location.reload()
```

### Quick Functionality Checklist

- [ ] Auto-save indicator appears
- [ ] Data persists after browser close/reopen
- [ ] Can create new session
- [ ] Can view session history
- [ ] Can load old sessions
- [ ] Can delete sessions
- [ ] Can export to JSON
- [ ] Can import from JSON
- [ ] Measurements validate in real-time
- [ ] Analysis tab shows correct statistics

---

**Test completed successfully?** You now have a fully functional persistent calibration system! 🎉
