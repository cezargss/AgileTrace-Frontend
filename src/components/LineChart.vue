<template>
  <div>
    <LineChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default {
  props: {
    report: Object,
    label: String,
  },
  components: {
    LineChart,
  },
  data() {
    return {
      // Mock data
      chartData: {
        labels: this.report.labels,
        datasets: [
          {
            label: this.label,
            backgroundColor: "#42A5F5",
            borderColor: "#1E88E5",
            data: this.report.data,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
        },
      },
    };
  },
};
</script>

<style scoped>
div {
  max-width: 600px;
  margin: 0 auto;
}
</style>
