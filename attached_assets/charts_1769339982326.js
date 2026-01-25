// ===================================
// CHART.JS VISUALIZATIONS
// AI Education Futures Hub
// ===================================

// Global Chart.js defaults
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
Chart.defaults.font.size = 14;
Chart.defaults.color = '#2B2D42';
Chart.defaults.plugins.legend.position = 'bottom';
Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.legend.labels.usePointStyle = true;

// Color palette
const colors = {
    primary: '#2E86AB',
    secondary: '#06A77D',
    purple: '#7B68EE',
    orange: '#F77F00',
    red: '#E74C3C',
    blue: '#3498DB',
    yellow: '#F39C12',
    teal: '#16A085',
    pink: '#E91E63',
    green: '#27AE60'
};

// ===================================
// LOAD DATA AND INITIALIZE CHARTS
// ===================================
let adoptionData = null;

async function loadDataAndInitCharts() {
    try {
        const response = await fetch('../assets/data/adoption-data.json');
        adoptionData = await response.json();
        
        // Initialize all charts
        createMarketGrowthChart();
        createSectorAdoptionChart();
        createRegionalChart();
        createTechnologyChart();
        createBarriersChart();
        createDigitalDivideChart();
        createReadinessChart();
        createInvestmentChart();
        
        console.log('All charts initialized successfully');
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ===================================
// 1. MARKET GROWTH CHART
// ===================================
function createMarketGrowthChart() {
    const ctx = document.getElementById('marketGrowthChart').getContext('2d');
    
    const years = Object.keys(adoptionData.marketSize.data);
    const values = Object.values(adoptionData.marketSize.data);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Market Size (USD Billions)',
                data: values,
                borderColor: colors.primary,
                backgroundColor: colors.primary + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Market Size: $' + context.parsed.y.toFixed(1) + 'B';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Market Size (USD Billions)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'B';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 2. SECTOR ADOPTION CHART
// ===================================
function createSectorAdoptionChart() {
    const ctx = document.getElementById('sectorAdoptionChart').getContext('2d');
    
    const sectors = adoptionData.sectorAdoption;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2020', '2023', '2024', '2026 (Projected)'],
            datasets: [
                {
                    label: 'K-12 Education',
                    data: [sectors.k12.adoption2020, sectors.k12.adoption2023, sectors.k12.adoption2024, sectors.k12.adoption2026],
                    borderColor: colors.purple,
                    backgroundColor: colors.purple + '20',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Higher Education',
                    data: [sectors.higherEd.adoption2020, sectors.higherEd.adoption2023, sectors.higherEd.adoption2024, sectors.higherEd.adoption2026],
                    borderColor: colors.orange,
                    backgroundColor: colors.orange + '20',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Vocational Training',
                    data: [sectors.vocational.adoption2020, sectors.vocational.adoption2023, sectors.vocational.adoption2024, sectors.vocational.adoption2026],
                    borderColor: colors.teal,
                    backgroundColor: colors.teal + '20',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Corporate Learning',
                    data: [sectors.corporate.adoption2020, sectors.corporate.adoption2023, sectors.corporate.adoption2024, sectors.corporate.adoption2026],
                    borderColor: colors.blue,
                    backgroundColor: colors.blue + '20',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 80,
                    title: {
                        display: true,
                        text: 'Adoption Rate (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 3. REGIONAL CHART
// ===================================
function createRegionalChart() {
    const ctx = document.getElementById('regionalChart').getContext('2d');
    
    const regional = adoptionData.regionalData;
    const regions = Object.keys(regional);
    const adoptionRates = regions.map(r => regional[r].adoption2024);
    const cagrRates = regions.map(r => regional[r].cagr);
    const regionNames = regions.map(r => regional[r].name);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regionNames,
            datasets: [
                {
                    label: 'Adoption Rate 2024 (%)',
                    data: adoptionRates,
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'CAGR (%)',
                    data: cagrRates,
                    backgroundColor: colors.orange,
                    borderColor: colors.orange,
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toFixed(1) + '%';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Adoption Rate (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CAGR (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 4. TECHNOLOGY ADOPTION CHART
// ===================================
function createTechnologyChart() {
    const ctx = document.getElementById('technologyChart').getContext('2d');
    
    const tech = adoptionData.technologyAdoption;
    const techNames = Object.keys(tech).map(t => tech[t].name);
    const adoptionRates = Object.keys(tech).map(t => tech[t].adoption2024);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: techNames,
            datasets: [{
                data: adoptionRates,
                backgroundColor: [
                    colors.primary,
                    colors.secondary,
                    colors.purple,
                    colors.orange,
                    colors.blue,
                    colors.pink
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 5. BARRIERS CHART
// ===================================
function createBarriersChart() {
    const ctx = document.getElementById('barriersChart').getContext('2d');
    
    const barriers = adoptionData.barriers;
    const barrierNames = Object.keys(barriers).map(b => barriers[b].name);
    const prevalence = Object.keys(barriers).map(b => barriers[b].prevalence);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: barrierNames,
            datasets: [{
                label: 'Prevalence (%)',
                data: prevalence,
                backgroundColor: [
                    colors.red,
                    colors.orange,
                    colors.yellow,
                    colors.blue,
                    colors.purple
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Prevalence: ' + context.parsed.x + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 80,
                    title: {
                        display: true,
                        text: 'Prevalence (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 6. DIGITAL DIVIDE CHART
// ===================================
function createDigitalDivideChart() {
    const ctx = document.getElementById('digitalDivideChart').getContext('2d');
    
    const divide = adoptionData.digitalDivide;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['High-Income Countries', 'Low-Income Countries'],
            datasets: [
                {
                    label: 'Adoption Rate',
                    data: [divide.highIncome.adoption, divide.lowIncome.adoption],
                    backgroundColor: [colors.secondary, colors.red],
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Adoption: ' + context.parsed.y + '%';
                        },
                        afterLabel: function(context) {
                            if (context.dataIndex === 0) {
                                return 'Infrastructure: ' + divide.highIncome.infrastructure + '%\nTraining: ' + divide.highIncome.training + '%';
                            } else {
                                return 'Infrastructure: ' + divide.lowIncome.infrastructure + '%\nTraining: ' + divide.lowIncome.training + '%';
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    title: {
                        display: true,
                        text: 'Adoption Rate (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 7. READINESS CHART
// ===================================
function createReadinessChart() {
    const ctx = document.getElementById('readinessChart').getContext('2d');
    
    const faculty = adoptionData.facultyReadiness;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive Attitude', 'Adequate Training', 'Active Use'],
            datasets: [{
                label: 'Faculty Readiness (%)',
                data: [faculty.positiveAttitude, faculty.adequateTraining, faculty.activeUse],
                backgroundColor: [colors.secondary, colors.red, colors.orange],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% of faculty';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 8. INVESTMENT CHART
// ===================================
function createInvestmentChart() {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Investment (2024)', 'Active Startups', 'Investment CAGR', 'Market CAGR'],
            datasets: [{
                label: 'Value',
                data: [7.2, 6.8, 51.2, 34.1], // Normalized for visualization
                backgroundColor: [colors.primary, colors.orange, colors.secondary, colors.purple],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labels = [
                                '$7.2 Billion',
                                '680 Startups',
                                '51.2% CAGR',
                                '34.1% CAGR'
                            ];
                            return labels[context.dataIndex];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Normalized Value',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================
document.addEventListener('DOMContentLoaded', loadDataAndInitCharts);
