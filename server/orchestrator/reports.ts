import { db } from "../db";
import { generatedReports } from "@shared/schema";
import type { ScenarioResult } from "./engine";

function getStatusColor(status: string): string {
  switch (status) {
    case "green": return "#22c55e";
    case "yellow": return "#eab308";
    case "red": return "#ef4444";
    default: return "#94a3b8";
  }
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case "green": return "●";
    case "yellow": return "●";
    case "red": return "●";
    default: return "○";
  }
}

const GOVERNANCE_FOOTER = `
<div style="margin-top: 32px; padding: 16px; border-top: 2px solid #334155; background: #0f172a; border-radius: 0 0 8px 8px;">
  <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.6;">
    <strong style="color: #60a5fa;">CMGF v1.0 | Deterministic Rules Engine</strong><br/>
    AI explains. Rules decide. All outputs are deterministic and auditable.<br/>
    Human advisor review is required before any action is taken on this analysis.<br/>
    Data sources: Army COOL Policy, DoD TA Policy, O*NET, BLS, IPPS-A, JST<br/>
    © 2026 Career Mobility Governance Framework — Robert McCoy
  </p>
</div>`;

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #020617; color: #e2e8f0; padding: 24px; }
    .report { max-width: 800px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; }
    .header { padding: 24px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 1px solid #334155; }
    .header h1 { font-size: 20px; color: #f1f5f9; margin-bottom: 4px; }
    .header .subtitle { font-size: 13px; color: #94a3b8; }
    .header .id { font-size: 11px; color: #60a5fa; font-family: monospace; margin-top: 8px; }
    .section { padding: 20px 24px; border-bottom: 1px solid #1e293b; }
    .section h2 { font-size: 15px; color: #93c5fd; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .section h3 { font-size: 14px; color: #cbd5e1; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { background: #1e293b; border-radius: 6px; padding: 12px; }
    .card .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .card .value { font-size: 16px; font-weight: 600; margin-top: 4px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge-green { background: #052e16; color: #22c55e; }
    .badge-yellow { background: #422006; color: #eab308; }
    .badge-red { background: #450a0a; color: #ef4444; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 8px 12px; font-size: 11px; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #334155; }
    td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #1e293b; }
    .risk-high { color: #ef4444; }
    .risk-medium { color: #eab308; }
    .risk-low { color: #22c55e; }
    ul { padding-left: 20px; }
    li { font-size: 13px; margin-bottom: 6px; line-height: 1.5; }
    @media print { body { background: white; color: black; } .report { border: 1px solid #ccc; } }
  </style>
</head>
<body>
  <div class="report">
    ${body}
    ${GOVERNANCE_FOOTER}
  </div>
</body>
</html>`;
}

export async function generatePathwayReport(scenario: ScenarioResult): Promise<{ id: number; html: string }> {
  const { profile, inputs, outputs, visualData, governanceMetadata } = scenario;

  const readinessRows = outputs.readinessMeasures.map(r => `
    <tr>
      <td><span style="color: ${getStatusColor(r.status)}; font-weight: 600;">${getStatusEmoji(r.status)} ${r.dimension}</span></td>
      <td><span class="badge badge-${r.status}">${r.label}</span></td>
      <td style="font-size: 12px; color: #94a3b8;">${r.detail}</td>
    </tr>
  `).join("");

  const pathwayRows = outputs.pathwayOptions.map(p => `
    <tr>
      <td style="font-weight: 500;">${p.name}</td>
      <td><span class="badge badge-green">${p.match}</span></td>
      <td>${p.timeframe}</td>
    </tr>
  `).join("");

  const riskItems = outputs.constraintRisks.map(r => `
    <li><span class="risk-${r.severity}" style="font-weight: 600;">[${r.severity.toUpperCase()}]</span> ${r.label}: ${r.detail}</li>
  `).join("");

  const policyItems = outputs.policyFriction.map(p => `
    <li><strong>${p.framework}:</strong> ${p.point}</li>
  `).join("");

  const resourceItems = outputs.resourcesRequired.map(r => `
    <tr><td>${r.resource}</td><td><span class="badge badge-${r.status.includes("Self") ? "yellow" : "green"}">${r.status}</span></td></tr>
  `).join("");

  const body = `
    <div class="header">
      <h1>Service Member Pathway Report</h1>
      <div class="subtitle">${profile.name} — ${inputs.rank} | ${inputs.mosLabel} → ${inputs.goalLabel}</div>
      <div class="id">Scenario: ${scenario.scenarioId} | Generated: ${governanceMetadata.timestamp}</div>
    </div>

    <div class="section">
      <h2>Profile Summary</h2>
      <div class="grid">
        <div class="card"><div class="label">Rank</div><div class="value">${inputs.rank}</div></div>
        <div class="card"><div class="label">Years of Service</div><div class="value">${inputs.yearsOfService}</div></div>
        <div class="card"><div class="label">Current MOS</div><div class="value">${inputs.mosLabel}</div></div>
        <div class="card"><div class="label">Career Goal</div><div class="value">${inputs.goalLabel}</div></div>
        <div class="card"><div class="label">Credits</div><div class="value">${profile.credits || 0}</div></div>
        <div class="card"><div class="label">Clearance</div><div class="value">${profile.clearanceLevel || "None"}</div></div>
        <div class="card"><div class="label">Overall Feasibility</div><div class="value" style="color: ${visualData.overallFeasibility === "High" ? "#22c55e" : visualData.overallFeasibility === "Moderate" ? "#eab308" : "#ef4444"}">${visualData.overallFeasibility}</div></div>
        <div class="card"><div class="label">Data Completeness</div><div class="value">${visualData.dataCompleteness}%</div></div>
      </div>
    </div>

    <div class="section">
      <h2>Readiness Assessment</h2>
      <table>${readinessRows}</table>
    </div>

    <div class="section">
      <h2>Pathway Options</h2>
      <table>
        <tr><th>Pathway</th><th>Match</th><th>Timeframe</th></tr>
        ${pathwayRows}
      </table>
      <p style="margin-top: 12px; font-size: 13px; color: #94a3b8;"><strong>Timeline Range:</strong> ${outputs.timelineRange}</p>
    </div>

    <div class="section">
      <h2>Constraint Analysis</h2>
      <ul>${riskItems}</ul>
    </div>

    <div class="section">
      <h2>Policy Friction Points</h2>
      <ul>${policyItems}</ul>
    </div>

    <div class="section">
      <h2>Resources Required</h2>
      <table>
        <tr><th>Resource</th><th>Funding Status</th></tr>
        ${resourceItems}
      </table>
    </div>

    ${outputs.specialConsiderations.length > 0 ? `
    <div class="section">
      <h2>Special Considerations</h2>
      <ul>${outputs.specialConsiderations.map(s => `<li>${s}</li>`).join("")}</ul>
    </div>` : ""}

    ${(inputs.constraints || []).length > 0 ? `
    <div class="section">
      <h2>Missing Data / Flags</h2>
      <ul>${inputs.constraints.map(c => `<li style="color: #eab308;">Active constraint: ${c.replace(/_/g, " ")}</li>`).join("")}</ul>
    </div>` : ""}
  `;

  const title = `Pathway Report — ${profile.name}`;
  const html = wrapHtml(title, body);

  const [report] = await db.insert(generatedReports).values({
    scenarioRunId: scenario.scenarioId ? undefined : undefined,
    reportType: "pathway",
    title,
    content: JSON.stringify({ scenarioId: scenario.scenarioId, profileName: profile.name }),
    htmlContent: html,
  }).returning();

  return { id: report.id, html };
}

export async function generateESOSummary(scenario: ScenarioResult): Promise<{ id: number; html: string }> {
  const { profile, inputs, outputs, visualData, governanceMetadata } = scenario;

  const readinessGrid = outputs.readinessMeasures.map(r => `
    <div class="card">
      <div class="label">${r.dimension}</div>
      <div class="value" style="color: ${getStatusColor(r.status)}">${r.label}</div>
    </div>
  `).join("");

  const topPathway = outputs.pathwayOptions[0];
  const highRisks = outputs.constraintRisks.filter(r => r.severity === "high");

  const body = `
    <div class="header">
      <h1>ESO Advisory Summary</h1>
      <div class="subtitle">Education Service Officer Quick Reference</div>
      <div class="id">Scenario: ${scenario.scenarioId} | ${governanceMetadata.timestamp}</div>
    </div>

    <div class="section">
      <h2>Service Member Overview</h2>
      <div class="grid">
        <div class="card"><div class="label">Name</div><div class="value">${profile.name}</div></div>
        <div class="card"><div class="label">Rank / YOS</div><div class="value">${inputs.rank} / ${inputs.yearsOfService} yrs</div></div>
        <div class="card"><div class="label">Transition</div><div class="value">${inputs.mosLabel} → ${inputs.goalLabel}</div></div>
        <div class="card"><div class="label">Feasibility</div><div class="value" style="color: ${visualData.overallFeasibility === "High" ? "#22c55e" : "#eab308"}">${visualData.overallFeasibility}</div></div>
      </div>
    </div>

    <div class="section">
      <h2>Readiness Snapshot</h2>
      <div class="grid">${readinessGrid}</div>
    </div>

    <div class="section">
      <h2>Recommended Action</h2>
      <div class="card" style="background: #172554; border: 1px solid #1d4ed8;">
        <div class="label">Top Pathway</div>
        <div class="value" style="color: #93c5fd;">${topPathway?.name || "Assessment needed"}</div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Match: ${topPathway?.match || "N/A"} | Timeframe: ${topPathway?.timeframe || "N/A"}</p>
      </div>
    </div>

    ${highRisks.length > 0 ? `
    <div class="section">
      <h2>Attention Required</h2>
      <ul>${highRisks.map(r => `<li class="risk-high"><strong>${r.label}:</strong> ${r.detail}</li>`).join("")}</ul>
    </div>` : ""}

    <div class="section">
      <h2>ESO Action Items</h2>
      <ul>
        <li>Review readiness assessment with service member</li>
        <li>Verify credential funding eligibility (CA/TA status)</li>
        <li>Confirm timeline against ETS date</li>
        <li>Document advisory session in CMGF system</li>
      </ul>
    </div>
  `;

  const title = `ESO Summary — ${profile.name}`;
  const html = wrapHtml(title, body);

  const [report] = await db.insert(generatedReports).values({
    reportType: "eso_summary",
    title,
    content: JSON.stringify({ scenarioId: scenario.scenarioId }),
    htmlContent: html,
  }).returning();

  return { id: report.id, html };
}

export async function generateLeadershipBrief(scenario: ScenarioResult): Promise<{ id: number; html: string }> {
  const { profile, inputs, outputs, visualData, governanceMetadata } = scenario;

  const body = `
    <div class="header">
      <h1>Leadership Brief Snapshot</h1>
      <div class="subtitle">Installation Commander Quick Reference</div>
      <div class="id">Scenario: ${scenario.scenarioId} | ${governanceMetadata.timestamp}</div>
    </div>

    <div class="section">
      <h2>Executive Summary</h2>
      <div class="grid">
        <div class="card"><div class="label">Transition Type</div><div class="value" style="font-size: 14px;">${inputs.mosLabel} → ${inputs.goalLabel}</div></div>
        <div class="card"><div class="label">Overall Assessment</div><div class="value" style="color: ${visualData.overallFeasibility === "High" ? "#22c55e" : visualData.overallFeasibility === "Moderate" ? "#eab308" : "#ef4444"}">${visualData.overallFeasibility} Feasibility</div></div>
        <div class="card"><div class="label">Pathways Available</div><div class="value">${visualData.pathwayCount}</div></div>
        <div class="card"><div class="label">High-Risk Constraints</div><div class="value" style="color: ${visualData.highRiskCount > 0 ? "#ef4444" : "#22c55e"}">${visualData.highRiskCount}</div></div>
      </div>
    </div>

    <div class="section">
      <h2>Key Findings</h2>
      <ul>
        <li><strong>Domain Alignment:</strong> ${outputs.readinessMeasures.find(r => r.dimension === "Domain Alignment")?.label || "N/A"} — ${outputs.readinessMeasures.find(r => r.dimension === "Domain Alignment")?.detail || ""}</li>
        <li><strong>Timeline:</strong> ${outputs.timelineRange}</li>
        <li><strong>Funding:</strong> ${outputs.resourcesRequired.filter(r => r.status.includes("eligible")).length} of ${outputs.resourcesRequired.length} resources have identified funding sources</li>
      </ul>
    </div>

    <div class="section">
      <h2>Resource Implication</h2>
      <p style="font-size: 13px; line-height: 1.6;">
        This transition requires ESO advisory support and credential coordination. 
        ${visualData.highRiskCount > 0 ? `There are ${visualData.highRiskCount} high-risk constraints that require command awareness.` : "No high-risk constraints identified."}
        Data completeness is at ${visualData.dataCompleteness}%.
      </p>
    </div>
  `;

  const title = `Leadership Brief — ${inputs.mosLabel} → ${inputs.goalLabel}`;
  const html = wrapHtml(title, body);

  const [report] = await db.insert(generatedReports).values({
    reportType: "leadership_brief",
    title,
    content: JSON.stringify({ scenarioId: scenario.scenarioId }),
    htmlContent: html,
  }).returning();

  return { id: report.id, html };
}

export interface BatchReportData {
  batchId: string;
  totalCases: number;
  results: ScenarioResult[];
}

export async function generateBatchISRReport(data: BatchReportData): Promise<{ id: number; html: string }> {
  const { batchId, totalCases, results } = data;

  const feasibilityCounts = { High: 0, Moderate: 0, Low: 0 };
  const constraintFrequency: Record<string, number> = {};
  const mosDistribution: Record<string, number> = {};
  const goalDistribution: Record<string, number> = {};
  let totalHighRisks = 0;

  for (const r of results) {
    const f = r.visualData.overallFeasibility as keyof typeof feasibilityCounts;
    if (feasibilityCounts[f] !== undefined) feasibilityCounts[f]++;
    totalHighRisks += r.visualData.highRiskCount;

    mosDistribution[r.inputs.mosLabel] = (mosDistribution[r.inputs.mosLabel] || 0) + 1;
    goalDistribution[r.inputs.goalLabel] = (goalDistribution[r.inputs.goalLabel] || 0) + 1;

    for (const c of r.outputs.constraintRisks) {
      constraintFrequency[c.label] = (constraintFrequency[c.label] || 0) + 1;
    }
  }

  const topConstraints = Object.entries(constraintFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const mosRows = Object.entries(mosDistribution)
    .map(([mos, count]) => `<tr><td>${mos}</td><td>${count}</td><td>${Math.round(count / totalCases * 100)}%</td></tr>`)
    .join("");

  const goalRows = Object.entries(goalDistribution)
    .map(([goal, count]) => `<tr><td>${goal}</td><td>${count}</td><td>${Math.round(count / totalCases * 100)}%</td></tr>`)
    .join("");

  const constraintRows = topConstraints
    .map(([label, count]) => `<tr><td>${label}</td><td>${count}</td><td>${Math.round(count / totalCases * 100)}%</td></tr>`)
    .join("");

  const body = `
    <div class="header">
      <h1>Installation Status Report (ISR)</h1>
      <div class="subtitle">Aggregate Career Transition Intelligence — De-Identified</div>
      <div class="id">Batch: ${batchId} | Cases: ${totalCases} | ${new Date().toISOString()}</div>
    </div>

    <div class="section">
      <h2>Executive Summary</h2>
      <div class="grid">
        <div class="card"><div class="label">Total Cases Analyzed</div><div class="value">${totalCases}</div></div>
        <div class="card"><div class="label">High Feasibility</div><div class="value" style="color: #22c55e">${feasibilityCounts.High} (${Math.round(feasibilityCounts.High / totalCases * 100)}%)</div></div>
        <div class="card"><div class="label">Moderate Feasibility</div><div class="value" style="color: #eab308">${feasibilityCounts.Moderate} (${Math.round(feasibilityCounts.Moderate / totalCases * 100)}%)</div></div>
        <div class="card"><div class="label">Low Feasibility</div><div class="value" style="color: #ef4444">${feasibilityCounts.Low} (${Math.round(feasibilityCounts.Low / totalCases * 100)}%)</div></div>
      </div>
    </div>

    <div class="section">
      <h2>MOS Distribution</h2>
      <table>
        <tr><th>MOS</th><th>Count</th><th>%</th></tr>
        ${mosRows}
      </table>
    </div>

    <div class="section">
      <h2>Career Goal Distribution</h2>
      <table>
        <tr><th>Career Goal</th><th>Count</th><th>%</th></tr>
        ${goalRows}
      </table>
    </div>

    <div class="section">
      <h2>Top Constraint Triggers</h2>
      <table>
        <tr><th>Constraint</th><th>Frequency</th><th>% of Cases</th></tr>
        ${constraintRows}
      </table>
    </div>

    <div class="section">
      <h2>Institutional Findings</h2>
      <ul>
        <li>Total high-risk constraints identified across all cases: <strong style="color: #ef4444">${totalHighRisks}</strong></li>
        <li>Average constraints per case: <strong>${(totalHighRisks / totalCases).toFixed(1)}</strong></li>
        <li>Most common constraint: <strong>${topConstraints[0]?.[0] || "None"}</strong> (${topConstraints[0]?.[1] || 0} occurrences)</li>
      </ul>
    </div>

    <div class="section">
      <h2>Recommendations for ESO Office</h2>
      <ul>
        <li>Focus advisory resources on ${feasibilityCounts.Low > 0 ? `${feasibilityCounts.Low} low-feasibility cases requiring intensive support` : "maintaining high service levels"}</li>
        <li>Address recurring constraint: ${topConstraints[0]?.[0] || "N/A"} through proactive intervention</li>
        <li>Consider group credential workshops for common pathway requirements</li>
        <li>All data in this report is de-identified and aggregated for institutional use only</li>
      </ul>
    </div>
  `;

  const title = `ISR Batch Report — ${totalCases} Cases`;
  const html = wrapHtml(title, body);

  const [report] = await db.insert(generatedReports).values({
    batchId,
    reportType: "isr_batch",
    title,
    content: JSON.stringify({ batchId, totalCases, feasibilityCounts }),
    htmlContent: html,
  }).returning();

  return { id: report.id, html };
}
