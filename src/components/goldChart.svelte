<script>
    import { Chart, Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronRightSolid, ChevronDownSolid } from 'flowbite-svelte-icons';
    export let price = [4000,500,1000,2400,2000,1800,2000] 
    export let categories = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    export let type = "Gold Price"
    export let color = "#FFD700"
    categories = categories.map((i, index) => {
        return i.substring(0, i.length - 5)
    })


    let options = {
    chart: {
      height: '300px',
      maxWidth: '100%',
      type: 'area', // change to 'line' for straight lines
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
        show: true,
      },
      y: {
        formatter: function (value) {
          return '$' + value.toFixed(2);
        }
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
      width: 3,
      curve: 'straight' // set curve to 'straight' for straight lines
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      }
    },
    series: [
      {
        name: 'Gold Price',
        data: price,
        color: color
      }
    ],
    xaxis: {
      categories: categories,
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
      show: true,
      labels: {
        formatter: function (value) {
          return 'Rs ' + value.toFixed(2);
        }
      }
    },
    markers: {
      size: 5,
      colors: [color],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    title: {
      text: 'Gold Price Trend',
      align: 'center',
      margin: 10,
      offsetY: 10,
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    subtitle: {
      text: 'Weekly Performance',
      align: 'center',
      margin: 20,
      offsetY: 30,
      style: {
        fontSize: '14px',
        color: '#888'
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 0,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 200
          },
          title: {
            offsetY: 5,
            style: {
              fontSize: '16px'
            }
          },
          subtitle: {
            offsetY: 15,
            style: {
              fontSize: '12px'
            }
          },
        }
      }
    ]
  };
  </script>
  
  <Card class="max-w-none">
    <div class="flex justify-between">
      <div>
        <h5 class="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">{type}</h5>
        <!-- <p class="text-base font-normal text-gray-500 dark:text-gray-400">{type}</p> -->
      </div>
      <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
        12%
        <ChevronRightSolid class="w-3 h-3 ms-1" />
      </div>
    </div>
    <Chart {options} />
  </Card>