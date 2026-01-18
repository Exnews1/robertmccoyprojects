# CMGF Demo Site Enhancement Prompt

Copy and paste this prompt into the cmgfdemo.robertmccoyprojects.com Replit Agent to implement improvements that align with the portfolio site.

---

## PROMPT START

I need you to enhance the CMGF Demo platform with several improvements that align with my portfolio site at robertmccoyprojects.com. Here are the changes needed:

### 1. MOS-to-Career Translator Enhancements

The MOS translator should show:
- **Skill alignment percentages** (not predictions) - these are based on O*NET skill overlap, not predictive outcomes
- **Salary ranges** from BLS OEWS data with entry/median/senior levels
- **Job outlook** (Bright/Average/Below Average) with growth rate percentages
- **Additional training requirements** for each career match
- **Transferable skills** extracted from military training

Add these MOS codes if not already present:
- Army: 11B (Infantryman), 15T (Blackhawk Repairer), 68W (Combat Medic), 25B (IT Specialist), 35F (Intel Analyst), 74D (CBRN Specialist)
- Navy: HM (Hospital Corpsman), IT (Information Systems Technician), MA (Master-at-Arms)
- Air Force: 3D0X2 (Cyber Systems Operations), 4N0X1 (Aerospace Medical Technician)
- Marines: 0311 (Rifleman), 0651 (Cyber Network Operator)

### 2. Career Pathway Stacking Visualization

Add a stacked credentials visualization showing:
- Entry-level certifications (e.g., CompTIA A+, CNA)
- Mid-level credentials (e.g., Network+, Security+, LPN)
- Advanced certifications (e.g., CISSP, BSN, PMP)
- Timeline estimates and GI Bill coverage eligibility

Example pathways to include:
- **Healthcare**: CNA (4-12 weeks) → LPN (12 months) → RN (2-4 years) → BSN
- **IT/Cybersecurity**: A+ → Network+ → Security+ → CySA+/CISSP
- **Project Management**: CAPM → PMP → PgMP
- **Aviation**: PPL → CPL → ATP

### 3. Advisory Disclaimers

Ensure these disclaimers are prominently displayed:
- "Career matches are based on documented skill overlap, not predictive outcomes"
- "Salary data from BLS OEWS (May 2024), may vary by location"
- "All career decisions should be discussed with your assigned transition advisor"
- "No individual risk scoring or automated approval recommendations"

### 4. NIST AI RMF Alignment Badge

Add a compliance badge section showing:
- NIST AI RMF 1.0 alignment
- EO 14110 compliance indicators
- Document-grounded AI only (no generative interpretation beyond sources)

### 5. Security Clearance Value Indicator

For service members with active clearances, show:
- Clearance premium salary boost (10-20% above non-cleared roles)
- Top industries hiring cleared personnel
- Clearance retention requirements (24-month window)
- Geographic hubs for cleared employment

### 6. GI Bill Integration

Add GI Bill benefit utilization guidance:
- Yellow Ribbon Program eligibility
- Monthly housing allowance estimates by school location
- Benefit exhaustion timeline calculator
- Certification exam fee coverage information

### 7. Footer and Contact Updates

Ensure the demo links back to:
- Portfolio: https://robertmccoyprojects.com
- CMGF Framework: https://robertmccoyprojects.com/cmgf
- Contact: data@robertmccoyprojects.com

### Design Principles to Maintain

1. **Governance is Architecture** - System design enforces ethical constraints
2. **AI as Infrastructure** - Never authority, always accountable
3. **Human Judgment Preserved** - Decision authority remains with people
4. **Transparency Over Optimization** - Explainability before efficiency
5. **Bounded AI** - All AI outputs grounded in documented sources

### Technical Requirements

- Maintain high-tech dark mode UI with accent color scheme
- Use semantic HTML with proper accessibility attributes
- Add data-testid attributes to all interactive elements
- Keep all AI features document-grounded (no speculative outputs)
- Salary data should cite "BLS OEWS May 2024" as source
- No automated decision-making or individual risk scoring

## PROMPT END

---

## Notes for Implementation

The cmgfdemo site is the "source of truth" for the live platform. The portfolio site documents and explains the framework while linking to the demo. Changes made to the demo should be reflected in how the portfolio describes the platform capabilities.

Key integration points:
- Portfolio MOS Translator page links to demo for full functionality
- Reference Explorer (portfolio) and demo both use bounded AI patterns
- Both sites share the NIST AI RMF 1.0 alignment messaging
