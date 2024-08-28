<template>
  <div>
    <PieChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie as PieChart } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  props: {
    report: Object,
    label: String,
  },
  components: {
    PieChart,
  },
  data() {
    return {
      // Mock data
      chartData: {
        labels: this.report.labels,
        datasets: [
          {
            label: this.label,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
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
                return `${context.label}: ${context.raw}`;
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
  max-width: 400px;
  margin: 0 auto;
}
</style>
