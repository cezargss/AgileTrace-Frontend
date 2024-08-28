<template>
  <v-container class="mx-auto">
    <SystemBar></SystemBar>

    <v-row class="my-8">
      <v-col
        cols="4"
        align="center"
        v-for="(project, index) in projects"
        :key="index"
      >
        <v-card
          outlined
          link
          @click="goToProject(project.id)"
          class="fill-height"
        >
          <v-card-title class="justify-center">
            {{ project.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ moment(project?.startDate).format("DD/MM/YYYY") }} até
            {{ moment(project?.endDate).format("DD/MM/YYYY") }}
            ({{ getProjectTime(project) }})
          </v-card-subtitle>
          <v-card-text>
            {{ project?.description }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4" align="center" justify="center">
        <v-card
          outlined
          link
          class="fill-height"
          color="primary"
          @click="activeAddUserProject = true"
        >
          <v-card-title class="card-center white--text">
            Novo Projeto +
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <AddUserProject
      :active="activeAddUserProject"
      @close-dialog="activeAddUserProject = false"
      @update-list="
        activeAddUserProject = false;
        listUserProjects();
      "
    ></AddUserProject>
  </v-container>
</template>
<script>
import components from "@/components/export.js";
import AddUserProject from "./AddUserProject";
import moment from "moment";

export default {
  components: {
    ...components,
    AddUserProject,
  },
  data() {
    return {
      projects: [],
      activeAddUserProject: false,
    };
  },
  methods: {
    async listUserProjects() {
      const loader = await this.$loading.show();
      try {
        this.projects = await this.$http.get(`api/v1/projects`);
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },

    goToProject(projectId) {
      this.$router.push({ path: `/project/${projectId}/overview` });
    },

    getProjectTime(project) {
      const startDate = moment(project?.startDate);
      const endDate = moment(project?.endDate);

      const years = endDate.diff(startDate, "years");
      const months = endDate.diff(startDate, "months") % 12;
      const days = endDate.diff(startDate, "days");

      if (years > 0) {
        let yearText = years === 1 ? "ano" : "anos";
        let monthText = months === 1 ? "mes" : "meses";

        if (months > 0) {
          return `${years} ${yearText} e ${months} ${monthText}`;
        } else {
          return `${years} ${yearText}`;
        }
      }

      if (months > 0) {
        let monthText = months === 1 ? "mês" : "meses";
        return `${months} ${monthText}`;
      }

      if (days > 0) {
        let dayText = days === 1 ? "dia" : "dias";
        return `${days} ${dayText}`;
      }

      return "0 dias";
    },
  },
  mounted() {
    this.listUserProjects();
  },
};
</script>
<style scoped>
.card-center {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
