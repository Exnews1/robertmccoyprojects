import os

# Template for pillar pages
pillar_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | CMGF Five Pillars</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * {{ font-family: 'Inter', sans-serif; }}
        .research-card {{ transition: all 0.3s ease; }}
        .research-card:hover {{ transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }}
        .stat-highlight {{ background: linear-gradient(135deg, {color1} 0%, {color2} 100%); }}
        .citation-box {{ background-color: #f8fafc; border-left: 4px solid {accent_color}; }}
    </style>
</head>
<body class="bg-gray-50">
    
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="index.html" class="flex items-center">
                        <i class="fas fa-arrow-left text-blue-600 mr-3"></i>
                        <span class="font-semibold text-gray-900">Back to Overview</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    {nav_links}
                </div>
            </div>
        </div>
    </nav>

    <div class="bg-gradient-to-r from-{color1} to-{color2} text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center mb-4">
                <i class="fas {icon} text-5xl mr-4"></i>
                <div>
                    <h1 class="text-4xl font-bold">{title}</h1>
                    <p class="text-lg opacity-90 mt-2">{subtitle}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Executive Summary</h2>
            <p class="text-lg text-gray-700 leading-relaxed mb-4">
                {executive_summary}
            </p>
            <div class="grid md:grid-cols-3 gap-4 mt-6">
                {summary_stats}
            </div>
        </div>

        <h2 class="text-3xl font-bold text-gray-900 mb-6">Layer 1: Key Research Findings</h2>
        <p class="text-gray-700 mb-8">Click any card to explore detailed research synthesis (Layer 2)</p>

        <div class="grid md:grid-cols-2 gap-6 mb-12">
            {research_cards}
        </div>

        <div class="bg-gradient-to-r from-{color1} to-{color2} text-white rounded-xl p-8 mb-8">
            <h2 class="text-2xl font-bold mb-4">Policy Implications & Recommendations</h2>
            {policy_content}
        </div>

        <div class="flex justify-between items-center">
            <a href="{prev_page}" class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
                <i class="fas fa-arrow-left mr-2"></i> {prev_label}
            </a>
            <a href="{next_page}" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                {next_label} <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>

    </div>

    <footer class="bg-gray-900 text-white py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-gray-400 text-sm">The Five Pillars Feeding the CMGF Tool | &copy; 2026 Robert McCoy</p>
        </div>
    </footer>

    <script>
        function toggleDetail(id) {{
            const detail = document.getElementById(id);
            const icon = document.getElementById('icon-' + id);
            if (detail.classList.contains('hidden')) {{
                detail.classList.remove('hidden');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                detail.scrollIntoView({{ behavior: 'smooth', block: 'nearest' }});
            }} else {{
                detail.classList.add('hidden');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }}
        }}
    </script>

</body>
</html>'''

# Pillar 2 Data
pillar2_data = {
    'title': 'Pillar 2: Empowerment Strategies & Stackable Pathways',
    'subtitle': 'Evidence from 222 peer-reviewed sources (2015-2026)',
    'icon': 'fa-layer-group',
    'color1': 'purple-600',
    'color2': 'pink-600',
    'accent_color': '#9333ea',
    'executive_summary': '''Military credentialing and stackable pathways show promise but uneven evidence: strong program-level successes exist (notably targeted PLA, competency-based pilots, and some apprenticeship outcomes), while national CA/COOL effectiveness and portable credential scale-up lack rigorous outcome evaluation. Policy should prioritize mapping, employer alignment, and rigorous outcome measurement.''',
    'summary_stats': '''
        <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600 mb-1">222</div>
            <div class="text-sm text-gray-700">Research Papers Analyzed</div>
        </div>
        <div class="bg-pink-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-pink-600 mb-1">98%</div>
            <div class="text-sm text-gray-700">NCLEX Pass Rate (Vets2BSN)</div>
        </div>
        <div class="bg-indigo-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-indigo-600 mb-1">20%</div>
            <div class="text-sm text-gray-700">Of All U.S. Apprentices</div>
        </div>
    ''',
    'research_cards': '''
        <div class="research-card bg-white rounded-xl shadow-lg p-6 cursor-pointer" onclick="toggleDetail('detail1')">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Credentialing Programs Effectiveness</h3>
                <i class="fas fa-chevron-down text-purple-600 text-xl" id="icon-detail1"></i>
            </div>
            <p class="text-gray-700 mb-4">
                Targeted interventions report measurable successes, but national CA/COOL effectiveness lacks rigorous causal evaluation at scale.
            </p>
            <div class="stat-highlight text-white p-4 rounded-lg">
                <div class="text-2xl font-bold">98% Pass Rate</div>
                <div class="text-sm opacity-90">Vets2BSN NCLEX (48 of 49 completers)</div>
            </div>
        </div>

        <div id="detail1" class="hidden col-span-2 bg-gray-50 rounded-xl p-8 border-l-4 border-purple-600">
            <h4 class="text-2xl font-bold text-gray-900 mb-4">Layer 2: Program Effectiveness Analysis</h4>
            <div class="citation-box p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-gray-900 mb-2">Key Findings</h5>
                <ul class="text-sm text-gray-700 space-y-2">
                    <li><strong>Insufficient national outcomes:</strong> Federal reviews note CA and COOL existence but do not provide causal evidence of improved employment or earnings at scale (RAND, 2015).</li>
                    <li><strong>COOL designation patterns:</strong> More likely for accredited, industry-recognized certifications, but mapping analyses describe coverage rather than measured outcomes.</li>
                    <li><strong>Vets2BSN success:</strong> Nursing conversion project enrolled ~80 eligible corpsmen/medics, conferred 59 BSNs, achieved 98% NCLEX pass rate (McNeal et al., 2019).</li>
                    <li><strong>STEM scholarship model:</strong> 80% degree attainment, 24 percentage points above institutional average (Morris et al., 2023).</li>
                </ul>
            </div>
            <button onclick="toggleDetail('detail1')" class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                <i class="fas fa-chevron-up mr-2"></i> Collapse Detail
            </button>
        </div>

        <div class="research-card bg-white rounded-xl shadow-lg p-6 cursor-pointer" onclick="toggleDetail('detail2')">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Stackable Credentials & PLA</h3>
                <i class="fas fa-chevron-down text-purple-600 text-xl" id="icon-detail2"></i>
            </div>
            <p class="text-gray-700 mb-4">
                Prior learning assessment and competency-based education show plausible mechanisms for acceleration but lack large-scale causal estimates.
            </p>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p class="text-sm text-gray-800">PLA approaches can accelerate degree attainment and recognize military competence in civilian credentials.</p>
            </div>
        </div>

        <div id="detail2" class="hidden col-span-2 bg-gray-50 rounded-xl p-8 border-l-4 border-blue-600">
            <h4 class="text-2xl font-bold text-gray-900 mb-4">Layer 2: PLA & CBE Research</h4>
            <div class="citation-box p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-gray-900 mb-2">Evidence Base</h5>
                <ul class="text-sm text-gray-700 space-y-2">
                    <li><strong>Reservist Re-Entry pilot:</strong> Used learning-outcome mapping, tracked 350 students for evaluation (Wainwright & Dhaliwal, 2012).</li>
                    <li><strong>Colorado case study:</strong> Evaluated institutional PLA implementation for military training with system recommendations (Deickman et al., 2024).</li>
                    <li><strong>Sector-specific outcomes:</strong> Strongest in health and STEM when tightly aligned to licensure requirements.</li>
                </ul>
            </div>
            <button onclick="toggleDetail('detail2')" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                <i class="fas fa-chevron-up mr-2"></i> Collapse Detail
            </button>
        </div>

        <div class="research-card bg-white rounded-xl shadow-lg p-6 cursor-pointer" onclick="toggleDetail('detail3')">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Apprenticeship Effectiveness</h3>
                <i class="fas fa-chevron-down text-purple-600 text-xl" id="icon-detail3"></i>
            </div>
            <p class="text-gray-700 mb-4">
                Military apprenticeships (USMAP) account for 20% of all U.S. registered apprentices but face documentation and employer engagement challenges.
            </p>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-green-100 p-3 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-700">20%</div>
                    <div class="text-xs text-gray-700">Of All U.S. Apprentices</div>
                </div>
                <div class="bg-orange-100 p-3 rounded-lg text-center">
                    <div class="text-2xl font-bold text-orange-700">Weak</div>
                    <div class="text-xs text-gray-700">Employer Engagement</div>
                </div>
            </div>
        </div>

        <div id="detail3" class="hidden col-span-2 bg-gray-50 rounded-xl p-8 border-l-4 border-green-600">
            <h4 class="text-2xl font-bold text-gray-900 mb-4">Layer 2: Apprenticeship Analysis</h4>
            <div class="citation-box p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-gray-900 mb-2">USMAP Findings</h5>
                <p class="text-sm text-gray-700 mb-3">
                    Implementation evaluation finds potential to document competencies and smooth transitions, but identifies weak participant understanding, logistical documentation problems, and poor employer engagement (Hanson & Lerman, 2016).
                </p>
                <h5 class="font-semibold text-gray-900 mb-2 mt-4">Common Barriers</h5>
                <ul class="text-sm text-gray-700 space-y-1">
                    <li>• Incomplete documentation of military training</li>
                    <li>• Inconsistent PLA practices across institutions</li>
                    <li>• Limited employer engagement in hiring completers</li>
                    <li>• Lack of rigorous outcome measures</li>
                </ul>
            </div>
            <button onclick="toggleDetail('detail3')" class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                <i class="fas fa-chevron-up mr-2"></i> Collapse Detail
            </button>
        </div>
    ''',
    'policy_content': '''
        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <h3 class="text-lg font-semibold mb-3">Priority Recommendations</h3>
                <ul class="space-y-2 text-sm">
                    <li><i class="fas fa-check-circle mr-2"></i>Mandate rigorous outcome evaluation with standardized metrics</li>
                    <li><i class="fas fa-check-circle mr-2"></i>Standardize PLA and outcome mapping across institutions</li>
                    <li><i class="fas fa-check-circle mr-2"></i>Invest in digital portability and verified credential registries</li>
                    <li><i class="fas fa-check-circle mr-2"></i>Engage employers in apprenticeship standard-setting</li>
                    <li><i class="fas fa-check-circle mr-2"></i>Scale proven sector-specific pathway pilots</li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-3">Implementation Actions</h3>
                <ul class="space-y-2 text-sm">
                    <li><i class="fas fa-cog mr-2"></i>Adopt outcome-based mapping frameworks</li>
                    <li><i class="fas fa-cog mr-2"></i>Create employer-facing competency registries</li>
                    <li><i class="fas fa-cog mr-2"></i>Strengthen counselor training on credential mapping</li>
                    <li><i class="fas fa-cog mr-2"></i>Coordinate federal-state data systems</li>
                </ul>
            </div>
        </div>
    ''',
    'nav_links': '<a href="pillar3.html" class="text-gray-700 hover:text-blue-600">Next Pillar <i class="fas fa-arrow-right ml-1"></i></a>',
    'prev_page': 'pillar1.html',
    'prev_label': 'Previous: Career Mobility',
    'next_page': 'pillar3.html',
    'next_label': 'Next: AI-Assisted Advising'
}

# Write Pillar 2
with open('pillar2.html', 'w') as f:
    f.write(pillar_template.format(**pillar2_data))

print("Pillar 2 created successfully")
