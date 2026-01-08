import { db } from "./db";
import { publications } from "@shared/schema";
import { sql } from "drizzle-orm";

const seedPublications = [
  {
    title: "Compliance Framework for Generative AI (CMGF)",
    type: "Paper",
    author: "Lead Researcher",
    url: "/attached_assets/Career_Mobility_2026__CCME_1767731035930.docx",
    abstract: "Primary CMGF framework document for military-to-civilian career mobility governance.",
    publishedDate: "2026"
  },
  {
    title: "Workforce Readiness Alignment: The Relationship Between Job Preferences, Retention, and Earnings",
    type: "Paper",
    author: "Rosalinda V. Maury, Brice M. Stone, Deborah A. Bradbard, Nicholas J. Armstrong, J. Michael Haynie - IVMF Syracuse University",
    url: "/attached_assets/WORKFORCE-READINESS-ALIGNMENT_1767730175328.pdf",
    abstract: "Research on workforce readiness alignment and its impact on veteran employment outcomes.",
    publishedDate: "2024"
  },
  {
    title: "Skill Shift: Automation and the Future of the Workforce",
    type: "Paper",
    author: "McKinsey Global Institute - Jacques Bughin, Eric Hazan, Susan Lund, Peter Dahlström, Anna Wiesinger, Amresh Subramaniam",
    url: "/attached_assets/mgi-skill-shift-automation-and-future-of-the-workforce-in-brie_1767730185939.pdf",
    abstract: "Analysis of automation's impact on workforce skills and future employment trends.",
    publishedDate: "2024"
  },
  {
    title: "Completing the Mission: Best Practices for Recruiting and Hiring Veterans",
    type: "Paper",
    author: "SHRM and SHRM Foundation with USAA",
    url: "/attached_assets/Research_SHRM_Research_Report_on_Recruiting_and_Hiring_Veteran_1767730185940.pdf",
    abstract: "Best practices guide for organizations recruiting and hiring military veterans.",
    publishedDate: "2024"
  },
  {
    title: "Revisiting the Business Case for Hiring a Veteran: A Strategy for Cultivating Competitive Advantage",
    type: "Paper",
    author: "J. Michael Haynie, Ph.D. - IVMF Syracuse University",
    url: "/attached_assets/Revisiting-the-Business-Case_Workforce-Readiness_Full-Report_1767730185940.pdf",
    abstract: "Strategic analysis of competitive advantages gained through veteran hiring practices.",
    publishedDate: "2024"
  },
  {
    title: "The Evolving Landscape of Workplace Competencies: A Synthesis of Knowledge, Skills, and Abilities for the Digital Age",
    type: "Technical Report",
    author: "Digital Transformation Research",
    url: "/attached_assets/The_Evolving_Landscape_of_Workplace_Competencies_1767730185940.docx",
    abstract: "Synthesis of evolving workplace competency requirements in the digital transformation era.",
    publishedDate: "2024"
  },
  {
    title: "2025 Workplace Trends",
    type: "Paper",
    author: "ATD - Association for Talent Development",
    url: "/attached_assets/trends-2025-ebook-1611641012_1767730185940.pdf",
    abstract: "Analysis of emerging workplace trends and their implications for workforce development.",
    publishedDate: "2025"
  },
  {
    title: "Work After Service: Developing Workforce Readiness and Veteran Talent for the Future",
    type: "Paper",
    author: "Deborah A. Bradbard, Nicholas J. Armstrong, Rosalinda Maury - IVMF Syracuse University",
    url: "/attached_assets/WORK-AFTER-SERVICE-Developing-Workforce-Readiness-and-Veteran-_1767730185941.pdf",
    abstract: "Research on developing workforce readiness programs for transitioning veterans.",
    publishedDate: "2024"
  },
  {
    title: "Employment Situation of Veterans - 2024",
    type: "Technical Report",
    author: "U.S. Bureau of Labor Statistics",
    url: "/attached_assets/BLS_EMPLOYMENT_SITUATION_OF_VETERANS_2024_1767730198439.pdf",
    abstract: "Official Bureau of Labor Statistics report on veteran employment data and trends.",
    publishedDate: "2024"
  },
  {
    title: "AI in the Workplace 2025: Understanding Industry Needs",
    type: "Paper",
    author: "Digital Education Council with GFTN",
    url: "/attached_assets/Digital_Education_Council_-_AI_in_the_Workplace_2025_1767730198440.pdf",
    abstract: "Industry analysis of AI integration in workplace environments and skill requirements.",
    publishedDate: "2025"
  },
  {
    title: "Military and Veteran Support: DOD Steps to Help Servicemembers Transfer Skills to Civilian Employment",
    type: "Technical Report",
    author: "U.S. Government Accountability Office",
    url: "/attached_assets/gao-22-105261_1767730198440.pdf",
    abstract: "GAO report on DoD initiatives supporting military-to-civilian skill transfer.",
    publishedDate: "2022"
  },
  {
    title: "Market Trend Analysis as a Strategic Tool for Workforce Development Programs",
    type: "Paper",
    author: "Daphine Nyangoma, Ejuma Martha Adaga, Ngodoo Joy Sam-Bulya, Godwin Ozoemenam Achumie",
    url: "/attached_assets/Market_Trend_Analysis_as_a_Strategic_Tool_for_Work_1767730198440.pdf",
    abstract: "Strategic framework for using market trend analysis in workforce development.",
    publishedDate: "2024"
  },
  {
    title: "Automation and the Workforce of the Future",
    type: "Paper",
    author: "McKinsey Global Institute",
    url: "/attached_assets/Automation_and_the_workforce_of_the_future___McKinsey_1767730198440.pdf",
    abstract: "McKinsey analysis of automation trends and future workforce implications.",
    publishedDate: "2024"
  },
  {
    title: "The 2024 Army Force Structure Transformation Initiative",
    type: "Technical Report",
    author: "Andrew Feickert, Congressional Research Service",
    url: "/attached_assets/The_2024_Army_Force_Structure_1767730521233.pdf",
    abstract: "Congressional Research Service analysis of Army force structure changes.",
    publishedDate: "2024"
  },
  {
    title: "DoD Strategic Management Plan FY 2022-2026",
    type: "Technical Report",
    author: "Department of Defense",
    url: "/attached_assets/DOD_Strategic_Management_Plan_2024_1767730524783.pdf",
    abstract: "Department of Defense strategic management planning document.",
    publishedDate: "2024"
  },
  {
    title: "2025 Value of IT Certification Candidate Report",
    type: "Publication",
    author: "Pearson VUE",
    url: "/attached_assets/pearson-vue-2025-value-of-certification-report_1767730548547.pdf",
    abstract: "Analysis of IT certification value and labor market demand.",
    publishedDate: "2025"
  },
  {
    title: "Revised Criteria for Accreditation and Assumed Practices",
    type: "Technical Report",
    author: "Higher Learning Commission",
    url: "/attached_assets/AdoptedPolicy-Criteria_2024-06_POL_1767730548547.pdf",
    abstract: "Updated accreditation criteria and standards from Higher Learning Commission.",
    publishedDate: "2024"
  },
  {
    title: "Counting U.S. Postsecondary and Secondary Credentials 2022",
    type: "Publication",
    author: "Credential Engine",
    url: "/attached_assets/Final-CountingCredentials_2022_1767730548547.pdf",
    abstract: "Comprehensive count and analysis of U.S. postsecondary credentials.",
    publishedDate: "2022"
  },
  {
    title: "Informing Improved Recognition of Military Learning",
    type: "Paper",
    author: "American Institutes for Research",
    url: "/attached_assets/Informing-Improved-Recognition-of-Military-Learning-Postsecond_1767730548548.pdf",
    abstract: "Research on improving recognition of military learning in postsecondary education.",
    publishedDate: "2024"
  },
  {
    title: "Build America: Empowering Military Learners for Future Success",
    type: "Technical Report",
    author: "American Council on Education",
    url: "/attached_assets/Lilly-Endowment-Report_1767730548548.pdf",
    abstract: "ACE report on empowering military learners through credit for prior learning.",
    publishedDate: "2024"
  },
  {
    title: "Presenting a Holistic Student Veteran Advising Model",
    type: "Paper",
    author: "Phillip Morris, University of Colorado Colorado Springs",
    url: "/attached_assets/National_Resouce_Center_Phillip_Morris_Presenting_a_Holistic_S_1767730548548.pdf",
    abstract: "Framework for holistic advising approaches for student veterans.",
    publishedDate: "2024"
  },
  {
    title: "The National Landscape of Credit for Prior Learning (CPL)",
    type: "Publication",
    author: "CAEL and American Council on Education",
    url: "/attached_assets/PC.CreditforPriorLearning_1767730548549.pdf",
    abstract: "National analysis of credit for prior learning policies and practices.",
    publishedDate: "2024"
  },
  {
    title: "You Cannot Handle the Truth: The Effects of the Post-9/11 GI Bill on Higher Education and Earnings",
    type: "Paper",
    author: "Andrew Barr, Laura Kawano, Bruce Sacerdote, William Skimmyhorn, Michael Stevens",
    url: "/attached_assets/YOU_CAN'T_HANDLE_THE_TRUTH_Barr_1767730553482.pdf",
    abstract: "NBER research on economic effects of the Post-9/11 GI Bill.",
    publishedDate: "2024"
  },
  {
    title: "Are Current Military Education Benefits Efficient and Effective for the Services?",
    type: "Technical Report",
    author: "Jennie W. Wenger, Trey Miller, Matthew D. Baird, et al., RAND Corporation",
    url: "/attached_assets/RAND_RR1766_1767730565983.pdf",
    abstract: "RAND analysis of military education benefit efficiency and effectiveness.",
    publishedDate: "2024"
  },
  {
    title: "Army Credentialing Assistance Program Process Guide",
    type: "Technical Report",
    author: "Army Credentialing Assistance Program Office (ACAPO)",
    url: "/attached_assets/Soldier_CA_Process_Guide_Policy_COOL_Goals_Feb_2025_1767730565983.pdf",
    abstract: "Official process guide for Army Credentialing Assistance Program.",
    publishedDate: "2025"
  },
  {
    title: "Credit Mobility Strategies in Action",
    type: "Publication",
    author: "Kyle Gray, Betsy Mueller, Emily Tichenor, Madeline Trimble, Ithaka S+R",
    url: "/attached_assets/SR-Report-Credit-Mobility-Strategies-in-Action-022725_1767730565983.pdf",
    abstract: "Case studies on credit mobility strategies in higher education.",
    publishedDate: "2025"
  },
  {
    title: "The Next Era of Assessment: A Global Review of AI in Assessment Design",
    type: "Publication",
    author: "Digital Education Council and Pearson",
    url: "/attached_assets/The_Next_Era_of_Assessment_1767730565983.pdf",
    abstract: "Global review of AI integration in educational assessment design.",
    publishedDate: "2025"
  },
  {
    title: "The Broken Path: Redrawing Veteran Success",
    type: "Paper",
    author: "Unknown",
    url: "/attached_assets/The_Broken_Path_Redrawing_Veteran_Success_1767730565982.pdf",
    abstract: "Analysis of barriers to veteran success and pathways for improvement.",
    publishedDate: "2024"
  },
  {
    title: "Military Learner Mobility and Career Alignment: The Future Is Now",
    type: "Technical Report",
    author: "CCME 2026 Learner Track",
    url: "/attached_assets/CCME_2026_1767730819889.pdf",
    abstract: "CCME 2026 presentation on military learner mobility and career alignment strategies.",
    publishedDate: "2026"
  },
  {
    title: "A Governed, Human-in-the-Loop AI Framework for Military Career Mobility: Design, Constraints, and Ethical Tradeoffs",
    type: "Paper",
    author: "Robert E. McCoy MBA, M.S. AI & Data Analytics, Indiana Wesleyan University",
    url: "/attached_assets/Career_Mobility_2026__CCME_1767731035930.docx",
    abstract: "Primary CMGF paper presenting a bounded AI architecture for military career mobility with human oversight.",
    publishedDate: "2026"
  },
  {
    title: "Artificial Intelligence: DOD Should Improve Strategies, Inventory Process, and Collaboration Guidance",
    type: "Technical Report",
    author: "Government Accountability Office",
    url: "/attached_assets/gao-22-105834_1767732168996.pdf",
    abstract: "GAO report on improving DoD AI strategies and implementation guidance.",
    publishedDate: "2022"
  },
  {
    title: "DEC AI Literacy Framework",
    type: "Technical Report",
    author: "Digital Education Council",
    url: "/attached_assets/DEC_AI_Literacy_Framework_1767732172309.pdf",
    abstract: "Framework for AI literacy standards in educational contexts.",
    publishedDate: "2025"
  },
  {
    title: "U.S. Demand for AI Certifications: Promise or Hype?",
    type: "Paper",
    author: "Center for Security and Emerging Technology",
    url: "/attached_assets/CSET-U.S.-Demand-for-AI-Certifications_1767732177823.pdf",
    abstract: "Analysis of labor market demand for AI certifications and credentials.",
    publishedDate: "2024"
  },
  {
    title: "The Federal Government in the Age of Artificial Intelligence",
    type: "Paper",
    author: "Yll Bajraktari",
    url: "/attached_assets/Bajraktari-Written-Testimony_1767732182190.pdf",
    abstract: "Congressional testimony on federal government AI adoption and policy.",
    publishedDate: "2024"
  },
  {
    title: "Army CIO Guidance on Generative AI and Large Language Models",
    type: "Technical Report",
    author: "Department of the Army",
    url: "/attached_assets/ARN41285-PPM_CIO-024-000-WEB-1_1767732187290.pdf",
    abstract: "Official Army guidance on use of generative AI and large language models.",
    publishedDate: "2024"
  }
];

export async function seedDatabase() {
  try {
    const existingCount = await db.select({ count: sql<number>`count(*)` }).from(publications);
    const count = Number(existingCount[0]?.count || 0);
    
    if (count === 0) {
      console.log("Database empty, seeding publications...");
      await db.insert(publications).values(seedPublications);
      console.log(`Seeded ${seedPublications.length} publications successfully.`);
    } else {
      console.log(`Database already has ${count} publications, skipping seed.`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
