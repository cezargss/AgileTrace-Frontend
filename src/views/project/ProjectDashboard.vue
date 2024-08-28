<template>
  <div>
    <v-row class="mb-4" dense>
      <v-col class="headline"> Dashboard </v-col>
      <v-btn
        class="ml-4 hiddenDiv"
        color="secondary lighten-1"
        @click="printPage()"
      >
        Imprimir
      </v-btn>
    </v-row>

    <v-expansion-panels v-model="panel" :disabled="disabled" multiple>
      <v-expansion-panel>
        <div class="my-4 mx-4 text-h7 grey--text">Entregas</div>
        <v-row dense class="my-4">
          <v-col>
            <AreaChart
              v-if="reports.burnDown"
              :report="reports.burnDown"
              label="Burn Down (em meses)"
              class="my-4"
            >
            </AreaChart>
          </v-col>
          <v-col>
            <BarChart
              v-if="reports.storiesDelay"
              :report="reports.storiesDelay"
              label="Atraso das Estorias (em dias)"
              class="my-4"
            >
            </BarChart>
          </v-col>
        </v-row>
      </v-expansion-panel>

      <v-expansion-panel style="page-break-before: always">
        <div class="my-4 mx-4 text-h7 grey--text">Atividades</div>

        <v-row dense class="my-4">
          <v-col md="6">
            <BarChart
              v-if="reports.storiesByStatus"
              :report="reports.storiesByStatus"
              label="Atividades por Status"
            >
            </BarChart>
          </v-col>
          <v-col md="6">
            <BarChart
              v-if="reports.storiesByResponsible"
              :report="reports.storiesByResponsible"
              label="Atividades por Responsável"
            >
            </BarChart>
          </v-col>
        </v-row>
      </v-expansion-panel>

      <v-expansion-panel style="page-break-before: always" class="mb-8">
        <div class="my-4 mx-4 text-h7 grey--text">Tipos</div>
        <PieChart
          v-if="reports.storiesByType"
          :report="reports.storiesByType"
          label="Atividades por tipo"
          class="my-4"
        />
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import components from "@/components/export.js";
export default {
  props: {
    project: Object,
  },

  components: {
    ...components,
  },

  data() {
    return {
      panel: [0, 1],
      disabled: false,
      reports: [],
    };
  },

  methods: {
    async getReports() {
      const loader = await this.$loading.show();
      try {
        this.reports = await this.$http.get(
          `api/v1/projects/${this.project.id}/reports`
        );
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },
    printPage() {
      window.print();
    },
  },
  mounted() {
    this.getReports();
  },
};
</script>
