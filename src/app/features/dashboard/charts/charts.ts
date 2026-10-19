
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.css'
})
export class Charts implements AfterViewInit, OnDestroy {
  @ViewChild('salesCanvas')
  salesCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('ordersCanvas')
  ordersCanvas!: ElementRef<HTMLCanvasElement>;

  private salesChart?: Chart;
  private ordersChart?: Chart;

  ngAfterViewInit(): void {
    this.createSalesChart();
    this.createOrdersChart();
  }

  private getCssVariable(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  private createSalesChart(): void {
    const canvas = this.salesCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    const primary = this.getCssVariable('--color-primary');
    const primaryLight = this.getCssVariable('--color-primary-light');
    const textSecondary = this.getCssVariable('--color-text-secondary');
    const border = this.getCssVariable('--color-border');

    const gradient = context.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.30)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.00)');

    this.salesChart = new Chart(context, {
      type: 'line',

      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],

        datasets: [
          {
            label: 'Sales',
            data: [18000, 32000, 28000, 48000, 39000],
            borderColor: primary || '#a855f7',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: primaryLight || '#c084fc',
            pointBorderColor: '#18161d'
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
              label: (context) =>
                `$${Number(context.parsed.y).toLocaleString('en-US')}`
            }
          }
        },

        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: textSecondary
            },
            border: {
              display: false
            }
          },

          y: {
            min: 0,
            max: 50000,

            ticks: {
              stepSize: 10000,
              color: textSecondary,
              callback: (value) => `$${Number(value) / 1000}k`
            },

            grid: {
              color: border || '#302c36'
            },

            border: {
              display: false,
              dash: [4, 4]
            }
          }
        }
      }
    });
  }

  private createOrdersChart(): void {
    const context = this.ordersCanvas.nativeElement;

    const primary = this.getCssVariable('--color-primary');
    const primaryLight = this.getCssVariable('--color-primary-light');
    const accent = this.getCssVariable('--color-accent');
    const border = this.getCssVariable('--color-border');

    this.ordersChart = new Chart(context, {
      type: 'doughnut',

      data: {
        labels: [
          'Completed',
          'Processing',
          'Pending',
          'Cancelled'
        ],

        datasets: [
          {
            data: [60, 20, 15, 5],

            backgroundColor: [
              primary || '#a855f7',
              primaryLight || '#c084fc',
              accent || '#e879f9',
              border || '#302c36'
            ],

            borderColor: '#18161d',
            borderWidth: 4,
            hoverOffset: 6
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label ?? '';
                const value = context.parsed;

                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.salesChart?.destroy();
    this.ordersChart?.destroy();
  }
}

