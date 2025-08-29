import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsSection() {
  const yieldChartRef = useRef<HTMLCanvasElement>(null);
  const ndviChartRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  const { data: fields } = useQuery({
    queryKey: ["/api/fields"],
    enabled: !!user,
  });

  useEffect(() => {
    // Load Chart.js if not available
    if (!(window as any).Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = initializeCharts;
      document.head.appendChild(script);
    } else {
      initializeCharts();
    }

    function initializeCharts() {
      if (!yieldChartRef.current || !ndviChartRef.current) return;
      
      const Chart = (window as any).Chart;
      
      // Yield Prediction Chart
      const yieldCtx = yieldChartRef.current.getContext('2d');
      new Chart(yieldCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Predicted Yield (tonnes)',
            data: [3.2, 3.5, 3.8, 4.1, 4.2, 4.8],
            borderColor: 'hsl(147 35% 40%)',
            backgroundColor: 'hsla(147 35% 40% / 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'hsl(120 20% 85%)'
              }
            },
            x: {
              grid: {
                color: 'hsl(120 20% 85%)'
              }
            }
          }
        }
      });
      
      // NDVI Trends Chart
      const ndviCtx = ndviChartRef.current.getContext('2d');
      new Chart(ndviCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'NDVI',
            data: [0.65, 0.68, 0.72, 0.75],
            borderColor: 'hsl(120 80% 30%)',
            backgroundColor: 'hsla(120 80% 30% / 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              min: 0,
              max: 1,
              grid: {
                color: 'hsl(120 20% 85%)'
              }
            },
            x: {
              grid: {
                color: 'hsl(120 20% 85%)'
              }
            }
          }
        }
      });
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Yield Prediction Chart */}
      <Card className="chart-animation">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Yield Predictions</CardTitle>
            <Select defaultValue="30days">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="60days">Last 60 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <canvas ref={yieldChartRef} data-testid="chart-yield-predictions"></canvas>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-primary" data-testid="text-current-yield">4.2t</div>
              <div className="text-sm text-muted-foreground">Current</div>
            </div>
            <div>
              <div className="text-xl font-bold text-accent" data-testid="text-projected-yield">4.8t</div>
              <div className="text-sm text-muted-foreground">Projected</div>
            </div>
            <div>
              <div className="text-xl font-bold text-secondary" data-testid="text-historical-yield">3.9t</div>
              <div className="text-sm text-muted-foreground">Last Year</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NDVI Trends Chart */}
      <Card className="chart-animation">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NDVI Trends</CardTitle>
            <div className="flex space-x-2 items-center">
              <span className="status-indicator status-healthy"></span>
              <span className="text-sm" data-testid="text-ndvi-status">Healthy</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <canvas ref={ndviChartRef} data-testid="chart-ndvi-trends"></canvas>
          </div>
          
          <div className="mt-4 flex justify-between text-sm">
            <div className="text-center">
              <div className="font-semibold" data-testid="text-average-ndvi">0.72</div>
              <div className="text-muted-foreground">Average NDVI</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent" data-testid="text-peak-ndvi">0.89</div>
              <div className="text-muted-foreground">Peak Value</div>
            </div>
            <div className="text-center">
              <div className="font-semibold" data-testid="text-ndvi-trend">+12%</div>
              <div className="text-muted-foreground">vs Last Month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
