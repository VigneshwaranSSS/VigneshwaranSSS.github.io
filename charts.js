/* ==========================================================================
   ANALYTICS & DATA VISUALIZATION (charts.js)
   ========================================================================== */

let houseChart = null;
let pcosChart = null;
let salesTrendChart = null;
let categorySalesChart = null;

// Global Chart.js Defaults for Custom Theme
if (window.Chart) {
    Chart.defaults.color = '#8BA09A'; // var(--text-secondary)
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(9, 16, 13, 0.95)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(46, 229, 157, 0.3)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.titleColor = '#E2EBE8';
    Chart.defaults.plugins.tooltip.bodyColor = '#E2EBE8';
    Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold' };
}

document.addEventListener("DOMContentLoaded", () => {
    initHouseChart();
    initPcosChart();
    initSalesCharts();
});

/* ==========================================================================
   PROJECT 1: HOUSE PRICE CORRELATION CHART
   ========================================================================== */
function initHouseChart() {
    const ctx = document.getElementById("chartHouseCorrelation");
    if (!ctx) return;

    const data = {
        labels: ['OverallQual', 'GrLivArea', 'GarageCars', 'TotalBsmtSF', 'FullBath', 'YearBuilt', 'YearRemod', 'Fireplaces', 'LotArea', 'MSSubClass'],
        datasets: [{
            label: 'Correlation with SalePrice',
            data: [0.79, 0.71, 0.64, 0.61, 0.56, 0.52, 0.51, 0.47, 0.26, -0.08],
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) return null;
                
                // Emerald gradient for positive, Copper for negative
                const val = context.raw;
                if (val >= 0) {
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(46, 229, 157, 0.15)');
                    gradient.addColorStop(1, 'rgba(46, 229, 157, 0.75)');
                    return gradient;
                } else {
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(229, 88, 69, 0.15)');
                    gradient.addColorStop(1, 'rgba(229, 88, 69, 0.75)');
                    return gradient;
                }
            },
            borderColor: function(context) {
                return context.raw >= 0 ? 'rgba(46, 229, 157, 0.8)' : 'rgba(229, 88, 69, 0.8)';
            },
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    houseChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Correlation: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: -0.2,
                    max: 1.0,
                    grid: { color: 'rgba(46, 229, 157, 0.04)' },
                    ticks: { font: { family: 'JetBrains Mono' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { maxRotation: 45, minRotation: 45 }
                }
            }
        }
    });
}

/* ==========================================================================
   PROJECT 2: PCOS RISK CORRELATION CHART
   ========================================================================== */
function initPcosChart() {
    const ctx = document.getElementById("chartPcosCorrelation");
    if (!ctx) return;

    const data = {
        labels: ['Hyperandrogenism', 'Insulin_Resistance', 'Hirsutism', 'Hormonal_Imbalance', 'Weight_kg', 'Difficulty_Conceive', 'Sleep_Hours', 'Exercise_Frequency'],
        datasets: [{
            label: 'Correlation with PCOS',
            data: [0.44, 0.38, 0.35, 0.28, 0.24, 0.22, -0.08, -0.15],
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) return null;
                
                // Horizontal gradients
                const val = context.raw;
                const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                if (val >= 0) {
                    gradient.addColorStop(0, 'rgba(229, 169, 59, 0.15)');
                    gradient.addColorStop(1, 'rgba(229, 169, 59, 0.75)');
                } else {
                    gradient.addColorStop(0, 'rgba(46, 229, 157, 0.75)');
                    gradient.addColorStop(1, 'rgba(46, 229, 157, 0.15)');
                }
                return gradient;
            },
            borderColor: function(context) {
                return context.raw >= 0 ? 'rgba(229, 169, 59, 0.8)' : 'rgba(46, 229, 157, 0.8)';
            },
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    pcosChart = new Chart(ctx, {
        type: 'bar', // Horizontal bar is indexAxis: 'y'
        data: data,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Coefficient: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: -0.3,
                    max: 0.6,
                    grid: { color: 'rgba(46, 229, 157, 0.04)' },
                    ticks: { font: { family: 'JetBrains Mono' } }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}

/* ==========================================================================
   PROJECT 3: SALES PERFORMANCE & TREND CHART
   ========================================================================== */
function initSalesCharts() {
    const trendCtx = document.getElementById("chartSalesTrend");
    const categoryCtx = document.getElementById("chartCategorySales");
    if (!trendCtx || !categoryCtx) return;

    // 1. Sales & Profit Monthly Trend
    const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Sales ($)',
                data: [82000, 94000, 105000, 115000, 98000, 108000, 112000, 125000, 132000, 145000, 155000, 185000],
                borderColor: '#2EE59D', // Emerald
                backgroundColor: 'rgba(46, 229, 157, 0.05)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#2EE59D',
                pointRadius: 3
            },
            {
                label: 'Profit ($)',
                data: [18000, 21000, 24000, 26000, 22000, 24000, 26500, 29000, 31000, 34000, 36000, 43000],
                borderColor: '#E5A93B', // Copper
                backgroundColor: 'rgba(229, 169, 59, 0.05)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#E5A93B',
                pointRadius: 3
            }
        ]
    };

    salesTrendChart = new Chart(trendCtx, {
        type: 'line',
        data: trendData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { boxWidth: 10, padding: 6, font: { size: 9 } }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(46, 229, 157, 0.03)' },
                    ticks: { font: { family: 'JetBrains Mono', size: 9 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 9 } }
                }
            }
        }
    });

    // 2. Product Category Sales Share
    const categoryData = {
        labels: ['Electronics', 'Furniture', 'Office Supplies'],
        datasets: [{
            data: [55, 30, 15],
            backgroundColor: [
                'rgba(46, 229, 157, 0.6)',  // Emerald
                'rgba(229, 169, 59, 0.6)',  // Copper
                'rgba(91, 196, 245, 0.6)'   // Light Blue
            ],
            borderColor: [
                '#2EE59D',
                '#E5A93B',
                '#5bc4f5'
            ],
            borderWidth: 1
        }]
    };

    categorySalesChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: categoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { boxWidth: 10, font: { size: 9 }, padding: 6 }
                }
            },
            cutout: '60%'
        }
    });
}

// Global update function called by app.js when filters are adjusted
window.updateSalesCharts = function(monthlySales, monthlyProfit, categoryShares) {
    if (salesTrendChart) {
        salesTrendChart.data.datasets[0].data = monthlySales;
        salesTrendChart.data.datasets[1].data = monthlyProfit;
        salesTrendChart.update();
    }
    
    if (categorySalesChart) {
        categorySalesChart.data.datasets[0].data = categoryShares;
        categorySalesChart.update();
    }
};
