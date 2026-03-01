import { db } from "./db";
import { publications } from "@shared/schema";
import { sql } from "drizzle-orm";
import { pool } from "./db";

const seedPublications = [
  {
    title: "Skill Shift: Automation and the Future of the Workforce",
    type: "Paper",
    author: "McKinsey Global Institute - Jacques Bughin, Eric Hazan, Susan Lund, Peter Dahlström, Anna Wiesinger, Amresh Subramaniam",
    url: "/attached_assets/mgi-skill-shift-automation-and-future-of-the-workforce-in-brie_1767730185939.pdf",
    abstract: "McKinsey Global Institute research on how automation and AI are changing workforce skills. Finds strongest growth in demand for technological skills (55% rise by 2030), social and emotional skills (24% rise), while basic cognitive and physical/manual skills will decline.",
    publishedDate: "2018"
  },
  {
    title: "Completing the Mission: Best Practices for Recruiting and Hiring Veterans",
    type: "Paper",
    author: "SHRM and SHRM Foundation with USAA",
    url: "/attached_assets/Research_SHRM_Research_Report_on_Recruiting_and_Hiring_Veteran_1767730185940.pdf",
    abstract: "SHRM research on veteran hiring showing 98% of HR professionals believe veterans can thrive in various work settings. Veterans outperform civilians in work ethic (68%), teamwork (61%), and leadership (58%). Only 31% of organizations report being effective at hiring veterans.",
    publishedDate: "2024"
  },
  {
    title: "Revisiting the Business Case for Hiring a Veteran: A Strategy for Cultivating Competitive Advantage",
    type: "Paper",
    author: "J. Michael Haynie, Ph.D. - IVMF Syracuse University",
    url: "/attached_assets/Revisiting-the-Business-Case_Workforce-Readiness_Full-Report_1767730185940.pdf",
    abstract: "Framework for leveraging veteran talent through talent acquisition, deployment, and development strategies. Argues firms must develop strategy to acquire, deploy, and develop veteran talent as a rare, valuable, and differentiating resource.",
    publishedDate: "2016"
  },
  {
    title: "2025 Workplace Trends",
    type: "Paper",
    author: "ATD - Association for Talent Development",
    url: "/attached_assets/trends-2025-ebook-1611641012_1767730185940.pdf",
    abstract: "ATD analysis of critical workplace topics including AI adoption, career development, employee well-being, and leadership development. 66% of leaders say they would not hire someone without AI skills. Explores collaborative intelligence between humans and AI.",
    publishedDate: "2025"
  },
  {
    title: "Employment Situation of Veterans - 2024",
    type: "Technical Report",
    author: "U.S. Bureau of Labor Statistics",
    url: "/attached_assets/BLS_EMPLOYMENT_SITUATION_OF_VETERANS_2024_1767730198439.pdf",
    abstract: "Bureau of Labor Statistics annual report on veteran employment. Veteran unemployment at 3.0% (lower than 3.9% for nonveterans). 48% of Gulf War-era II veterans have service-connected disability. Veterans more likely to work in public sector.",
    publishedDate: "2025"
  },
  {
    title: "AI in the Workplace 2025: Understanding Industry Needs",
    type: "Paper",
    author: "Digital Education Council with GFTN",
    url: "/attached_assets/Digital_Education_Council_-_AI_in_the_Workplace_2025_1767730198440.pdf",
    abstract: "Digital Education Council research on employer AI adoption. 63% find AI game-changing or very helpful. 72% expect AI to reduce headcount. Only 3% believe higher education adequately prepares graduates for AI-driven workforce.",
    publishedDate: "2025"
  },
  {
    title: "Military and Veteran Support: DOD Steps to Help Servicemembers Transfer Skills to Civilian Employment",
    type: "Technical Report",
    author: "U.S. Government Accountability Office",
    url: "/attached_assets/gao-22-105261_1767730198440.pdf",
    abstract: "GAO report examining DOD efforts to address challenges in transferring military skills to civilian workforce. Covers COOL (Credentialing Opportunities Online) and USMAP (United Services Military Apprenticeship Program) effectiveness.",
    publishedDate: "2022"
  },
  {
    title: "Market Trend Analysis as a Strategic Tool for Workforce Development Programs",
    type: "Paper",
    author: "Daphine Nyangoma, Ejuma Martha Adaga, Ngodoo Joy Sam-Bulya, Godwin Ozoemenam Achumie",
    url: "/attached_assets/Market_Trend_Analysis_as_a_Strategic_Tool_for_Work_1767730198440.pdf",
    abstract: "Data-driven conceptual model integrating technology, stakeholder collaboration, and continuous learning for adaptable workforce strategies. Examines employment projections, industry demand assessments, and skills mapping.",
    publishedDate: "2025"
  },
  {
    title: "Automation and the Workforce of the Future",
    type: "Paper",
    author: "McKinsey Global Institute",
    url: "/attached_assets/Automation_and_the_workforce_of_the_future___McKinsey_1767730198440.pdf",
    abstract: "McKinsey analysis of skill shifts through 2030. Advanced IT and programming skills to grow 90%. Social and emotional skills like leadership to rise 33%. Basic cognitive skills and physical/manual skills to decline as automation advances.",
    publishedDate: "2018"
  },
  {
    title: "The 2024 Army Force Structure Transformation Initiative",
    type: "Technical Report",
    author: "Andrew Feickert, Congressional Research Service",
    url: "/attached_assets/The_2024_Army_Force_Structure_1767730521233.pdf",
    abstract: "Congressional Research Service analysis of Army reorganization including Multi-Domain Task Forces, force structure reductions, and recruiting challenges. Covers national security implications of transforming 150K+ annual separations and Reserve Component changes.",
    publishedDate: "2025-02-05"
  },
  {
    title: "DoD Strategic Management Plan FY 2022-2026",
    type: "Technical Report",
    author: "Department of Defense",
    url: "/attached_assets/DOD_Strategic_Management_Plan_2024_1767730524783.pdf",
    abstract: "Department of Defense strategic roadmap covering workforce cultivation, technology investments, defense ecosystem resilience, and institutional management priorities. Emphasizes data-driven performance improvement and transition to data-centric organization.",
    publishedDate: "2024-02-28"
  },
  {
    title: "Revised Criteria for Accreditation and Assumed Practices",
    type: "Technical Report",
    author: "Higher Learning Commission",
    url: "/attached_assets/AdoptedPolicy-Criteria_2024-06_POL_1767730548547.pdf",
    abstract: "Higher Learning Commission policy update implementing mission-reflective accreditation approach, consolidated teaching and learning criteria, and refined language for student success outcomes. Effective September 2025.",
    publishedDate: "2024-06-27"
  },
  {
    title: "Counting U.S. Postsecondary and Secondary Credentials 2022",
    type: "Publication",
    author: "Credential Engine",
    url: "/attached_assets/Final-CountingCredentials_2022_1767730548547.pdf",
    abstract: "Comprehensive count revealing over 1,076,000 unique credentials in the U.S. including degrees, certificates, licenses, apprenticeships, and digital badges. Non-academic organizations provide 656,505 credentials through online courses and badges.",
    publishedDate: "2022-12-01"
  },
  {
    title: "The Evolving Landscape of Workplace Competencies: A Synthesis of Knowledge, Skills, and Abilities for the Digital Age",
    type: "Technical Report",
    author: "Digital Transformation Research",
    url: "/attached_assets/The_Evolving_Landscape_of_Workplace_Competencies_1767730185940.docx",
    abstract: "Synthesis of modern workplace competencies including the Digital Transformation Skills Framework (DTSF). Covers AI skills, entrepreneurial skills, data literacy, collaboration, adaptation and resilience. Non-technical skills account for 58% of in-demand skills vs 27% for technical.",
    publishedDate: "2025"
  },
  {
    title: "2025 Value of IT Certification Candidate Report",
    type: "Publication",
    author: "Pearson VUE",
    url: "/attached_assets/pearson-vue-2025-value-of-certification-report_1767730548547.pdf",
    abstract: "Global survey of 24,000 IT professionals showing 82% gained confidence for new opportunities, 63% received promotions, and 32% received salary increases after certification. Documents AI certification demand doubling from 17% to 35% in two years.",
    publishedDate: "2025-01-01"
  },
  {
    title: "Compliance Framework for Generative AI (CMGF)",
    type: "Paper",
    author: "Lead Researcher",
    url: "/attached_assets/Career_Mobility_2026__CCME_v4_1770726274664.docx",
    abstract: "This paper introduces the CMGF framework, designed to ensure safety and transparency in high-impact AI systems.",
    publishedDate: "2024"
  },
  {
    title: "Informing Improved Recognition of Military Learning",
    type: "Paper",
    author: "American Institutes for Research",
    url: "/attached_assets/Informing-Improved-Recognition-of-Military-Learning-Postsecond_1767730548548.pdf",
    abstract: "American Institutes for Research study of 500+ student veterans finding 64% received fewer credits than expected, only 27% received credit toward their major, and significant disparities by race and gender in credit recognition attempts.",
    publishedDate: "2023-01-01"
  },
  {
    title: "Build America: Empowering Military Learners for Future Success",
    type: "Technical Report",
    author: "American Council on Education",
    url: "/attached_assets/Lilly-Endowment-Report_1767730548548.pdf",
    abstract: "ACE/AACRAO survey of Georgia and Indiana institutions on Credit for Prior Learning policies for military learners. Identifies need for enhanced CPL training, faculty engagement, and standardized data collection across systems.",
    publishedDate: "2025-03-01"
  },
  {
    title: "Presenting a Holistic Student Veteran Advising Model",
    type: "Paper",
    author: "Phillip Morris, University of Colorado Colorado Springs",
    url: "/attached_assets/National_Resouce_Center_Phillip_Morris_Presenting_a_Holistic_S_1767730548548.pdf",
    abstract: "Research brief introducing transitional advising framework based on Schlossberg Four S model (Situation, Support, Self, Strategies). Addresses advisor knowledge gaps and emphasizes intersectional identity recognition for student veterans.",
    publishedDate: "2022-07-01"
  },
  {
    title: "Credit Mobility Strategies in Action",
    type: "Publication",
    author: "Kyle Gray, Betsy Mueller, Emily Tichenor, Madeline Trimble, Ithaka S+R",
    url: "/attached_assets/SR-Report-Credit-Mobility-Strategies-in-Action-022725_1767730565983.pdf",
    abstract: "Ithaka S+R case study examining holistic credit mobility frameworks across Idaho, Illinois, Ohio, North Carolina systems plus Charter Oak State College and Florida International University. Documents how 45.6% of associates and 67% of bachelors holders have multi-institution transcripts.",
    publishedDate: "2025-02-27"
  },
  {
    title: "Informing Improved Recognition of Military Learning: Exploring Student Veteran Experiences",
    type: "Paper",
    author: "Jennie Jiang, Kellie Macdonald, Jessica Mason, et al., American Institutes for Research",
    url: "/attached_assets/Informing-Improved-Recognition-of-Military-Learning-Postsecond_1767730548548.pdf",
    abstract: "AIR study of 500+ student veterans: 64% received less credit than expected, 48% said CPL important in institution choice (57% for students of color), 80% attempted credit for training vs 60% for occupation, only 27% received credit toward major. Female and students of color less likely to attempt credit recognition.",
    publishedDate: "2023-01-01"
  },
  {
    title: "Build America: Empowering Military Learners for Future Success - CPL Survey Phase One",
    type: "Technical Report",
    author: "American Council on Education (ACE) and AACRAO",
    url: "/attached_assets/Lilly-Endowment-Report_1767730548548.pdf",
    abstract: "ACE/AACRAO survey of Georgia and Indiana institutions on CPL policies. 127 Indiana responses, 40 Georgia responses. Key findings: faculty engagement varies significantly, additional awareness and training needed, CPL policies not well understood across institutions. Recommendations for enhanced CPL training.",
    publishedDate: "2025-03-01"
  },
  {
    title: "Are Current Military Education Benefits Efficient and Effective for the Services?",
    type: "Technical Report",
    author: "Jennie W. Wenger, Trey Miller, Matthew D. Baird, et al., RAND Corporation",
    url: "/attached_assets/RAND_RR1766_1767730565983.pdf",
    abstract: "RAND Corporation analysis of Post-9/11 GI Bill and Tuition Assistance impacts on recruiting, retention, and service member outcomes. Examines perspectives of new recruits, college veteran offices, and empirical data on benefit usage patterns.",
    publishedDate: "2017-01-01"
  },
  {
    title: "The Broken Path: Redrawing Veteran Success",
    type: "Paper",
    author: "Unknown",
    url: "/attached_assets/The_Broken_Path_Redrawing_Veteran_Success_1767730565982.pdf",
    abstract: "Analysis of systemic barriers in military-to-civilian transition pathways, examining credential recognition gaps and the need for coordinated support systems across education, employment, and benefits administration.",
    publishedDate: "2024-01-01"
  },
  {
    title: "The Next Era of Assessment: A Global Review of AI in Assessment Design",
    type: "Publication",
    author: "Digital Education Council and Pearson",
    url: "/attached_assets/The_Next_Era_of_Assessment_1767730565983.pdf",
    abstract: "Digital Education Council and Pearson global review of 101 case studies introducing three assessment types: AI-Free, AI-Assisted, and AI-Integrated. 54% of faculty believe assessments require significant change. Proposes AI-Resilience as baseline design principle.",
    publishedDate: "2025-01-01"
  },
  {
    title: "The National Landscape of Credit for Prior Learning (CPL)",
    type: "Publication",
    author: "CAEL and American Council on Education",
    url: "/attached_assets/PC.CreditforPriorLearning_1767730548549.pdf",
    abstract: "ACE and CAEL 50-state scan identifying 400+ CPL policies across categories including military training recognition, cost/affordability, transfer, transcription, and data tracking. Highlights California, SUNY, Oregon, Minnesota, and Kansas as comprehensive CPL leaders.",
    publishedDate: "2024-10-01"
  },
  {
    title: "You Cannot Handle the Truth: The Effects of the Post-9/11 GI Bill on Higher Education and Earnings",
    type: "Paper",
    author: "Andrew Barr, Laura Kawano, Bruce Sacerdote, William Skimmyhorn, Michael Stevens",
    url: "/attached_assets/YOU_CAN'T_HANDLE_THE_TRUTH_Barr_1767730553482.pdf",
    abstract: "NBER study finding Post-9/11 GI Bill increased enrollment by 0.17 years and BA completion by 1.2 percentage points but REDUCED average annual earnings by $900 nine years after separation due to lost labor market experience. Critical finding for transition policy design.",
    publishedDate: "2021-07-01"
  },
  {
    title: "Army Credentialing Assistance Program Process Guide",
    type: "Technical Report",
    author: "Army Credentialing Assistance Program Office (ACAPO)",
    url: "/attached_assets/Soldier_CA_Process_Guide_Policy_COOL_Goals_Feb_2025_1767730565983.pdf",
    abstract: "Official Army guidance on Credentialing Assistance (CA) program including Army COOL, MilGears, and ArmyIgnitED platforms. Documents $4,500 annual limit, $2,000 per credential limit, 3 credentials per 10 years policy, and 45-day advance submission requirements.",
    publishedDate: "2025-02-01"
  },
  {
    title: "Artificial Intelligence: DOD Should Improve Strategies, Inventory Process, and Collaboration Guidance",
    type: "Technical Report",
    author: "Government Accountability Office",
    url: "/attached_assets/gao-22-105834_1767732168996.pdf",
    abstract: "GAO report evaluating DOD AI Strategy comprehensiveness, AI activities identification and reporting, and collaboration practices across the department.",
    publishedDate: "2024"
  },
  {
    title: "DEC AI Literacy Framework",
    type: "Technical Report",
    author: "Digital Education Council",
    url: "/attached_assets/DEC_AI_Literacy_Framework_1767732172309.pdf",
    abstract: "Framework defining essential knowledge and skills for AI literacy across five dimensions: Understanding AI, Critical Thinking, Ethical Use, Human-Centricity, and Domain Expertise.",
    publishedDate: "2024"
  },
  {
    title: "U.S. Demand for AI Certifications: Promise or Hype?",
    type: "Paper",
    author: "Center for Security and Emerging Technology",
    url: "/attached_assets/CSET-U.S.-Demand-for-AI-Certifications_1767732177823.pdf",
    abstract: "Analysis of employer demand for AI certifications in job postings, examining whether certifications serve as alternative pathways to AI workforce entry.",
    publishedDate: "2024"
  },
  {
    title: "The Federal Government in the Age of Artificial Intelligence",
    type: "Paper",
    author: "Yll Bajraktari",
    url: "/attached_assets/Bajraktari-Written-Testimony_1767732182190.pdf",
    abstract: "Written testimony to U.S. House Committee on Oversight addressing strategic role of AI in enhancing government functions, national security, and global leadership.",
    publishedDate: "2024"
  },
  {
    title: "Army CIO Guidance on Generative AI and Large Language Models",
    type: "Technical Report",
    author: "Department of the Army",
    url: "/attached_assets/ARN41285-PPM_CIO-024-000-WEB-1_1767732187290.pdf",
    abstract: "Official Army guidance for development, deployment, and use of Generative AI including LLMs within the Army, addressing developer, user, and command responsibilities.",
    publishedDate: "2024"
  },
  {
    title: "Workforce Readiness Alignment: The Relationship Between Job Preferences, Retention, and Earnings",
    type: "Paper",
    author: "Rosalinda V. Maury, Brice M. Stone, Deborah A. Bradbard, Nicholas J. Armstrong, J. Michael Haynie - IVMF Syracuse University",
    url: "/attached_assets/WORKFORCE-READINESS-ALIGNMENT_1767730175328.pdf",
    abstract: "This paper examines the relationship between job preferences, military conferred skills, and outcome measures including retention, income, and perceptions about transition. Analysis demonstrates that application of military skills and securing employment in a desired career field are critical factors in the transition process.",
    publishedDate: "2016"
  },
  {
    title: "Work After Service: Developing Workforce Readiness and Veteran Talent for the Future",
    type: "Paper",
    author: "Deborah A. Bradbard, Nicholas J. Armstrong, Rosalinda Maury - IVMF Syracuse University",
    url: "/attached_assets/WORK-AFTER-SERVICE-Developing-Workforce-Readiness-and-Veteran-_1767730185941.pdf",
    abstract: "IVMF research on workforce readiness as interaction between veteran skills, employer practices, and public-private partnerships. Provides recommendations for veterans, government, and employers on transition support.",
    publishedDate: "2016"
  },
  {
    title: "Military Learner Mobility and Career Alignment: The Future Is Now",
    type: "Technical Report",
    author: "CCME 2026 Learner Track",
    url: "/attached_assets/CCME_2026_1767730819889.pdf",
    abstract: "CCME 2026 Learner Track presentation introducing Career Mobility Governance Framework (CMGF) architecture. Proposes continuous career planning with AI Advisor Assistant, ESO Policy Intelligence View for aggregated de-identified signals. Core principle: career responsibility rests with individual, visibility and clarity are institutional obligations. Demonstrates bounded, explainable, non-predictive analytics system.",
    publishedDate: "2026-01-01"
  },
  {
    title: "A Governed, Human-in-the-Loop AI Framework for Military Career Mobility: Design, Constraints, and Ethical Tradeoffs",
    type: "Paper",
    author: "Robert E. McCoy MBA, M.S. AI & Data Analytics, Indiana Wesleyan University",
    url: "/attached_assets/Career_Mobility_2026__CCME_v4_1770726274664.docx",
    abstract: "Response to 2026 CCME Learner Track 1. Introduces Career Mobility Governance Framework (CMGF) addressing $13.5B education benefits vs $140M transition advising funding paradox affecting ~150K annual service member transitions. CMGF is compliant by design, non-predictive by default - bounded AI limited to explainable translation, rule-based signals, and de-identified aggregation. Explicitly prohibits predictive outcome modeling, individual risk scoring, and automated approvals. Six key contributions: structured synthesis of CPL/mobility research, labor market signaling evidence, governance gap diagnosis, AI-enabled advising framework, and responsible AI design principles demonstrating intentional non-use of high-risk AI functions. Built against EO 14179, NIST AI RMF 1.0, and GAO-24 oversight requirements.",
    publishedDate: "2026-01-01"
  },
  {
    title: "The National Landscape of Credit for Prior Learning: Effective Policies for Success and Equity",
    type: "Publication",
    author: "American Council on Education and CAEL",
    url: "/attached_assets/PC.CreditforPriorLearning_1767730548549.pdf",
    abstract: "ACE/CAEL 50-state scan identified 400+ CPL policies. Policy themes: transparency, institutional consistency, military training, cost/affordability, transfer, transcription, data tracking, evaluation. Top states: California (28 policies), SUNY (25), Oregon (23), Minnesota (19), Kansas (18). Delaware case study on collaborative policy development.",
    publishedDate: "2024-10-01"
  },
  {
    title: "You Cant Handle The Truth: The Effects of the Post-9/11 GI Bill on Higher Education and Earnings",
    type: "Paper",
    author: "Andrew Barr, Laura Kawano, Bruce Sacerdote, William Skimmyhorn, Michael Stevens, NBER",
    url: "/attached_assets/YOU_CAN'T_HANDLE_THE_TRUTH_Barr_1767730553482.pdf",
    abstract: "NBER Working Paper 29024: Post-9/11 GI Bill raised enrollment by 0.17 years and BA completion by 1.2 percentage points but reduced annual earnings by $900 nine years post-separation. Veterans unlikely to recoup lost earnings during careers. Less advantaged veterans (lower AFQT, less occupationally skilled) show larger enrollment effects but more negative earnings effects. Demonstrates risks of generous subsidies for specific student groups.",
    publishedDate: "2021-07-01"
  },
  {
    title: "A Summary of Veteran-Related Statistics",
    type: "Paper",
    author: "Eric Robinson, Justin W. Lee, Teague Ruder, Megan S. Schuler, Gilad Wenig, Carrie M. Farmer, Jessica Phillips, Rajeev Ramchand - RAND Corporation",
    url: "/attached_assets/RAND_RRA1363-5_1767990443988.pdf",
    abstract: "RAND analysis of veteran demographics, mental health, and labor market outcomes using American Community Survey, NSDUH, and Current Population Survey data. Provides baseline estimates for policymakers on veteran population size, age, education, employment, and geographic distribution.",
    publishedDate: "2023"
  },
  {
    title: "Federal Programs to Assist Military-to-Civilian Employment Transitions",
    type: "Paper",
    author: "Meredith Kleykamp, Jeffrey B. Wenger, Elizabeth Hastings Roer, Matthew Kubasak, Travis Hubble, Lauren Skrabala - RAND Corporation",
    url: "/attached_assets/RAND_RRA1363-12_1767990443988.pdf",
    abstract: "RAND study of 45 federal programs spending $13B+ annually on veteran employment transitions. Finds 97% of funding goes to education vs direct employment support. Documents lack of outcome evaluation and program fragmentation across 11 agencies.",
    publishedDate: "2024"
  },
  {
    title: "Military-to-Civilian Occupational Matching Using O*NET",
    type: "Paper",
    author: "Jeffrey B. Wenger, Elizabeth Hastings Roer, Jonathan P. Wong - RAND Corporation",
    url: "/attached_assets/RAND_RRA2289-1_1767990443989.pdf",
    abstract: "RAND methodology for matching military occupations to civilian jobs using O*NET survey data from 5,100+ Navy, Marine Corps, and Air Force personnel. Provides algorithmic job recommendations based on knowledge, skills, abilities matching.",
    publishedDate: "2023"
  },
  {
    title: "How Artificial General Intelligence Could Affect the Rise and Fall of Nations",
    type: "Paper",
    author: "Barry Pavel, Ivana Ke, Gregory Smith, Sophia Brown-Heidenreich, Lea Sabbag, Ashwin Acharya, Yusuf Mahmood - RAND Corporation",
    url: "/attached_assets/RAND_RRA3034-2_1767990443989.pdf",
    abstract: "RAND analysis of eight scenarios for AGI impact on geopolitics. Explores centralized vs decentralized AGI development and implications for U.S. power, adversary advantage, and global stability.",
    publishedDate: "2025"
  },
  {
    title: "Leading with Artificial Intelligence: Insights for U.S. Civilian and Military Leaders",
    type: "Paper",
    author: "Rachel Slama, Nelson Lim, Douglas Yeung et al. - RAND Corporation",
    url: "/attached_assets/RAND_PEA3414-1_1767990443989.pdf",
    abstract: "RAND guidance on AI workforce adoption covering taxonomy of AI risks, use cases for chatbots and HR, upskilling federal workforce, K-12 and postsecondary education, military leader development, talent retention, and overcoming resistance to AI adoption.",
    publishedDate: "2024-10"
  },
  {
    title: "Federal and Nonprofit Support for Veterans Transitioning to Civilian Workforce",
    type: "Technical Report",
    author: "RAND Epstein Family Veterans Policy Research Institute",
    url: "/attached_assets/RAND_RBA1363-3_1767990443989.pdf",
    abstract: "RAND research brief on 45 federal programs and nonprofit organizations supporting veteran employment transitions. Documents $13B annual federal investment, fragmentation across 12 agencies, and lack of outcome data to measure effectiveness.",
    publishedDate: "2024"
  },
  {
    title: "Blockchains & the Future of Learning and Work",
    type: "Presentation",
    author: "Kristína Moss Gunnarsdóttir, Jobs for the Future",
    url: "/attached_assets/Day_3_Kristina_Moss_Gunnarsdottir_1767990688320.pdf",
    abstract: "Explores how blockchain technology can transform learning and work through self-sovereign, digitally verifiable records. Covers the Education Blockchain Initiative and Blockchain Innovation Challenge projects including the Lifelong Learner Project and Student1.",
    publishedDate: "2020-02-01"
  },
  {
    title: "Machine Learning Algorithm Cheat Sheet",
    type: "Reference Guide",
    author: "Microsoft Azure",
    url: "/attached_assets/azure-machine-learning-algorithm-cheat-sheet-july-2021_1767990688321.pdf",
    abstract: "Microsoft Azure reference guide for selecting appropriate machine learning algorithms. Covers text analytics, regression, clustering, recommenders, and classification approaches with decision guidance.",
    publishedDate: "2021-07-01"
  },
  {
    title: "Big Data, Big Gap: Working Towards a HIPAA Framework that Covers Big Data",
    type: "Law Journal Article",
    author: "Ryan Mueller, Indiana University Maurer School of Law",
    url: "/attached_assets/Big_Data_Big_Gap__Working_Towards_a_HIPAA_Framework_that_Cover_1767990688321.pdf",
    abstract: "Indiana Law Journal article exploring how HIPAA privacy protections fail to cover Big Data organizations collecting health information through wearables, mobile apps, and social media. Proposes amended framework borrowing from EU GDPR and Texas law.",
    publishedDate: "2022-01-01"
  },
  {
    title: "Employment Situation of Veterans — 2024",
    type: "Government Report",
    author: "U.S. Bureau of Labor Statistics",
    url: "/attached_assets/BLS_EMPLOYMENT_SITUATION_OF_VETERANS_2024_1767990688321.pdf",
    abstract: "Bureau of Labor Statistics annual report on veteran employment. Reports 3.0% unemployment rate for veterans vs 3.9% for nonveterans. Covers Gulf War-era II veterans, service-connected disability employment, and public sector employment trends.",
    publishedDate: "2025-03-20"
  },
  {
    title: "Credentialing Assistance Program MOA",
    type: "Policy Document",
    author: "Department of the Army",
    url: "/attached_assets/CA_MOA_Vendors_Final_22_Aug_23_1767990688321.pdf",
    abstract: "Memorandum of Agreement between Department of the Army and vendors for the Credentialing Assistance Program. Covers vendor requirements, eligibility, payment processes, and program administration for military credentialing.",
    publishedDate: "2023-08-22"
  },
  {
    title: "CAGE Code Quick Guide to Providing Ownership Details",
    type: "Reference Guide",
    author: "SAM.gov / GSA",
    url: "/attached_assets/CAGE_Code-_Quick_Guide_to_Providing_Ownership_Details_1767990688321.pdf",
    abstract: "SAM.gov quick start guide for providing CAGE ownership information as required by FAR Subpart 4.18. Covers immediate owner and highest-level owner reporting requirements for federal contracting.",
    publishedDate: "2014-11-01"
  },
  {
    title: "Campaign for an AI Ready Force",
    type: "DoD Report",
    author: "Defense Innovation Board",
    url: "/attached_assets/CAMPAIGN_FOR_AN_AI_READY_FORCE_1767990688322.pdf",
    abstract: "Defense Innovation Board report on transforming the DoD workforce for AI adoption. Defines AI Readiness across four pillars: people, data, technological infrastructure, and organizational design. Proposes three-phase campaign plan.",
    publishedDate: "2020-01-01"
  },
  {
    title: "Military Learner Transitions, Mobility, and Career Alignment in the Age of AI",
    type: "Conference Paper",
    author: "Robert E. McCoy, Indiana Wesleyan University",
    url: "/attached_assets/Career_Mobility_Clarity_(with_cover)_1767990688322.pdf",
    abstract: "Response to 2026 CCME Learner Track exploring the $14 billion paradox in military education investment vs transition outcomes. Addresses credential translation as the primary bottleneck in military career mobility.",
    publishedDate: "2026-01-01"
  },
  {
    title: "Career Choice Motivations of University Students",
    type: "Academic Research",
    author: "Heiko Haase & Arndt Lautenschläger, University of Applied Sciences Jena",
    url: "/attached_assets/career-choice-motivations-of-university-students-2zf7n7nli5_1767990688322.pdf",
    abstract: "Cross-sectional study of career choice motivations among 645 German university students. Identifies three main components: Status orientation, Self-realisation, and Self-determination. Published in International Journal of Business Administration.",
    publishedDate: "2011-02-01"
  },
  {
    title: "Big Data in Healthcare: Promises, Challenges and Opportunities",
    type: "Case Study",
    author: "Mohammad Adibuzzaman et al., Purdue University",
    url: "/attached_assets/Case_Study_1_-_Copy_1767990688322.pdf",
    abstract: "Research case study using MIMIC III database examining challenges in healthcare big data including data quality, accessibility, and translation to clinical practice. Addresses issues of small cohorts and temporal/process information gaps.",
    publishedDate: "2018-01-01"
  },
  {
    title: "College Credit for Military Training and Experiences",
    type: "Policy Brief",
    author: "American Council on Education",
    url: "/attached_assets/College-Credit-Military-Training_1767990688322.pdf",
    abstract: "Overview of DoD programs for translating military training into academic credit including MTEP, Joint Services Transcript, and ACE Military Guide. Reports 25,600+ military courses evaluated and $1 billion in tuition assistance savings.",
    publishedDate: "2024-01-01"
  },
  {
    title: "Connecting the Pieces: Benefits of Blockchain for Higher Education",
    type: "White Paper",
    author: "Charles Sanchez, American Council on Education",
    url: "/attached_assets/Connecting-the-Pieces-Benefits-of-Blockchain_1767990688323.pdf",
    abstract: "ACE paper on blockchain applications in higher education. Covers reducing administrative burden, promoting academic integrity, and pairing curricula with workforce needs. Illustrates student journey from high school through employment.",
    publishedDate: "2020-01-01"
  },
  {
    title: "Co-Tuning for Transfer Learning",
    type: "Technical Paper",
    author: "Kaichao You et al., Tsinghua University",
    url: "/attached_assets/co-tuning-for-transfer-learning-3lnk4lhivs_1767990688323.pdf",
    abstract: "NeurIPS 2020 paper proposing Co-Tuning framework for full transfer of pre-trained deep neural networks. Demonstrates up to 20% improvement over standard fine-tuning across visual and NLP classification tasks.",
    publishedDate: "2020-01-01"
  },
  {
    title: "Department of Defense Appropriations Bill, 2025",
    type: "Congressional Report",
    author: "House Committee on Appropriations",
    url: "/attached_assets/CRPT-118hrpt557_2025_congress_1767990688323.pdf",
    abstract: "House Report 118-557 accompanying H.R. 8774 for FY2025 Defense Appropriations. Covers military personnel, operations, procurement, R&D, and Defense Health Program funding recommendations.",
    publishedDate: "2024-06-17"
  },
  {
    title: "Data-efficient Performance Modeling via Pre-training",
    type: "Technical Paper",
    author: "Chunting Liu & Riyadh Baghdadi, NYU Abu Dhabi",
    url: "/attached_assets/data-efficient-performance-modeling-via-pre-training-554jyrtjd_1767990688323.pdf",
    abstract: "Research on using self-supervised pre-training with autoencoders to reduce labeled data requirements for DNN-based performance models. Achieves 5x reduction in data requirements for compiler optimization.",
    publishedDate: "2025-01-24"
  },
  {
    title: "Theodotion's Greek Text of Daniel: An Analysis of the Revisional Process and Its Semitic Source",
    type: "Book",
    author: "Daniel Olariu",
    url: "/attached_assets/9789004527881-front-1_1767990858674.pdf",
    abstract: "This monograph analyzes the relationship between the Hebrew-Aramaic text of Daniel and its Greek versions, examining the Theodotionic revision process and comparing it with the Old Greek translation.",
    publishedDate: "2023"
  },
  {
    title: "Big Data & Hadoop",
    type: "Book",
    author: "V.K. Jain",
    url: "/attached_assets/9789382609131_1767990858674.pdf",
    abstract: "Introduction to Big Data processing techniques addressing BI requirements including reporting, batch analytics, OLAP, data mining, warehousing, and predictive analytics using IBM's Platform of Hadoop framework.",
    publishedDate: "2025"
  },
  {
    title: "A Transition Course Supporting Student Veterans' Success",
    type: "Paper",
    author: "Caitlin O. Burnett",
    url: "/attached_assets/A_Transition_Course_Supporting_Student_Veterans_Success_1767990858675.pdf",
    abstract: "Master's project exploring challenges student veterans face transitioning from military service to college, proposing a Veteran Transition Course to support academic, personal, and professional development.",
    publishedDate: "April 2025"
  },
  {
    title: "Artificial Intelligence in APEC: Overview of the State of AI in APEC Economies",
    type: "Technical Report",
    author: "APEC Business Advisory Council",
    url: "/attached_assets/ABAC-AI-Report_1767990858675.pdf",
    abstract: "Report on AI implementation across APEC economies, examining AI frameworks, strategies, policy recommendations for building trust in AI, and preparing jobs and skills for AI transformations.",
    publishedDate: "2020"
  },
  {
    title: "Connected Impact: Unlocking Education and Workforce Opportunity Through Blockchain",
    type: "Technical Report",
    author: "Kerri Lemoie and Louis Soares",
    url: "/attached_assets/ACE-Education-Blockchain-Initiative-Connected-Impact-June2020_1767990858675.pdf",
    abstract: "Research report on blockchain technology's potential for education credentialing, digital identity, and workforce development, examining distributed ledger technology implementations.",
    publishedDate: "June 2020"
  },
  {
    title: "Responsible AI: DoD's Ethical Principles for AI - Reliable",
    type: "Technical Report",
    author: "Software Engineering Institute, Carnegie Mellon University",
    url: "/attached_assets/AD1156722_1767990858675.pdf",
    abstract: "Carnegie Mellon SEI presentation on DoD's ethical AI principles focusing on reliability: well-defined uses, safety, security, and effectiveness of AI capabilities across their lifecycle.",
    publishedDate: "2021"
  },
  {
    title: "DoD Responsible AI Strategy and Implementation Pathway",
    type: "Policy Document",
    author: "DoD Responsible AI Working Council",
    url: "/attached_assets/2024-06-RAI-STRATEGY-IMPLEMENTATION-PATHWAY_1767990858675.pdf",
    abstract: "Department of Defense strategic approach for operationalizing AI Ethical Principles through six foundational tenets: RAI Governance, Warfighter Trust, AI Lifecycle, Requirements Validation, Ecosystem, and Workforce.",
    publishedDate: "June 2022"
  },
  {
    title: "Task Force Lima Executive Summary: Generative AI in DoD",
    type: "Technical Report",
    author: "Office of the Chief Digital and Artificial Intelligence Officer",
    url: "/attached_assets/2024-12-TF_Lima-ExecSum-TAB-A_1767990858675.pdf",
    abstract: "Executive summary of Task Force Lima's findings on developing, evaluating, and recommending Generative AI capabilities including large language models across the Department of Defense.",
    publishedDate: "December 2024"
  },
  {
    title: "Closing the Gap: Upskilling and Reskilling in an AI Era",
    type: "Technical Report",
    author: "DeVry University",
    url: "/attached_assets/2024-devry-ai-report_1767990858675.pdf",
    abstract: "Annual report on the role of learning and development in the AI era, examining the gap between worker needs and employer training offerings, with focus on AI literacy disparities.",
    publishedDate: "2024"
  },
  {
    title: "The Path to Digital Identity in the United States",
    type: "Policy Document",
    author: "Ash Johnson",
    url: "/attached_assets/2024-us-digital-ids_1767990858676.pdf",
    abstract: "Analysis of digital identity trends in the US including mobile driver's licenses, federal efforts at national standards, and policy recommendations for achieving widespread digital ID adoption.",
    publishedDate: "September 2024"
  },
  {
    title: "Pretraining & Reinforcement Learning: Sharpening the Axe Before Cutting the Tree",
    type: "Paper",
    author: "Saurav Kadavath, Samuel Paradis, Brian Yao",
    url: "/attached_assets/2110.02497v1_1767990858676.pdf",
    abstract: "Research evaluating effectiveness of pretraining for RL tasks with and without distracting backgrounds, using publicly available datasets and self-supervised generated datasets.",
    publishedDate: "October 2021"
  },
  {
    title: "The Role of Pre-training Data in Transfer Learning",
    type: "Paper",
    author: "Rahim Entezari, Mitchell Wortsman, Olga Saukh, et al.",
    url: "/attached_assets/2302.13602v2_1767990858676.pdf",
    abstract: "Investigation of pre-training data distribution impact on few-shot and full fine-tuning performance using 3 pre-training methods, 7 pre-training datasets, and 9 downstream datasets.",
    publishedDate: "March 2023"
  },
  {
    title: "Beyond Interpretable Benchmarks: Contextual Learning through Cognitive and Multimodal Perception",
    type: "Paper",
    author: "Nick DiSanto",
    url: "/attached_assets/2304.00002v2_1767990858676.pdf",
    abstract: "Study questioning the Turing Test as criterion for general intelligence, emphasizing tacit learning as cornerstone of general-purpose intelligence and contextual cognitive attributes.",
    publishedDate: "2023"
  },
  {
    title: "On the Risk of Misinformation Pollution with Large Language Models",
    type: "Paper",
    author: "Yikang Pan, Liangming Pan, Wenhu Chen, et al.",
    url: "/attached_assets/2305.13661v2_1767990858676.pdf",
    abstract: "Investigation of LLM misuse potential for generating misinformation and its impact on Open-Domain Question Answering systems, proposing defense strategies including detection and vigilant prompting.",
    publishedDate: "October 2023"
  },
  {
    title: "Critical Biblical Studies via Word Frequency Analysis: Unveiling Text Authorship",
    type: "Paper",
    author: "Shira Faigenbaum-Golovin, Alon Kipnis, et al.",
    url: "/attached_assets/2410.19883v1_1767990858676.pdf",
    abstract: "Statistical analysis of word frequencies in biblical texts to differentiate between distinct authors across the first nine books of the Bible using Higher Criticism methodology.",
    publishedDate: "October 2024"
  },
  {
    title: "Generative AI and Human Capital: Augmenting Minds or Automating Skills?",
    type: "Paper",
    author: "Meiling Huang, Ming Jin, Ning Li",
    url: "/attached_assets/2412.03963v1_1767990858677.pdf",
    abstract: "Study examining how generative AI interacts with diverse forms of human capital in creative tasks, revealing that AI enhances general human capital while diminishing domain-specific expertise value.",
    publishedDate: "2024"
  },
  {
    title: "Improving Data Efficiency for LLM Reinforcement Fine-tuning Through Difficulty-targeted Online Data Selection and Rollout Replay",
    type: "Paper",
    author: "Yifan Sun, Jingyan Shen, Yibin Wang, et al.",
    url: "/attached_assets/2506.05316v1_1767990858677.pdf",
    abstract: "Techniques for improving data efficiency in LLM RL fine-tuning including difficulty-targeted online data selection and rollout replay mechanisms to reduce training time.",
    publishedDate: "June 2025"
  },
  {
    title: "Reshaping the Workforce: The Impact of AI, Automation, and Robotics on Labor Markets",
    type: "Paper",
    author: "Sylvia Erigbe",
    url: "/attached_assets/11881_1767990858677.pdf",
    abstract: "Qualitative exploration of how AI, automation, and robotics are reshaping labor markets, grounded in Automation Theory and Human Capital Theory with focus on ethical AI integration.",
    publishedDate: "July 2025"
  },
  {
    title: "DoD Directive 5105.89: Chief Digital and Artificial Intelligence Officer",
    type: "Policy Document",
    author: "Department of Defense",
    url: "/attached_assets/510589p_DoD_Directive_1767990858677.pdf",
    abstract: "Establishes responsibilities, functions, relationships, and authorities of the Chief Digital and AI Officer including serving as DoD's principal officer for accelerating AI adoption.",
    publishedDate: "November 2024"
  },
  {
    title: "Policy Intelligence Evidence",
    type: "Report",
    author: "Various",
    url: "/attached_assets/Policy_Intelligence_Evidence_1767991255341.pdf",
    abstract: "Policy intelligence and evidence-based research document examining policy analysis frameworks and evidence utilization in decision-making processes.",
    publishedDate: "2024-01-01"
  },
  {
    title: "PIE Field Kit - Scholar's Field Kit",
    type: "Guide",
    author: "Indiana Wesleyan University",
    url: "/attached_assets/PIE_Field_Kit_1767991255341.pdf",
    abstract: "Indiana Wesleyan University faculty resource guide covering course content issues, late policies, plagiarism protocols, grade submission, end-of-course surveys, student support through HOPE Dashboard, and technical support procedures for online instruction.",
    publishedDate: "2024-01-01"
  },
  {
    title: "The Origins of Our Universe - Physical Sciences Week 2",
    type: "Academic",
    author: "Michela Massimi and John Peacock",
    url: "/attached_assets/Physical_Sciences_Week_2_Slides_1767991255341.pdf",
    abstract: "MOOC lecture slides by Michela Massimi and John Peacock exploring cosmology history, the Big Bang, Hubble expansion, cosmic microwave background, and three philosophical problems for cosmology: laws of nature, uniqueness, and unobservability.",
    publishedDate: "2024-01-01"
  },
  {
    title: "The National Landscape of Credit for Prior Learning (CPL): Effective Policies for Success and Equity",
    type: "Report",
    author: "ACE and CAEL",
    url: "/attached_assets/PC.CreditforPriorLearning_1767991255342.pdf",
    abstract: "ACE and CAEL 50-state policy scan of credit for prior learning frameworks including standardized exams, portfolio assessment, ACE military credit recommendations, and institutional training review. Covers policy themes: transparency, military training, cost/affordability, transfer, transcription, and data tracking.",
    publishedDate: "2024-01-01"
  },
  {
    title: "Pathways to Opportunity: Financial Flexibility and Workforce Readiness",
    type: "Report",
    author: "Deborah Bradbard, Rosalinda Maury, Nicholas Armstrong - IVMF Syracuse University",
    url: "/attached_assets/PathwaystoOpportunity.FinancialFlexibilityandWorkforceReadines_1767991255342.pdf",
    abstract: "IVMF Syracuse University research on financial preparation as overlooked component of military transition. Examines financial readiness, flexibility, education, employment, debt, service-connected disabilities, and spouse unemployment impacts on veteran workforce outcomes.",
    publishedDate: "2016-12-01"
  },
  {
    title: "Post-Work: The Wages of Cybernation",
    type: "Book",
    author: "Stanley Aronowitz and Jonathan Cutler (eds.)",
    url: "/attached_assets/preview-9781135207366_A24422267_1767991255342.pdf",
    abstract: "Edited volume examining labor movement decline, technological unemployment, guaranteed income, welfare rights, computer concepts history, schooling to work transitions, and intellectual work in austerity culture. Includes Post-Work Manifesto and analysis of UPS Teamsters strike.",
    publishedDate: "1998-01-01"
  },
  {
    title: "Transforming US Military Education for the Agentic AI Era: A National Framework for Reskilling and Workforce Development",
    type: "Preprint",
    author: "Satyadhar Joshi",
    url: "/attached_assets/preprints202510.1034.v1_1767991255343.pdf",
    abstract: "Framework for military education transformation addressing agentic AI integration. Finds only 10-15% of military personnel feel adequately trained despite $600-900M AI investments. Proposes multi-tiered educational architecture with progressive competency levels and 24-36 month implementation timeline.",
    publishedDate: "2025-10-14"
  },
  {
    title: "Review of Artificial General Intelligence (AGI): Implications for the U.S. Workforce and Economic Stability",
    type: "Preprint",
    author: "Satyadhar Joshi",
    url: "/attached_assets/preprints202506.0168.v3_1767991255343.pdf",
    abstract: "Systematic review of 40+ sources examining AGI impacts on workforce dynamics including job displacement risks, emerging employment paradigms, wage dynamics, reskilling needs, and ethical considerations. Synthesizes perspectives on how AGI could reshape employment landscapes.",
    publishedDate: "2025-06-17"
  },
  {
    title: "Potential Labor Market Impacts of Artificial Intelligence: An Empirical Analysis",
    type: "Report",
    author: "Council of Economic Advisers",
    url: "/attached_assets/Potential-Labor-Market-Impacts-of-Artificial-Intelligence-An-E_1767991255343.pdf",
    abstract: "Council of Economic Advisers (CEA) empirical analysis of AI labor market impacts using task-based polarization framework. Develops AI exposure measure and identifies potentially AI-vulnerable occupations based on exposure levels and job performance requirements. Examines worker transitions and adaptation patterns.",
    publishedDate: "2024-01-01"
  },
  {
    title: "Theorizing Military Student Transitions in U.S. Higher Education",
    type: "Academic",
    author: "Various Authors",
    url: "/attached_assets/No_Author_but_Good_Ref_Material_1767991279694.pdf",
    abstract: "Theory paper proposing military identity hybridization as key process for veteran transition success. Challenges conventional 'transition' framing, arguing military students engage in complex identity negotiation blending military and civilian professional identities. Reviews Schlossberg's transition theory, Military Transition Theory, and Turner's Theory of Liminality.",
    publishedDate: "2024-01-01"
  },
  {
    title: "Army Credentialing Assistance (CA) Program - New Vendor Process",
    type: "Guide",
    author: "Army University, Fort Knox",
    url: "/attached_assets/New_Vendor_CA_Program_Process_May_2025_1767991279695.pdf",
    abstract: "Army Credentialing Assistance Program Office (ACAPO) vendor onboarding guide. Explains CA funding ($2000/year for credentials), Army COOL credential repository, AI Portal for vendors, and ArmyIgnitED platform for Soldier requests. Covers CAGE code requirements and MOA process.",
    publishedDate: "2025-05-01"
  },
  {
    title: "A Blockchain Framework for Academic Certificates Authentication",
    type: "Academic",
    author: "Ruqaya Abdelmagid, Mohamed Abdelsalam, Fahad Kamal Alsheref",
    url: "/attached_assets/Paper_29-A_Blockchain_Framework_for_Academic_Certificates_1767991279693.pdf",
    abstract: "Proposes Hyperledger Fabric blockchain framework to solve academic certificate fraud. Addresses credential tampering through immutable ledger, consensus mechanisms, and decentralized verification. References MIT Blockcert and Slovenia EDUCTX implementations.",
    publishedDate: "2024-07-01"
  },
  {
    title: "Navigating the Legal Framework: Implementing Government-Backed Digital Identity in the United States",
    type: "Academic",
    author: "Brooke Norton",
    url: "/attached_assets/navigating-the-legal-framework-implementing-a-government-backe_1767991279695.pdf",
    abstract: "Jurimetrics analysis of legal framework for government-backed digital identity (eID) in the United States. Examines privacy concerns, ACLU opposition, Tenth Amendment federalism issues, and state mobile driver's license (mDL) implementations. Compares EU digital wallet initiative and Estonia e-Residency program.",
    publishedDate: "2024-01-01"
  },
  {
    title: "Attention Is All You Need",
    type: "Academic",
    author: "Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin - Google Brain",
    url: "/attached_assets/NIPS-2017-attention-is-all-you-need-Paper_1767991279694.pdf",
    abstract: "Foundational paper introducing the Transformer architecture, dispensing with recurrence and convolutions entirely in favor of attention mechanisms. Achieved 28.4 BLEU on WMT 2014 English-to-German translation. Basis for GPT, BERT, and modern large language models.",
    publishedDate: "2017-01-01"
  },
  {
    title: "Big Data and Black-Box Medical Algorithms",
    type: "Academic",
    author: "W. Nicholson Price II - University of Michigan Law School",
    url: "/attached_assets/nihms-1005784_1767991279695.pdf",
    abstract: "Science Translational Medicine analysis of machine-learning algorithms entering medical practice. Addresses opacity and plasticity of black-box algorithms, challenges in validation, regulatory considerations, and integration into clinical practice. Discusses need for computational validation approaches.",
    publishedDate: "2018-12-12"
  },
  {
    title: "Blockchain Technology in the Department of Defense",
    type: "Thesis",
    author: "Capt. Teresa G. Doskey and Capt. Stacylee Johnson, USAF",
    url: "/attached_assets/NPS-LM-19-024_1767991279694.pdf",
    abstract: "Naval Postgraduate School MBA thesis examining blockchain implementation for DoD acquisitions. Reviews GAO high-risk areas in weapons systems acquisition and supply chain management. Analyzes private sector blockchain implementations at Maersk, Walmart, and Big Four accounting firms for DoD applicability.",
    publishedDate: "2018-12-01"
  },
  {
    title: "FY2026 National Defense Authorization Act Executive Summary",
    type: "Policy",
    author: "U.S. Congress",
    url: "/attached_assets/passage_fy26_ndaa_executive_summary_1767991279693.pdf",
    abstract: "PASSAGE Act summary of FY2026 NDAA authorizing $900.6B for national defense. Covers Pentagon reform for efficiency and reindustrialization, Indo-Pacific deterrence, European security assistance, Middle East cooperation, counter-UAS capabilities, and AI investments. Establishes Baltic Security Initiative.",
    publishedDate: "2025-01-01"
  },
  {
    title: "Computational Linguistic Analysis of the Biblical Text",
    type: "Academic",
    author: "Willem Th. van Peursen",
    url: "/attached_assets/obp.0358.05_1767991279694.pdf",
    abstract: "Chapter from \"Linguistic Theory and the Biblical Text\" examining application of computational linguistics to biblical Hebrew. Reviews ETCBC, Andersen-Forbes, and Westminster databases. Discusses evolution from 1970s text processing to modern digital humanities approaches.",
    publishedDate: "2023-01-01"
  }
];

async function ensureTablesExist() {
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS frameworks (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS compliance_items (
      id SERIAL PRIMARY KEY,
      framework_id INTEGER NOT NULL,
      requirement TEXT NOT NULL,
      design_choice TEXT NOT NULL,
      strategic_advantage TEXT NOT NULL,
      status TEXT NOT NULL,
      tags TEXT[]
    );
    
    CREATE TABLE IF NOT EXISTS publications (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT,
      abstract TEXT,
      author TEXT,
      published_date TEXT
    );
  `;
  
  await pool.query(createTablesSQL);
  console.log("Database tables verified/created.");
}

export async function seedDatabase() {
  try {
    console.log("Ensuring database tables exist...");
    await ensureTablesExist();
    
    console.log("Checking database for publications...");
    const existingCount = await db.select({ count: sql<number>`count(*)` }).from(publications);
    const count = Number(existingCount[0]?.count || 0);
    
    // Seed if database has fewer publications than our seed list
    const expectedMinimum = seedPublications.length;
    if (count < expectedMinimum) {
      console.log(`Database has ${count} publications, expected at least ${expectedMinimum}. Adding missing publications...`);
      
      // Get existing titles to avoid duplicates
      const existing = await db.select({ title: publications.title }).from(publications);
      const existingTitles = new Set(existing.map(p => p.title));
      
      // Filter to only new publications
      const newPublications = seedPublications.filter(p => !existingTitles.has(p.title));
      
      if (newPublications.length > 0) {
        await db.insert(publications).values(newPublications);
        console.log(`Added ${newPublications.length} new publications.`);
      } else {
        console.log("No new publications to add.");
      }
    } else {
      console.log(`Database has ${count} publications, seed complete.`);
    }
  } catch (error: any) {
    console.error("Error seeding database:", error?.message || error);
  }
}

export { seedPublications };
