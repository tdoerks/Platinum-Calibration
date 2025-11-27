/**
 * Data Visualization Add-on for Platinum Pipette Calibration System
 *
 * Adds interactive charts using Chart.js for:
 * - Measurement trends
 * - Accuracy distribution
 * - Precision tracking
 * - Control charts
 * - Pass/fail visualization
 *
 * Usage:
 * 1. Include Chart.js before this script:
 *    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
 *
 * 2. Add chart containers to HTML:
 *    <canvas id="accuracyChart"></canvas>
 *    <canvas id="precisionChart"></canvas>
 *
 * 3. Call visualization functions:
 *    showAccuracyChart();
 *    showPrecisionChart();
 *    showControlChart(pipetteIndex);
 */

// Store chart instances for cleanup
const chartInstances = {};

/**
 * Create accuracy trend chart for all pipettes
 */
function showAccuracyChart() {
    const ctx = document.getElementById('accuracyChart');
    if (!ctx) {
        console.error('accuracyChart canvas not found');
        return;
    }

    // Destroy existing chart
    if (chartInstances.accuracy) {
        chartInstances.accuracy.destroy();
    }

    // Prepare data
    const labels = pipettes.map((p, i) => `${p.model || 'Pipette'} ${i+1}`);
    const accuracyData = pipettes.map(p => p.averageAccuracy || 0);
    const precisionData = pipettes.map(p => p.averagePrecision || 0);

    // Create chart
    chartInstances.accuracy = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Accuracy (%)',
                    data: accuracyData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Precision (%)',
                    data: precisionData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Pipette Accuracy & Precision Comparison',
                    font: { size: 16 }
                },
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
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
                        text: 'Percentage (%)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Create control chart for a specific pipette
 */
function showControlChart(pipetteIndex) {
    const canvas = document.getElementById('controlChart');
    if (!canvas) {
        console.error('controlChart canvas not found');
        return;
    }

    const pipette = pipettes[pipetteIndex];
    if (!pipette || !pipette.measurements) {
        alert('No measurement data available for this pipette');
        return;
    }

    // Destroy existing chart
    if (chartInstances.control) {
        chartInstances.control.destroy();
    }

    // Calculate control limits
    const volumes = pipette.measurements.map(m => m.volume);
    const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const stdDev = Math.sqrt(
        volumes.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / volumes.length
    );

    const ucl = mean + 3 * stdDev; // Upper Control Limit
    const lcl = mean - 3 * stdDev; // Lower Control Limit

    // Create chart
    chartInstances.control = new Chart(canvas, {
        type: 'line',
        data: {
            labels: volumes.map((_, i) => `M${i+1}`),
            datasets: [
                {
                    label: 'Measured Volume',
                    data: volumes,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Mean',
                    data: Array(volumes.length).fill(mean),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0
                },
                {
                    label: 'UCL (+3σ)',
                    data: Array(volumes.length).fill(ucl),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    borderDash: [10, 5],
                    pointRadius: 0
                },
                {
                    label: 'LCL (-3σ)',
                    data: Array(volumes.length).fill(lcl),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    borderDash: [10, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Control Chart: ${pipette.model || 'Pipette'} (S/N: ${pipette.serialNumber || 'N/A'})`,
                    font: { size: 16 }
                },
                legend: {
                    position: 'top'
                },
                annotation: {
                    annotations: {
                        specs: {
                            type: 'box',
                            yMin: lcl,
                            yMax: ucl,
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            borderWidth: 0
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Volume (µL)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Measurement Number'
                    }
                }
            }
        }
    });
}

/**
 * Show pass/fail distribution donut chart
 */
function showPassFailChart() {
    const canvas = document.getElementById('passFailChart');
    if (!canvas) {
        console.error('passFailChart canvas not found');
        return;
    }

    // Destroy existing chart
    if (chartInstances.passFail) {
        chartInstances.passFail.destroy();
    }

    // Count pass/fail
    const statusCounts = {
        'PASS': 0,
        'FAIL': 0,
        'PENDING': 0
    };

    pipettes.forEach(p => {
        const status = p.status || 'PENDING';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });

    chartInstances.passFail = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',  // Green for PASS
                    'rgba(244, 67, 54, 0.8)',  // Red for FAIL
                    'rgba(255, 193, 7, 0.8)'   // Yellow for PENDING
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Calibration Results Overview',
                    font: { size: 16 }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Show measurement distribution histogram
 */
function showDistributionChart(pipetteIndex) {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) {
        console.error('distributionChart canvas not found');
        return;
    }

    const pipette = pipettes[pipetteIndex];
    if (!pipette || !pipette.measurements) {
        alert('No measurement data available');
        return;
    }

    // Destroy existing chart
    if (chartInstances.distribution) {
        chartInstances.distribution.destroy();
    }

    // Create histogram bins
    const volumes = pipette.measurements.map(m => m.volume);
    const min = Math.min(...volumes);
    const max = Math.max(...volumes);
    const binCount = 10;
    const binWidth = (max - min) / binCount;

    const bins = Array(binCount).fill(0);
    const binLabels = [];

    for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binWidth;
        const binEnd = binStart + binWidth;
        binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);

        volumes.forEach(v => {
            if (v >= binStart && v < binEnd) {
                bins[i]++;
            }
        });
    }

    chartInstances.distribution = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Frequency',
                data: bins,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Volume Distribution: ${pipette.model || 'Pipette'}`,
                    font: { size: 16 }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Volume Range (µL)'
                    }
                }
            }
        }
    });
}

/**
 * Create comprehensive dashboard with multiple charts
 */
function createDashboard() {
    // Clear existing dashboard
    const dashboardContainer = document.getElementById('chartDashboard');
    if (!dashboardContainer) {
        console.error('chartDashboard container not found');
        return;
    }

    dashboardContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; padding: 20px;">
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <canvas id="accuracyChart"></canvas>
            </div>
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <canvas id="passFailChart"></canvas>
            </div>
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <canvas id="controlChart"></canvas>
            </div>
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <canvas id="distributionChart"></canvas>
            </div>
        </div>
    `;

    // Generate all charts
    showAccuracyChart();
    showPassFailChart();
    if (pipettes.length > 0) {
        showControlChart(0);
        showDistributionChart(0);
    }
}

/**
 * Destroy all chart instances (cleanup)
 */
function destroyAllCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    Object.keys(chartInstances).forEach(key => delete chartInstances[key]);
}

// Make functions globally available
window.showAccuracyChart = showAccuracyChart;
window.showControlChart = showControlChart;
window.showPassFailChart = showPassFailChart;
window.showDistributionChart = showDistributionChart;
window.createDashboard = createDashboard;
window.destroyAllCharts = destroyAllCharts;

console.log('✅ Charts Add-on loaded successfully');
console.log('Use createDashboard() to show all visualizations');
