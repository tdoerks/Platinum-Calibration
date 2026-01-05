# Calibrations International - Branding Guide

**Date**: January 5, 2026
**Branch**: `ui-improvements`
**Purpose**: Document branding transformation for Calibrations International integration

---

## Brand Identity

### Official Company Information
- **Company Name**: Calibrations International Inc.
- **Tagline**: "Quality Calibrations Across the Globe"
- **Location**: Bozeman, Montana 59718
- **Phone**: 1-877-CAL-INTL (877-225-4685)
- **Direct**: 406-589-6025
- **Email**: theresa@calibrationsinternational.com
- **Website**: https://www.calibrationsinternational.com/

---

## Color Palette

### Primary Colors
```css
/* CI Green - Primary Actions, Accents */
#69B135
RGB(105, 177, 53)

/* Navy Blue - Headers, Professional Elements */
#223077
RGB(34, 48, 119)

/* Dark Text */
#020202
RGB(2, 2, 2)
```

### Secondary Colors
```css
/* Hover States */
#558a2a  /* Darker green for hover */

/* Backgrounds */
#f8f9fa  /* Light gray backgrounds */
#666     /* Medium gray text */
```

---

## Application of Brand Colors

### Where CI Green (#69B135) is Used:
- Primary action buttons
- Active navigation elements
- Table headers in certificates
- Links and accents
- Print button
- Success messages
- Email addresses in footers
- Tagline text
- Border accents

### Where Navy Blue (#223077) is Used:
- Main headings (H1, company name)
- Certificate titles
- Professional text elements
- Company name in footers
- Gradient secondary color (green → navy)

### Color Combinations:
- **Gradients**: `linear-gradient(135deg, #69B135 0%, #223077 100%)`
  - Used in: Calibration type dropdown, service level boxes
- **Headers**: Navy text with green underline
- **Buttons**: Green background with white text

---

## Typography

### Font Family
- **Primary**: Arial, sans-serif
- **Fallback**: System fonts for maximum compatibility

### Usage:
- Clean, professional, readable
- Sans-serif for modern technical look
- Consistent with laboratory/calibration industry standards

---

## Visual Elements

### Header Section
```
Calibrations International Inc.
Quality Calibrations Across the Globe
Data Intake System | ISO 8655 Compliant | Bozeman, MT

Contact: 1-877-CAL-INTL | 406-589-6025
Email: theresa@calibrationsinternational.com
```

### Certificate Footer Template
```
Calibrations International, Inc.
Bozeman, Montana 59718
1-877 CAL-INTL | 406-589-6025
theresa@calibrationsinternational.com
```

---

## Changes Made

### Phase 1: Color Scheme (Commit edb8b18)
✅ Replaced ALL purple colors (#667eea, #764ba2) with CI green/navy
✅ Updated gradients throughout application
✅ Applied to buttons, headers, navigation, tables
✅ Updated dark mode colors

### Phase 2: Identity & Defaults
✅ Changed app title to "Calibrations International - Data Intake System"
✅ Updated header with company branding
✅ Set default Service Provider to "Calibrations International Inc."
✅ Cleared client-specific placeholder data

### Phase 3: Certificate Branding
✅ Balance certificates: Green tables, navy headers
✅ Enhanced footer with full contact info
✅ Professional CI color scheme
✅ Print button uses CI green

### Phase 4: Code Cleanup
✅ Removed unused balance contact fields (piName, piEmail, contactName, contactEmail)
✅ Environmental conditions already included in pipette certificates
✅ Clean data model

---

## Design Principles

### Professional
- Clean, technical aesthetic
- Laboratory/scientific credibility
- ISO compliance messaging

### Consistent
- Brand colors applied uniformly
- Typography hierarchy maintained
- Visual elements aligned with website

### Functional
- Color choices enhance usability
- Green = success/action
- Navy = authority/trust
- White space for clarity

---

## Future Integration Plans

### Website Integration Opportunities:
1. **Embed as iframe** - Direct integration into calibrationsinternational.com
2. **Standalone portal** - Client-facing data intake system
3. **Internal tool** - Technician workflow system
4. **Mobile responsive** - Touch-optimized for tablet use in field

### Additional Branding Enhancements:
- [ ] Add CI logo image file
- [ ] Custom favicon with CI branding
- [ ] Print letterhead template
- [ ] Email notification templates
- [ ] Client portal branding

---

## Technical Notes

### Color Replacement Strategy
- Used global find-replace for consistency
- All `#667eea` → `#69B135`
- All `#764ba2` → `#223077`
- Gradient formula: `linear-gradient(135deg, #69B135 0%, #223077 100%)`

### Files Modified
- `index.html` - Main application file
- All colors updated in:
  - CSS styles
  - Inline styles
  - Certificate templates
  - Dark mode overrides

### Backwards Compatibility
- Existing data structures preserved
- Session files load correctly
- Old sessions display with new branding
- No data migration required

---

## Brand Consistency Checklist

### ✅ Completed
- [x] App title and metadata
- [x] Header branding
- [x] Navigation colors
- [x] Button colors
- [x] Table headers
- [x] Gradients
- [x] Certificate styling
- [x] Footer contact info
- [x] Default values
- [x] Print elements

### 🎯 Future Enhancements
- [ ] Add logo image
- [ ] Custom favicon design
- [ ] Toast notification styling
- [ ] Loading spinner colors
- [ ] Error message styling
- [ ] Modal dialog headers

---

## Resources

- **Website**: https://www.calibrationsinternational.com/
- **Brand Colors**: Extracted from live website
- **Contact**: theresa@calibrationsinternational.com for brand questions

---

**Last Updated**: January 5, 2026
**Maintained By**: Development Team
**Status**: ✅ Brand transformation complete, ready for production
