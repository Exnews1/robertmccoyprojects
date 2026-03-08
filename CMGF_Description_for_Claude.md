# Career Mobility Governance Framework (CMGF) — Complete Reference

## What It Is

The Career Mobility Governance Framework (CMGF) is a bounded, governance-first AI architecture designed for military-to-civilian career transitions. It addresses the structural gap between the $13.5B annual investment in Department of Defense (DoD) education benefits and the relatively small $140M allocated for transition-specific advising — a paradox affecting approximately 150,000 annual service member transitions.

CMGF is **compliant by design and non-predictive by default**. Its AI is limited to explainable translation, rule-based feasibility signals, and de-identified aggregation. It explicitly prohibits predictive outcome modeling, individual risk scoring, and automated approvals.

The framework is backed by 797 peer-reviewed sources and has been presented at national conferences including CCME (Council of College and Military Educators).

**Author:** Robert McCoy — systems engineer, program manager (40+ years aerospace/defense), M.S. AI & Data Analytics, MBA, Adjunct Professor at Indiana Wesleyan University, CWO (U.S. Navy and U.S. Army).

**Live Site:** https://robertmccoyprojects.com

---

## Three-Part Architecture

The CMGF architecture is divided into three distinct layers, each with clear authority boundaries:

### Part A: Service Member Interface (Individual Agency)
- Exploratory environment where service members can simulate futures safely
- Origin of all action but has NO authority to approve or predict
- Service members input their MOS (Military Occupational Specialty), career goals, constraints, and timeline
- Purely informational — no decisions are made here

### Part B: AI Mediation Framework (Non-Authoritative AI)
- The processing layer that performs:
  - Input normalization
  - Constraint detection (e.g., funding caps, credentialing gaps, timeline conflicts)
  - Pattern analysis and feasibility assessment
- Generates advisory signals for human review
- AI is bounded — it translates and organizes, it does NOT decide
- All outputs include traceability metadata: rules evaluated, data sources consulted, confidence levels

### Part C: Advisory & Human Review Layer (Human Judgment)
- The final decision-making workspace
- Education Services Officers (ESOs) and administrators review AI signals
- Humans apply context, institutional knowledge, and judgment
- Only humans can approve, modify, or escalate service member plans
- Every action is logged in an immutable audit trail

---

## The Five Pillars

The framework is built upon five foundational research pillars:

1. **Military Learner Career Mobility** — Research on transition outcomes, employment data, and career pathway analysis
2. **Empowerment Strategies & Stackable Pathways** — Studies on credential stacking, micro-credentials, and progressive certification
3. **ISR & AI-Assisted Career Advising** — Ethics and intelligent systems for institutional student records, AI-mediated advising
4. **Translating Military Experience** — MOS-to-civilian occupation mapping, skills translation, and credential equivalency
5. **Veteran & Servicemember Learner Voice Capturing** — Capturing individual agency, self-determination, and qualitative transition experiences

---

## Non-Negotiable AI Guardrails

CMGF enforces these constraints structurally — they are not guidelines, they are architecture:

- **NO Predictive Outcome Modeling** — The system does not "guess" whether a service member will succeed or fail
- **NO Individual Risk Scoring** — The system does not rank, profile, or score individuals
- **NO Automated Approvals** — AI cannot execute decisions; it only packages advisory signals for human review
- **NO Autonomous Action** — The system rejects any operation that bypasses human review
- **NO PII in Aggregation** — Institutional intelligence flows use de-identified, aggregated data only

---

## Compliance Frameworks Referenced

The architecture is explicitly mapped to current federal compliance requirements:

- **EO 14179** (Executive Order 14179, 2025) — Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence
- **NIST AI RMF 1.0** — National Institute of Standards and Technology AI Risk Management Framework
- **OMB M-25-21** (2025) — Federal AI governance and agency requirements
- **GAO-24** — Government Accountability Office oversight requirements
- **DoD Responsible AI (RAI) Principles** — Military-specific ethical AI standards

---

## Dual Data Flow

The CMGF implements two parallel data flows:

### Individual Advisory Flow (Service Member → Decision)
```
Service Member Request → AI Engine Analysis → ESO Advisor Review → Human Decision
```
- Each service member gets a personalized feasibility assessment
- AI identifies constraints, gaps, and pathway options
- ESO reviews and decides — approve, modify, or escalate

### Institutional Intelligence Flow (Aggregated → Pentagon)
```
De-identified SM Data → Normalization Hub → Aggregation → Installation-Level Patterns → DoD Policy Intelligence
```
- Individual records are stripped of PII
- Patterns are aggregated at the installation level
- Institutional signals (e.g., "80% of 68W medics at Fort Campbell are seeking nursing credentials but hitting CA funding caps") flow upward
- Informs resource allocation, policy updates, and program design at scale
- No individual is identifiable in the aggregated data

---

## Key System Components

### Career Path Feasibility Advisor
- Deterministic constraint-binding tool (fully client-side, no API calls)
- Evaluates 6 MOS types × 6 civilian career targets
- Applies real policy constraints: Army COOL $4,000/year caps, FAA 1,500-hour flight requirements, POST certification reciprocity, etc.
- Outputs: pathway options with match percentages, readiness measures, constraint risks, policy friction points, resource requirements with funding status (TA-eligible, CA-eligible, self-funded)
- Includes Governance Transparency panel showing engine version, execution type, data sources, and rules evaluated

### Scenario Orchestration Engine
- One-click scenario generation using synthetic military learner profiles
- Applies CMGF rules deterministically
- Generates HTML reports including individual assessments and batch institutional intelligence simulations
- Demonstrates how the system would operate at scale

### SM Request → ISR Pipeline
- End-to-end demonstration of the career transition pipeline:
  1. Service member submits a request (name, rank, MOS, career goal, constraints)
  2. System creates an ISR (Institutional Student Record) case
  3. AI engine runs analysis
  4. ESO advisor reviews and takes action (approve/modify/escalate)
  5. Every step is logged in an immutable audit trail

### Signal Flow Animation
- 90-second cinematic visualization of how CMGF scales from one service member to national policy
- Four acts: Single SM → One Installation → Multiple Bases → 180+ Installations feeding the Pentagon
- Demonstrates the institutional intelligence aggregation concept visually

### Reference Explorer (RAG)
- Semantic search over 797 peer-reviewed sources using OpenAI embeddings
- GPT-4o generates answers grounded strictly in the document library
- Inline citations — every claim is traceable to a specific source
- Cannot hallucinate beyond the library content

---

## Technical Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Express.js, Node.js, TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **AI Services:** OpenAI API (text-embedding-3-small for embeddings, GPT-4o for RAG)
- **Design:** Formal/statutory aesthetic — dark navy (#0F172A), antique gold (#B45309), Merriweather serif headings, Inter body text, sharp corners

---

## Key Differentiators

1. **Policy-as-Code:** Governance rules are encoded in the architecture, not bolted on as afterthoughts
2. **Bounded AI:** The system deliberately limits AI capabilities — this is a feature, not a limitation
3. **Human-in-the-Loop by Design:** AI signals are advisory only; humans always decide
4. **Full Traceability:** Every signal, decision, and action is logged and auditable
5. **Dual Purpose:** Serves both individual service members AND institutional decision-makers simultaneously
6. **Research-Grounded:** Built on 797 peer-reviewed sources, not vendor marketing

---

## CMGF Series 2026 Publications

- **CMGF-01:** Executive White Paper — A Governance-First Architecture for Military Transition Advising
- **CMGF-02:** Policy & Governance Analysis
- **CMGF-03:** Data Flow & Signal Architecture

---

## Contact

Robert McCoy
robert.mccoy@thegovernanceframework.com
https://robertmccoyprojects.com
