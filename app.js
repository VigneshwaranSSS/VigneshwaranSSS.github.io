/* ==========================================================================
   INTERACTIVE LOGIC & SIMULATORS (app.js)
   ========================================================================== */

// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
    // Initialize calculators on load
    updateHousePrice();
    updatePCOSRisk();
    updateSalesDashboard();
});

// NOTE: Download Resume button is a direct <a> tag in index.html
// TODO: Update the href in index.html hero section with your Google Drive resume link

// Contact Form Handler — opens recruiter's default email client with pre-filled values
function handleContactSubmit(event) {
    event.preventDefault();
    const name    = document.getElementById("form-name").value.trim();
    const email   = document.getElementById("form-email").value.trim();
    const subject = document.getElementById("form-subject").value.trim();
    const message = document.getElementById("form-message").value.trim();

    // Build the mailto: URI — opens Gmail / Outlook / any default mail app
    const to      = "sundarvignesh23@gmail.com";
    const subLine = encodeURIComponent(subject || `Message from ${name} via Portfolio`);
    const body    = encodeURIComponent(
        `Hi Vigneshwaran,\n\n${message}\n\n---\nFrom: ${name}\nReply-to: ${email}`
    );

    window.location.href = `mailto:${to}?subject=${subLine}&body=${body}`;
}

/* ==========================================================================
   PROJECT DISPLAY SWITCHER
   ========================================================================== */
function switchProject(projectId) {
    // Hide all panels
    const panels = document.querySelectorAll(".project-panel");
    panels.forEach(p => p.classList.remove("active"));
    
    // Deactivate all buttons
    const buttons = document.querySelectorAll(".project-tab-btn");
    buttons.forEach(b => b.classList.remove("active"));
    
    // Show selected panel
    const activePanel = document.getElementById(`project-${projectId}`);
    if (activePanel) {
        activePanel.classList.add("active");
    }
    
    // Activate selected button
    const activeBtn = document.getElementById(`btn-${projectId}`);
    if (activeBtn) {
        activeBtn.classList.add("active");
    }
}

/* ==========================================================================
   PROJECT 1: HOUSE PRICE PREDICTION REGRESSOR SIMULATOR
   ========================================================================== */
function updateHousePrice() {
    // Read input values
    const quality = parseInt(document.getElementById("param-quality").value);
    const area = parseInt(document.getElementById("param-area").value);
    const garage = parseInt(document.getElementById("param-garage").value);
    const year = parseInt(document.getElementById("param-age").value);
    
    // Update readouts
    document.getElementById("readout-quality").innerText = `${quality} / 10`;
    document.getElementById("readout-area").innerText = area.toLocaleString();
    document.getElementById("readout-garage").innerText = garage === 0 ? "No Garage" : garage === 1 ? "1 Car" : `${garage} Cars`;
    document.getElementById("readout-year").innerText = year;
    
    // LightGBM Regressor Simulated Formula
    // Based on correlation and model coefficients
    const basePrice = 180921;
    
    // Overall quality coefficients (exponential style impact)
    let qualEffect = 0;
    if (quality >= 6) {
        qualEffect = (quality - 6) * 32000 + Math.pow(quality - 6, 2) * 5000;
    } else {
        qualEffect = (quality - 6) * 22000;
    }
    
    // Living Area coefficients
    const areaEffect = (area - 1500) * 88;
    
    // Garage capacity coefficients
    const garageEffect = (garage - 2) * 18000;
    
    // Age of property coefficients (reconstruction/depreciation)
    const ageEffect = (year - 1990) * 750;
    
    // Total prediction
    let predictedPrice = basePrice + qualEffect + areaEffect + garageEffect + ageEffect;
    
    // Enforce limits from the training dataset ($34,900 to $755,000)
    predictedPrice = Math.max(34900, Math.min(755000, predictedPrice));
    
    // Render outputs
    document.getElementById("price-output").innerText = `$${Math.round(predictedPrice).toLocaleString()}`;
    
    // Update distribution indicator
    const percent = ((predictedPrice - 34900) / (755000 - 34900)) * 100;
    document.getElementById("price-indicator").style.left = `${percent}%`;
}

/* ==========================================================================
   PROJECT 2: PCOS CLASSIFICATION SIMULATOR
   ========================================================================== */
function updatePCOSRisk() {
    // Read inputs
    const hormonal = parseInt(document.getElementById("param-hormonal").value);
    const hirsutism = parseInt(document.getElementById("param-hirsutism").value);
    const insulin = parseInt(document.getElementById("param-insulin").value);
    const exercise = parseInt(document.getElementById("param-exercise").value);
    const weight = parseInt(document.getElementById("param-weight").value);
    
    // Update weight readout
    document.getElementById("readout-weight").innerText = `${weight} kg`;
    
    // Simulated Tree Classifier Probability Calculation
    const baseProb = 12; // Base percentage
    
    // Hormonal Imbalance (0: None, 1: Mild, 2: Documented)
    const hormonalImpact = hormonal === 2 ? 35 : hormonal === 1 ? 15 : 0;
    
    // Hirsutism (0: None, 1: Mild, 2: Severe)
    const hirsutismImpact = hirsutism === 2 ? 28 : hirsutism === 1 ? 10 : 0;
    
    // Insulin Resistance (0: None, 1: Borderline, 2: Yes)
    const insulinImpact = insulin === 2 ? 22 : insulin === 1 ? 8 : 0;
    
    // Weight risk factors (increasing risk over healthy average of 55kg)
    const weightImpact = Math.max(0, weight - 55) * 0.75;
    
    // Exercise mitigation (high frequency reduces probability)
    const exerciseReduction = exercise === 3 ? -18 : exercise === 1 ? -6 : 0;
    
    // Total Probability
    let finalProb = baseProb + hormonalImpact + hirsutismImpact + insulinImpact + weightImpact + exerciseReduction;
    
    // Clamp boundaries
    finalProb = Math.max(2, Math.min(98, finalProb));
    
    // Render UI
    const outputVal = document.getElementById("pcos-output");
    outputVal.innerText = `${finalProb.toFixed(1)}%`;
    
    const fill = document.getElementById("pcos-progress");
    fill.style.width = `${finalProb}%`;
    
    // Manage risk categories and explanations
    const badge = document.getElementById("pcos-badge");
    const explanation = document.getElementById("pcos-explanation");
    
    badge.className = "risk-badge"; // Reset
    
    if (finalProb < 35) {
        badge.innerText = "Low Risk Category";
        badge.classList.add("risk-badge-low");
        outputVal.className = "output-value text-success";
        explanation.innerText = "Active habits, healthy body mass index, and absence of significant androgenic markers indicate a low likelihood of endocrine disorder.";
    } else if (finalProb >= 35 && finalProb < 70) {
        badge.innerText = "Moderate Risk Category";
        badge.classList.add("risk-badge-med");
        outputVal.className = "output-value text-warning";
        explanation.innerText = "Presence of minor endocrine signals or metabolic triggers. Regular fitness scheduling and medical review of hormone cycles are recommended.";
    } else {
        badge.innerText = "High Risk Category";
        badge.classList.add("risk-badge-high");
        outputVal.className = "output-value text-error";
        explanation.innerText = "Aggregated endocrine and physical factors align strongly with PCOS markers. Suggest consultation with health professionals to validate hormonal status.";
    }
}

/* ==========================================================================
   PROJECT 3: SALES PERFORMANCE & KPI DASHBOARD
   ========================================================================== */

// Base statistics for the Sales Simulator
const baseRevenue = 1240500;
const baseAOV = 82.70;

// Monthly sales distribution factors
const baseMonthlyShares = [0.066, 0.076, 0.085, 0.093, 0.079, 0.087, 0.090, 0.101, 0.106, 0.117, 0.125, 0.149];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function updateSalesDashboard() {
    // Read selected filters
    const region = document.getElementById("sales-filter-region").value;
    const category = document.getElementById("sales-filter-category").value;
    const quarter = document.getElementById("sales-filter-quarter").value;
    
    // 1. Calculate Scale Factors
    let regionScale = 1.0;
    if (region === "North") regionScale = 0.32;
    else if (region === "East") regionScale = 0.28;
    else if (region === "South") regionScale = 0.18;
    else if (region === "West") regionScale = 0.22;
    
    let categoryScale = 1.0;
    if (category === "Electronics") categoryScale = 0.55;
    else if (category === "Furniture") categoryScale = 0.30;
    else if (category === "Office Supplies") categoryScale = 0.15;
    
    let quarterScale = 1.0;
    if (quarter === "Q1") quarterScale = 0.22;
    else if (quarter === "Q2") quarterScale = 0.25;
    else if (quarter === "Q3") quarterScale = 0.24;
    else if (quarter === "Q4") quarterScale = 0.29;
    
    // Compute total sales
    const finalSales = baseRevenue * regionScale * categoryScale * quarterScale;
    
    // 2. Compute margin based on category with region adjustments
    let margin = 23.0; // Base margin for all categories
    if (category === "Electronics") margin = 25.4;
    else if (category === "Furniture") margin = 14.8;
    else if (category === "Office Supplies") margin = 31.2;
    
    // Slight regional variation
    if (region === "North") margin += 1.8;
    else if (region === "East") margin -= 1.1;
    else if (region === "South") margin -= 2.4;
    else if (region === "West") margin += 1.5;
    
    const finalProfit = finalSales * (margin / 100);
    
    // Compute AOV based on category
    let categoryAOV = baseAOV;
    if (category === "Electronics") categoryAOV = 245.50;
    else if (category === "Furniture") categoryAOV = 180.20;
    else if (category === "Office Supplies") categoryAOV = 28.40;
    
    // Slight regional AOV variation
    if (region === "North") categoryAOV *= 1.05;
    else if (region === "East") categoryAOV *= 0.98;
    else if (region === "South") categoryAOV *= 0.94;
    else if (region === "West") categoryAOV *= 1.03;
    
    // 3. Update KPI labels on UI
    document.getElementById("sales-kpi-revenue").innerText = `$${Math.round(finalSales).toLocaleString()}`;
    document.getElementById("sales-kpi-profit").innerText = `$${Math.round(finalProfit).toLocaleString()}`;
    document.getElementById("sales-kpi-margin").innerText = `${margin.toFixed(1)}%`;
    document.getElementById("sales-kpi-aov").innerText = `$${categoryAOV.toFixed(2)}`;
    
    // 4. Generate Dynamic SQL Query text
    generateSQLQuery(region, category, quarter);
    
    // 5. Compute datasets for Charts updates
    updateSalesDashboardCharts(finalSales, margin, category, quarter);
}

function generateSQLQuery(region, category, quarter) {
    let sqlWhere = "\nWHERE 1=1";
    if (region !== "Global") {
        sqlWhere += `\n  AND region = '${region}'`;
    }
    if (category !== "All") {
        sqlWhere += `\n  AND product_category = '${category}'`;
    }
    if (quarter !== "Full Year") {
        let dates = "BETWEEN '2026-01-01' AND '2026-12-31'";
        if (quarter === "Q1") dates = "BETWEEN '2026-01-01' AND '2026-03-31'";
        else if (quarter === "Q2") dates = "BETWEEN '2026-04-01' AND '2026-06-30'";
        else if (quarter === "Q3") dates = "BETWEEN '2026-07-01' AND '2026-09-30'";
        else if (quarter === "Q4") dates = "BETWEEN '2026-10-01' AND '2026-12-31'";
        sqlWhere += `\n  AND transaction_date ${dates}`;
    }
    
    const query = `SELECT 
  SUM(sales) AS total_revenue,
  SUM(profit) AS total_profit,
  ROUND((SUM(profit) / SUM(sales)) * 100, 2) AS profit_margin,
  ROUND(AVG(sales_amount), 2) AS avg_order_value
FROM retail_sales_data${sqlWhere};`;

    document.getElementById("sales-sql-query").innerText = query;
}

function updateSalesDashboardCharts(totalSales, margin, category, quarter) {
    // 1. Determine monthly datasets based on Quarter
    let activeMonths = [...monthNames];
    let startIdx = 0;
    let endIdx = 12;
    
    if (quarter === "Q1") { activeMonths = ['Jan', 'Feb', 'Mar']; startIdx = 0; endIdx = 3; }
    else if (quarter === "Q2") { activeMonths = ['Apr', 'May', 'Jun']; startIdx = 3; endIdx = 6; }
    else if (quarter === "Q3") { activeMonths = ['Jul', 'Aug', 'Sep']; startIdx = 6; endIdx = 9; }
    else if (quarter === "Q4") { activeMonths = ['Oct', 'Nov', 'Dec']; startIdx = 9; endIdx = 12; }
    
    // Extract slice of share weights and normalize
    const rawShares = baseMonthlyShares.slice(startIdx, endIdx);
    const sumShares = rawShares.reduce((a, b) => a + b, 0);
    const normalizedShares = rawShares.map(s => s / sumShares);
    
    // Compute sales and profits for active months
    const monthlySales = normalizedShares.map(s => Math.round(totalSales * s));
    const monthlyProfit = monthlySales.map(s => Math.round(s * (margin / 100)));
    
    // Update labels and datasets of salesTrendChart directly
    if (window.salesTrendChart) {
        window.salesTrendChart.data.labels = activeMonths;
        window.salesTrendChart.data.datasets[0].data = monthlySales;
        window.salesTrendChart.data.datasets[1].data = monthlyProfit;
        window.salesTrendChart.update();
    }
    
    // 2. Determine category shares dataset
    let categoryLabels = ['Electronics', 'Furniture', 'Office Supplies'];
    let categoryData = [55, 30, 15]; // Default Global
    
    if (category === "Electronics") {
        categoryLabels = ['Phones', 'Laptops', 'Audio Devices'];
        categoryData = [45, 35, 20];
    } else if (category === "Furniture") {
        categoryLabels = ['Chairs', 'Tables', 'Storage Cabinets'];
        categoryData = [40, 35, 25];
    } else if (category === "Office Supplies") {
        categoryLabels = ['Paper', 'Appliances', 'Writing Materials'];
        categoryData = [50, 30, 20];
    }
    
    if (window.categorySalesChart) {
        window.categorySalesChart.data.labels = categoryLabels;
        window.categorySalesChart.data.datasets[0].data = categoryData;
        window.categorySalesChart.update();
    }
}

function resetSalesDashboard() {
    document.getElementById("sales-filter-region").value = "Global";
    document.getElementById("sales-filter-category").value = "All";
    document.getElementById("sales-filter-quarter").value = "Full Year";
    updateSalesDashboard();
}
