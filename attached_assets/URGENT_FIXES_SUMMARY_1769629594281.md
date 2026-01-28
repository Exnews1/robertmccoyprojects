# URGENT: Pillar Pages Issues & Fixes Required

**Date:** January 28, 2026  
**Reported By:** Robert McCoy  
**Priority:** HIGH - Affects doctoral credibility

---

## ISSUES IDENTIFIED BY USER

### 1. **No APA7 Citations on Statistics** ❌
**Problem:** Statistics in Layer 1 (like "95% vs 83%", "$16,872") appear with NO source attribution
**Location:** All pillar pages, Layer 1 research cards
**Impact:** Appears unscholarly, not verifiable, fails doctoral standards

### 2. **Text Too Small** ❌
**Problem:** Body text is too small (text-sm = 14px), hard to read
**Location:** Layer 1 descriptions, Layer 2 content
**Impact:** Poor readability, unprofessional appearance

### 3. **Confusion Between Documents** ❌
**Problem:** Statistics and citations don't always match between comprehensive research doc and pillar pages
**Location:** Cross-referencing issues throughout
**Impact:** Inconsistency damages credibility

### 4. **Confusing Statistics Presentation** ❌
**Problem:** Stats shown without context, unclear which study they're from
**Location:** Layer 1 cards mix multiple studies' findings
**Impact:** Reader confusion about source and reliability

### 5. **2007 Citation TOO OLD** ❌ **CRITICAL**
**Problem:** Bond et al., 2007 is 19 years old - unacceptable for doctoral work in 2026
**Location:** Homepage and pillar pages
**Impact:** **FAILS doctoral committee standards** - need citations within 5-7 years

---

## CRITICAL CORRECTION MADE

### ✅ Updated Bond Citation from 2007 → 2022

**OLD (WRONG):**
- Bond et al., 2007 - Study on severe mental illness (NOT veterans)
- 19 years old - TOO DATED

**NEW (CORRECT):**
- **Bond, G. R., Al-Abdulmunem, M., Ressler, D. R., Gade, D., & Drake, R. E. (2022)**
- A Randomized Controlled Trial of an Employment Program for Veterans Transitioning from the Military: Two-Year Outcomes
- DOI: https://doi.org/10.1007/s10488-022-01208-z
- 4 years old - APPROPRIATE for doctoral work
- Specifically about VETERANS (not mental illness patients)

**Updated on:**
- ✅ Homepage (index.html) - both statistics cards

**Still needs update on:**
- 🔄 Pillar 1 page (currently says 2023, should be 2022)
- 🔄 All documentation files

---

## COMPREHENSIVE FIX PLAN

### Phase 1: Fix ALL Pillar Pages Structure

#### A. Add Source Attribution to Layer 1 Statistics

**BEFORE (Current - NO CITATION):**
```html
<div class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg text-center">
    <div class="text-3xl font-bold">95% vs 83%</div>
    <div class="text-sm">Employment Rate</div>
</div>
```

**AFTER (With Citation):**
```html
<div class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-lg text-center">
    <div class="text-3xl font-bold mb-2">95% vs 83%</div>
    <div class="text-base font-medium">Employment Rate at 2 Years</div>
    <div class="text-sm mt-3 opacity-90 border-t border-white/30 pt-3">
        <strong>Source:</strong> 
        <a href="https://doi.org/10.1007/s10488-022-01208-z" 
           target="_blank" 
           class="underline hover:opacity-80 font-medium">
            Bond et al., 2022
        </a>
    </div>
</div>
```

#### B. Increase Text Sizes Throughout

**Changes needed:**
- Layer 1 card descriptions: `text-sm` (14px) → `text-base` (16px)
- Layer 2 body text: `text-sm` (14px) → `text-base` (16px)
- Statistics labels: `text-sm` → `text-base`
- Keep headings at current sizes (appropriate)

#### C. Make ALL Inline Citations Clickable

**BEFORE (Plain text):**
```html
...coached participants achieved 95% employment (Bond et al., 2023).
```

**AFTER (Clickable link):**
```html
...coached participants achieved 95% employment 
<a href="https://doi.org/10.1007/s10488-022-01208-z" 
   target="_blank" 
   class="text-blue-600 hover:underline font-medium">
    (Bond et al., 2022)
</a>.
```

#### D. Format Key References with DOI Links

**BEFORE (Plain text, no links):**
```
Bond, G. R., Al-Abdulmunem, M., Ressler, D. R., et al. (2023). Evaluation of an employment intervention...
```

**AFTER (APA 7th with clickable DOI):**
```html
<div class="bg-blue-50 border-l-4 border-blue-600 p-6 mt-6 rounded-r-lg">
    <h4 class="font-bold text-xl mb-4 text-gray-900">Key References</h4>
    <div class="space-y-4 text-base">
        <p class="leading-relaxed">
            Bond, G. R., Al-Abdulmunem, M., Ressler, D. R., Gade, D., & Drake, R. E. (2022). 
            A randomized controlled trial of an employment program for veterans transitioning 
            from the military: Two-year outcomes. <em>Administration and Policy in Mental Health 
            and Mental Health Services Research, 49</em>(6), 1040–1054.
            <a href="https://doi.org/10.1007/s10488-022-01208-z" 
               target="_blank" 
               class="text-blue-600 hover:underline font-medium ml-2">
                https://doi.org/10.1007/s10488-022-01208-z
            </a>
        </p>
    </div>
</div>
```

---

## PILLAR-SPECIFIC FIXES NEEDED

### Pillar 1: Military Learner Career Mobility
**Status:** Partially complete, needs major updates

**Required actions:**
1. ✅ Update Bond citation: 2023 → 2022 (DONE on homepage)
2. 🔄 Add source attribution to ALL Layer 1 statistics
3. 🔄 Make all inline citations clickable
4. 🔄 Format Key References with DOI links
5. 🔄 Increase text sizes throughout
6. 🔄 Update Ordway citation: 2020 → 2018 (correct year)

**Key citations needed:**
- Bond et al., 2022 - DOI: 10.1007/s10488-022-01208-z ✅
- Barr et al., 2021 - Need NBER working paper URL
- Ordway, 2018 - URL: https://journalistsresource.org/economics/veteran-unemployment-research/ ✅
- Davenport et al., 2019 - DOI: 10.1016/j.jvb.2019.103329 ✅

### Pillar 2: Empowerment Strategies & Stackable Pathways
**Status:** Skeleton created, needs full Layer 2 expansion + citations

**Required actions:**
1. 🔄 Add source attribution to ALL statistics
2. 🔄 Build out Layer 2 with clickable citations
3. 🔄 Add Key References section with DOI links
4. 🔄 Increase text sizes

**Key citations needed:**
- McNeal et al., 2019 - DOI: 10.3928/01484834-20190719-03 ✅
- Morris et al., 2023 - DOI: 10.1080/07377363.2022.2082002 ✅
- Credentialing program studies from literature review

### Pillar 3: ISR & AI-Assisted Career Advising
**Status:** Skeleton only, needs complete build-out

**Required actions:**
1. 🔄 Build complete Layer 1 with statistics + citations
2. 🔄 Build Layer 2 with detailed analysis + clickable citations
3. 🔄 Add Key References section with DOI links
4. 🔄 Use proper text sizes from start

**Key citations needed:**
- AI career advising studies from literature review
- NIST AI RMF references
- ESO/ISR system studies

### Pillar 4: Translating Military Experience
**Status:** Skeleton only, needs complete build-out

**Required actions:**
1. 🔄 Build complete Layer 1 with statistics + citations
2. 🔄 Build Layer 2 with detailed analysis + clickable citations
3. 🔄 Add Key References section with DOI links
4. 🔄 Use proper text sizes from start

**Key citations needed:**
- MOS translation studies
- Employer perception research
- Skills gap analyses

### Pillar 5: Veteran Learner Voice
**Status:** Skeleton only, needs complete build-out

**Required actions:**
1. 🔄 Build complete Layer 1 with statistics + citations
2. 🔄 Build Layer 2 with detailed analysis + clickable citations
3. 🔄 Add Key References section with DOI links
4. 🔄 Use proper text sizes from start

**Key citations needed:**
- Veteran student experience studies
- Barrier research
- TBI/PTSD accommodation studies

---

## PRIORITY ORDER

### IMMEDIATE (Do First):
1. ✅ **Update Bond 2007 → 2022 on homepage** (COMPLETED)
2. 🔄 **Update Bond citation on Pillar 1 page** (IN PROGRESS)
3. 🔄 **Add source attribution to all Layer 1 statistics on Pillar 1**
4. 🔄 **Increase text sizes on Pillar 1**
5. 🔄 **Make all Pillar 1 citations clickable with DOI links**

### HIGH PRIORITY (Do Next):
6. 🔄 **Apply same fixes to Pillar 2**
7. 🔄 **Build out Pillars 3, 4, 5 with proper citations from start**

### MEDIUM PRIORITY (Final Polish):
8. 🔄 **Cross-reference all statistics across documents**
9. 🔄 **Verify all DOI links are active**
10. 🔄 **Update all documentation files with correct citations**

---

## ESTIMATED TIME TO COMPLETE

- **Pillar 1 complete fix:** 1.5 hours
- **Pillar 2 complete fix:** 1 hour
- **Pillars 3-5 build-out:** 3-4 hours
- **Cross-reference verification:** 30 minutes
- **Total:** 6-7 hours

---

## FILES REQUIRING UPDATES

### Website Files:
1. `/home/sandbox/cmgf-five-pillars-website/index.html` - ✅ UPDATED (Bond 2022)
2. `/home/sandbox/cmgf-five-pillars-website/pillar1.html` - 🔄 NEEDS MAJOR UPDATES
3. `/home/sandbox/cmgf-five-pillars-website/pillar2.html` - 🔄 NEEDS UPDATES
4. `/home/sandbox/cmgf-five-pillars-website/pillar3.html` - 🔄 NEEDS BUILD-OUT
5. `/home/sandbox/cmgf-five-pillars-website/pillar4.html` - 🔄 NEEDS BUILD-OUT
6. `/home/sandbox/cmgf-five-pillars-website/pillar5.html` - 🔄 NEEDS BUILD-OUT

### Documentation Files:
7. `/home/sandbox/Career_Mobility_Governance_Framework_Doctoral_Research.md` - 🔄 CHECK CITATIONS
8. `/home/sandbox/PROJECT_STATUS_SUMMARY.md` - 🔄 UPDATE
9. `/home/sandbox/WEBSITE_UPDATES_CITATIONS.md` - 🔄 UPDATE
10. `/home/sandbox/KEY_CITATIONS_WITH_DOIS.md` - 🔄 UPDATE

---

## NEXT STEPS

**Robert McCoy should:**
1. Review the corrected Bond et al., 2022 citation
2. Approve the proposed fix plan
3. Confirm priority order
4. Provide any additional guidance on statistics presentation

**Agent should:**
1. Complete Pillar 1 fixes (add citations, increase text, make links clickable)
2. Apply template to Pillar 2
3. Build out Pillars 3-5 with proper citations from start
4. Verify all DOI links work
5. Cross-reference all statistics for consistency

---

**Status:** Partial fix completed (homepage updated to Bond 2022)  
**Remaining Work:** ~6-7 hours to complete all pillar pages properly  
**Priority:** HIGH - Doctoral credibility depends on recent, properly cited sources
