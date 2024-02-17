<script>
    import { Chart, Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronRightSolid, ChevronDownSolid } from 'flowbite-svelte-icons';
  
    let options = {
      chart: {
        height: '400px',
        maxWidth: '100%',
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      tooltip: {
        enabled: true,
        x: {
          show: false
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2']
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 6
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        }
      },
      series: [
        {
          name: 'Silver Price',
          data: [1000,800,1200,500,1200,1000,200],
          color: '#C0C0C0'
        }
      ],
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        labels: {
          show: true
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        }
      },
      yaxis: {
        show: true
      }
    };
  </script>
  
  <Card>
    <div class="flex justify-between">
      <div>
        <h5 class="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">Silver Price</h5>
        <!-- <p class="text-base font-normal text-gray-500 dark:text-gray-400">Silver Price</p> -->
      </div>
      <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
        12%
        <ChevronRightSolid class="w-3 h-3 ms-1" />
      </div>
    </div>
    <Chart {options} />
  </Card>