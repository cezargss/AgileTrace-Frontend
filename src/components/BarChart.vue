<template>
  <div>
    <BarChart :data="chartData" />
  </div>
</template>

<script>
import { Bar as BarChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  props: {
    report: Object,
    label: String,
  },
  components: {
    BarChart,
  },
  data() {
    return {
      chartData: {
        labels: this.report.labels,
        datasets: [
          {
            label: this.label,
            backgroundColor: "#42A5F5",
            data: this.report.data,
          },
        ],
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
