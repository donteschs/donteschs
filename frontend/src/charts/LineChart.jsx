import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const LineChart = ({ data, label }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label,
        data: data.map((item) => item.value),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.2)',
        tension: 0.35,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: 'rgba(148,163,184,.08)' } },
      y: { grid: { color: 'rgba(148,163,184,.08)' } },
    },
  }

  return <Line data={chartData} options={options} />
}

export default LineChart
