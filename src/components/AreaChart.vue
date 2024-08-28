<template>
  <div>
    <AreaChartComponent :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line as AreaChartComponent } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler
);

export default {
  props: {
    report: Object,
    label: String,
  },

  components: {
    AreaChartComponent,
  },
  data() {
    return {
      chartData: {
        labels: this.report.labels,
        datasets: [
          {
            label: this.label,
            backgroundColor: "rgba(66, 165, 245, 0.2)",
            borderColor: "#42A5F5",
            data: this.report.data,
            fill: true,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
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
