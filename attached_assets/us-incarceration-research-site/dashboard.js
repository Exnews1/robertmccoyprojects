// State Incarceration Dashboard JavaScript
let allData = [];
let charts = {};
let filteredData = [];

// Load and parse CSV data
async function loadData() {
    try {
        const response = await fetch('dashboard_comprehensive_state_data.csv');
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true, dynamicTyping: true });
        allData = parsed.data.filter(row => row.State); // Remove empty rows
        filteredData = [...allData];
        
        initializeDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize dashboard
function initializeDashboard() {
    updateSummaryStats();
    createAllCharts();
    populateStateTable();
}

// Update summary statistics
function updateSummaryStats() {
    const rates = filteredData.map(d => d.Incarceration_Rate_per_100k);
    const total = filteredData.reduce((sum, d) => sum + d.Total_Imprisoned, 0);
    
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    
    const maxState = filteredData.find(d => d.Incarceration_Rate_per_100k === maxRate);
    const minState = filteredData.find(d => d.Incarceration_Rate_per_100k === minRate);
    
    document.getElementById('highestRate').textContent = maxRate.toLocaleString();
    document.getElementById('highestState').textContent = maxState.State;
    document.getElementById('lowestRate').textContent = minRate.toLocaleString();
    document.getElementById('lowestState').textContent = minState.State;
    document.getElementById('avgRate').textContent = Math.round(avgRate).toLocaleString();
    document.getElementById('totalImprisoned').textContent = total.toLocaleString();
}

// Create all charts
function createAllCharts() {
    createTopStatesChart();
    createRegionChart();
    createThreeStrikesChart();
    createMarijuanaChart();
    createRecidivismChart();
    createRecidivismTrendChart();
    createCostChart();
    createRehabSpendingChart();
    createReformChart();
    createPolicyDistChart();
}

// Chart 1: Top States by Incarceration Rate
function createTopStatesChart() {
    const ctx = document.getElementById('topStatesChart');
    const sorted = [...filteredData].sort((a, b) => b.Incarceration_Rate_per_100k - a.Incarceration_Rate_per_100k).slice(0, 15);
    
    if (charts.topStates) charts.topStates.destroy();
    
    charts.topStates = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.State),
            datasets: [{
                label: 'Incarceration Rate per 100,000',
                data: sorted.map(d => d.Incarceration_Rate_per_100k),
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                borderColor: 'rgba(220, 38, 38, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                title: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Rate per 100,000' }
                }
            }
        }
    });
}

// Chart 2: Region Comparison
function createRegionChart() {
    const ctx = document.getElementById('regionChart');
    
    const regionData = {};
    filteredData.forEach(d => {
        if (!regionData[d.Region]) regionData[d.Region] = [];
        regionData[d.Region].push(d.Incarceration_Rate_per_100k);
    });
    
    const regions = Object.keys(regionData);
    const avgRates = regions.map(region => {
        const rates = regionData[region];
        return rates.reduce((a, b) => a + b, 0) / rates.length;
    });
    
    if (charts.region) charts.region.destroy();
    
    charts.region = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions,
            datasets: [{
                label: 'Average Incarceration Rate',
                data: avgRates,
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Average Rate per 100,000' }
                }
            }
        }
    });
}

// Chart 3: Three Strikes Law Impact
function createThreeStrikesChart() {
    const ctx = document.getElementById('threeStrikesChart');
    
    const withThreeStrikes = filteredData.filter(d => d.Three_Strikes_Law === 'Yes');
    const withoutThreeStrikes = filteredData.filter(d => d.Three_Strikes_Law === 'No');
    
    const avgWith = withThreeStrikes.reduce((sum, d) => sum + d.Incarceration_Rate_per_100k, 0) / withThreeStrikes.length;
    const avgWithout = withoutThreeStrikes.reduce((sum, d) => sum + d.Incarceration_Rate_per_100k, 0) / withoutThreeStrikes.length;
    
    if (charts.threeStrikes) charts.threeStrikes.destroy();
    
    charts.threeStrikes = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['With Three Strikes Law', 'Without Three Strikes Law'],
            datasets: [{
                label: 'Average Incarceration Rate',
                data: [avgWith, avgWithout],
                backgroundColor: ['rgba(220, 38, 38, 0.8)', 'rgba(34, 197, 94, 0.8)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Average Rate per 100,000' }
                }
            }
        }
    });
}

// Chart 4: Marijuana Policy Impact
function createMarijuanaChart() {
    const ctx = document.getElementById('marijuanaChart');
    
    const recreational = filteredData.filter(d => d.Marijuana_Legalization === 'Recreational');
    const medicalOnly = filteredData.filter(d => d.Marijuana_Legalization === 'Medical Only');
    
    const avgRec = recreational.reduce((sum, d) => sum + d.Incarceration_Rate_per_100k, 0) / recreational.length;
    const avgMed = medicalOnly.reduce((sum, d) => sum + d.Incarceration_Rate_per_100k, 0) / medicalOnly.length;
    
    if (charts.marijuana) charts.marijuana.destroy();
    
    charts.marijuana = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Recreational Legal', 'Medical Only'],
            datasets: [{
                label: 'Average Incarceration Rate',
                data: [avgRec, avgMed],
                backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(251, 191, 36, 0.8)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Average Rate per 100,000' }
                }
            }
        }
    });
}

// Chart 5: Recidivism Rates
function createRecidivismChart() {
    const ctx = document.getElementById('recidivismChart');
    const sorted = [...filteredData].sort((a, b) => b.Three_Year_Recidivism_Rate - a.Three_Year_Recidivism_Rate).slice(0, 15);
    
    if (charts.recidivism) charts.recidivism.destroy();
    
    charts.recidivism = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.State),
            datasets: [{
                label: '3-Year Recidivism Rate (%)',
                data: sorted.map(d => d.Three_Year_Recidivism_Rate),
                backgroundColor: 'rgba(251, 146, 60, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Recidivism Rate (%)' }
                }
            }
        }
    });
}

// Chart 6: Recidivism Trends
function createRecidivismTrendChart() {
    const ctx = document.getElementById('recidivismTrendChart');
    const sorted = [...filteredData].sort((a, b) => a.Recidivism_Trend_2018_2024 - b.Recidivism_Trend_2018_2024).slice(0, 15);
    
    if (charts.recidivismTrend) charts.recidivismTrend.destroy();
    
    charts.recidivismTrend = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.State),
            datasets: [{
                label: 'Change in Recidivism (%)',
                data: sorted.map(d => d.Recidivism_Trend_2018_2024),
                backgroundColor: sorted.map(d => d.Recidivism_Trend_2018_2024 < 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(220, 38, 38, 0.8)'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Percentage Change (2018-2024)' }
                }
            }
        }
    });
}

// Chart 7: Cost per Inmate
function createCostChart() {
    const ctx = document.getElementById('costChart');
    const sorted = [...filteredData].sort((a, b) => b.Cost_per_Inmate_Annual - a.Cost_per_Inmate_Annual).slice(0, 15);
    
    if (charts.cost) charts.cost.destroy();
    
    charts.cost = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.State),
            datasets: [{
                label: 'Annual Cost per Inmate ($)',
                data: sorted.map(d => d.Cost_per_Inmate_Annual),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Annual Cost ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Chart 8: Rehabilitation Spending vs Incarceration
function createRehabSpendingChart() {
    const ctx = document.getElementById('rehabSpendingChart');
    
    if (charts.rehabSpending) charts.rehabSpending.destroy();
    
    charts.rehabSpending = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'States',
                data: filteredData.map(d => ({
                    x: d.Rehabilitation_Program_Spending_Pct,
                    y: d.Incarceration_Rate_per_100k
                })),
                backgroundColor: 'rgba(168, 85, 247, 0.6)',
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const state = filteredData[context.dataIndex];
                            return `${state.State}: ${context.parsed.x}% rehab, ${context.parsed.y} rate`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Rehabilitation Spending (% of Budget)' }
                },
                y: {
                    title: { display: true, text: 'Incarceration Rate per 100,000' }
                }
            }
        }
    });
}

// Chart 9: Reform Impact
function createReformChart() {
    const ctx = document.getElementById('reformChart');
    
    const extensive = filteredData.filter(d => d.Sentencing_Reform_2020_2024 === 'Extensive');
    const yes = filteredData.filter(d => d.Sentencing_Reform_2020_2024 === 'Yes');
    const limited = filteredData.filter(d => d.Sentencing_Reform_2020_2024 === 'Limited');
    
    const avgExtensive = extensive.reduce((sum, d) => sum + d.Prison_Population_Change_2020_2024, 0) / extensive.length;
    const avgYes = yes.reduce((sum, d) => sum + d.Prison_Population_Change_2020_2024, 0) / yes.length;
    const avgLimited = limited.reduce((sum, d) => sum + d.Prison_Population_Change_2020_2024, 0) / limited.length;
    
    if (charts.reform) charts.reform.destroy();
    
    charts.reform = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Extensive Reform', 'Yes Reform', 'Limited Reform'],
            datasets: [{
                label: 'Avg Population Change (%)',
                data: [avgExtensive, avgYes, avgLimited],
                backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(251, 191, 36, 0.8)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Population Change (%)' }
                }
            }
        }
    });
}

// Chart 10: Policy Distribution
function createPolicyDistChart() {
    const ctx = document.getElementById('policyDistChart');
    
    const threeStrikesYes = filteredData.filter(d => d.Three_Strikes_Law === 'Yes').length;
    const deathPenaltyYes = filteredData.filter(d => d.Death_Penalty === 'Yes').length;
    const recreationalMJ = filteredData.filter(d => d.Marijuana_Legalization === 'Recreational').length;
    const extensiveReform = filteredData.filter(d => d.Sentencing_Reform_2020_2024 === 'Extensive').length;
    
    if (charts.policyDist) charts.policyDist.destroy();
    
    charts.policyDist = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Three Strikes Law', 'Death Penalty', 'Recreational MJ', 'Extensive Reform'],
            datasets: [{
                label: 'Number of States',
                data: [threeStrikesYes, deathPenaltyYes, recreationalMJ, extensiveReform],
                backgroundColor: [
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 51,
                    title: { display: true, text: 'Number of States' }
                }
            }
        }
    });
}

// Populate state comparison table
function populateStateTable() {
    const tbody = document.getElementById('stateTableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(state => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${state.State}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${state.Incarceration_Rate_per_100k.toLocaleString()}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${state.Three_Year_Recidivism_Rate.toFixed(1)}%</td>
            <td class="px-4 py-3 text-sm text-gray-700">$${state.Cost_per_Inmate_Annual.toLocaleString()}</td>
            <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 text-xs rounded-full ${state.Three_Strikes_Law === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${state.Three_Strikes_Law}
                </span>
            </td>
            <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 text-xs rounded-full ${state.Marijuana_Legalization === 'Recreational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${state.Marijuana_Legalization}
                </span>
            </td>
            <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 text-xs rounded-full ${state.Sentencing_Reform_2020_2024 === 'Extensive' ? 'bg-blue-100 text-blue-800' : state.Sentencing_Reform_2020_2024 === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${state.Sentencing_Reform_2020_2024}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Apply filters
function applyFilters() {
    const region = document.getElementById('regionFilter').value;
    const threeStrikes = document.getElementById('threeStrikesFilter').value;
    const marijuana = document.getElementById('marijuanaFilter').value;
    
    filteredData = allData.filter(state => {
        if (region !== 'all' && state.Region !== region) return false;
        if (threeStrikes !== 'all' && state.Three_Strikes_Law !== threeStrikes) return false;
        if (marijuana !== 'all' && state.Marijuana_Legalization !== marijuana) return false;
        return true;
    });
    
    updateSummaryStats();
    createAllCharts();
    populateStateTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('regionFilter').value = 'all';
    document.getElementById('threeStrikesFilter').value = 'all';
    document.getElementById('marijuanaFilter').value = 'all';
    
    filteredData = [...allData];
    updateSummaryStats();
    createAllCharts();
    populateStateTable();
}

// Sort table
let sortDirection = {};
function sortTable(columnIndex) {
    const tbody = document.getElementById('stateTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    if (!sortDirection[columnIndex]) sortDirection[columnIndex] = 'asc';
    else sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
    
    rows.sort((a, b) => {
        let aVal = a.cells[columnIndex].textContent.trim();
        let bVal = b.cells[columnIndex].textContent.trim();
        
        // Remove currency symbols and commas for numeric comparison
        aVal = aVal.replace(/[$,%]/g, '');
        bVal = bVal.replace(/[$,%]/g, '');
        
        // Try to parse as numbers
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortDirection[columnIndex] === 'asc' ? aNum - bNum : bNum - aNum;
        } else {
            return sortDirection[columnIndex] === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadData);
