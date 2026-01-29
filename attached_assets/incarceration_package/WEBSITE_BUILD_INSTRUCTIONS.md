# U.S. Incarceration Research Website - Build Instructions

**Edited by: Robert McCoy**

## Project Overview
This website presents comprehensive research on United States incarceration institutions, focusing on the "down and dirty" realities of incarcerated life. The site houses research documents and presents findings across four major sections.

---

## Content Structure

### Four Main Sections:

#### 1. Economics of Incarceration
- National and state-level prison costs
- Cost per prisoner (federal average: $29,291/year)
- Revenue generation from prison labor
- Individual economics: food, medical, operational costs
- Demographics of U.S. prison population
- Racial disparities (44.3% Black prisoners vs 13% general population)

#### 2. Life in Prison: Prisoners and Guards
- Daily life patterns of incarcerated individuals
- Gang affiliation and dynamics (less than 10% control population)
- Prisoner-guard interactions and statistics
- Violence statistics (28 assaults per 1,000 inmates)
- Employment structure in correctional facilities
- Staff challenges and turnover rates

#### 3. Education, Age, and Entry Dynamics
- Educational levels of prison population (65% numeracy, 48% reading at/below 11-year-old level)
- Age at incarceration entry (average: 31.8 years)
- Pathways to incarceration
- Entry dynamics into federal, state, and local facilities

#### 4. Prisoner Voice, Rights, and Mental Health
- Constitutional rights of incarcerated individuals
- Prisoner advocacy and representation
- Respect and dignity issues
- Mental health crisis (16% have disorders, 66-76% receive NO treatment)
- Top needs and wishes of incarcerated individuals
- Grievance systems and retaliation statistics

---

## Website Technical Requirements

### Technology Stack Recommendations:
- **Frontend**: HTML5, CSS3, JavaScript (React or Vue.js optional)
- **Styling**: Tailwind CSS or Bootstrap for responsive design
- **Hosting**: Replit (as specified)
- **Document Display**: PDF.js or embedded viewers for documents

### Design Principles:
1. **Accessibility**: WCAG 2.1 AA compliant
2. **Responsive**: Mobile-first design
3. **Navigation**: Clear section-based navigation
4. **Readability**: High contrast, readable fonts (16px minimum)
5. **Professional**: Academic/research-focused aesthetic

---

## File Structure for Website

```
/website-root
├── index.html                          # Homepage with overview
├── /assets
│   ├── /css
│   │   └── styles.css                  # Main stylesheet
│   ├── /js
│   │   └── main.js                     # Interactive features
│   └── /images
│       └── (any relevant images)
├── /sections
│   ├── economics.html                  # Section 1
│   ├── prison-life.html               # Section 2
│   ├── education-entry.html           # Section 3
│   └── rights-mental-health.html      # Section 4
├── /documents
│   ├── US_Incarceration_Comprehensive_Report.docx
│   ├── US_Incarceration_Comprehensive_Report.pdf
│   └── (research paper tables if needed)
├── /data
│   └── (JSON files with key statistics for interactive charts)
└── about.html                          # About Robert McCoy / project info
```

---

## Content Guidelines

### Homepage Content:
- **Hero Section**: "Understanding U.S. Incarceration: The Down and Dirty Reality"
- **Editor Credit**: "Edited by Robert McCoy"
- **Overview**: Brief introduction to the four sections
- **Key Statistics Highlights**: Pull dramatic statistics from each section
- **Call to Action**: Links to download full report and explore sections

### Section Pages Should Include:
1. **Executive Summary**: TL;DR of the section
2. **Key Findings**: Bullet points with statistics
3. **Detailed Analysis**: Full content from report
4. **Data Visualizations**: Charts/graphs where applicable
5. **Sources**: APA7 citations (40+ scholarly sources)
6. **Download Options**: PDF/Word versions

### Interactive Elements:
- **Statistics Dashboard**: Key numbers with visual emphasis
- **Comparison Tables**: State-by-state comparisons
- **Timeline**: Historical context of mass incarceration
- **Infographics**: Visual representation of complex data
- **Search Function**: Find specific topics across all sections

---

## Data Highlights for Visualization

### Economics Section:
- Total national prison spending: $39 billion
- Cost per federal prisoner: $29,291/year
- Elderly prisoner costs: 2-4x higher
- Prison population growth: 790% (1980-2013)

### Demographics:
- Black prisoners: 44.3% (vs 13% general population)
- Hispanic prisoners: 23% (vs 16% general population)
- White prisoners: 32.2% (vs 64% general population)

### Life in Prison:
- Gang control: <10% of population
- Assault rate: 28 per 1,000 inmates
- Retaliation after grievances: 70.1%

### Education:
- Numeracy at/below 11-year-old level: 65%
- Reading at/below 11-year-old level: 48%
- Average age at admission: 31.8 years

### Mental Health:
- Prisoners with mental disorders: 16%
- Receiving NO treatment: 66-76%

---

## Design Recommendations

### Color Scheme:
- **Primary**: Deep navy or charcoal (authority, seriousness)
- **Accent**: Burnt orange or gold (attention, urgency)
- **Background**: Off-white or light gray
- **Text**: Dark gray on light backgrounds
- **Data Highlights**: Bold accent colors for statistics

### Typography:
- **Headers**: Bold, sans-serif (e.g., Montserrat, Roboto)
- **Body**: Readable serif or sans-serif (e.g., Georgia, Open Sans)
- **Statistics**: Large, bold numbers with context

### Layout:
- **Grid System**: 12-column responsive grid
- **Whitespace**: Generous spacing for readability
- **Cards**: Section previews on homepage
- **Sticky Navigation**: Easy access to all sections

---

## Implementation Steps

### Phase 1: Setup (Replit)
1. Create new Replit project (HTML/CSS/JS)
2. Set up file structure as outlined above
3. Import all document files
4. Configure hosting settings

### Phase 2: Content Integration
1. Convert report sections to HTML
2. Maintain APA7 citation format
3. Add Robert McCoy attribution throughout
4. Create downloadable document links

### Phase 3: Design & Development
1. Implement responsive layout
2. Add navigation menu
3. Create section pages
4. Build interactive elements

### Phase 4: Data Visualization
1. Extract key statistics to JSON
2. Create charts using Chart.js or D3.js
3. Add interactive dashboards
4. Implement comparison tools

### Phase 5: Testing & Launch
1. Cross-browser testing
2. Mobile responsiveness check
3. Accessibility audit
4. Performance optimization
5. Deploy on Replit

---

## Key Messages to Emphasize

1. **Scale of Crisis**: 790% prison population growth since 1980
2. **Economic Burden**: $39 billion annually, $29,291 per prisoner
3. **Racial Injustice**: Massive disparities in incarceration rates
4. **Educational Failure**: 65% numeracy deficits
5. **Mental Health Crisis**: 16% have disorders, 66-76% untreated
6. **Violence**: 28 assaults per 1,000 inmates
7. **Human Cost**: Focus on lived experiences and dignity

---

## Attribution & Credits

**Editor**: Robert McCoy

**Research Sources**: 728+ unique scholarly papers from:
- Academic journals
- Government reports
- Peer-reviewed studies
- Official statistics (BJS, DOJ, etc.)

**Focus**: Exclusively United States correctional institutions (federal, state, county jails, lockups)

---

## Additional Resources Included

1. **Full Report**: US_Incarceration_Comprehensive_Report.docx (12,000+ words)
2. **Research Database**: Combined paper tables with 728 sources
3. **Citations**: 40+ primary sources in APA7 format
4. **Summary Document**: REPORT_SUMMARY.md

---

## SEO & Metadata

**Title**: Understanding U.S. Incarceration | Research by Robert McCoy

**Description**: Comprehensive research on United States prison economics, life behind bars, education levels, prisoner rights, and mental health. Evidence-based analysis of the realities of incarcerated life.

**Keywords**: U.S. incarceration, prison economics, prisoner rights, mental health in prisons, gang dynamics, correctional facilities, mass incarceration, prison demographics, United States prisons

---

## Accessibility Considerations

1. **Alt Text**: All images and data visualizations
2. **Keyboard Navigation**: Full site navigable without mouse
3. **Screen Reader**: Proper heading hierarchy and ARIA labels
4. **Color Contrast**: WCAG AA minimum (4.5:1)
5. **Font Size**: Adjustable, minimum 16px
6. **Captions**: For any video/audio content

---

## Contact & Updates

For questions or updates to the research, include contact information for Robert McCoy or the project maintainer.

**Note**: This is living research. As new studies emerge and policies change, the website should be updated to reflect current realities of U.S. incarceration.

---

## Final Notes

This website aims to present the unvarnished truth about incarceration in the United States. The research is extensive, the statistics are sobering, and the human stories are essential. Present this information with the gravity and respect it deserves.

**Mission**: To educate the public about the realities of the U.S. prison system through evidence-based research and to amplify the voices of those directly impacted by incarceration.
