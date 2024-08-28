<template>
  <v-card flat>
    <v-row>
      <v-col col="12" class="headline"> Gerenciamento de Releases </v-col>
    </v-row>
    <v-card-text class="d-flex">
      <v-text-field
        v-model="search"
        label="Pesquisar"
        prepend-inner-icon="mdi-magnify"
        filled
        hide-details
        single-line
        dense
      ></v-text-field>
      <v-btn
        class="ml-4"
        color="primary lighten-1"
        @click="addProjectRelease()"
      >
        Nova release
      </v-btn>

      <v-btn class="ml-4" color="secondary lighten-1" @click="exportToExcel()">
        Exportar
      </v-btn>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="releases"
      :search="search"
      :no-data-text="'Não há cargos cadastrados.'"
    >
      <template v-slot:item.actions="{ item }">
        <div style="display: flex; gap: 8px">
          <v-icon color="dark" size="medium" @click="editRelease(item)">
            fas fa-edit
          </v-icon>

          <v-icon color="dark" size="medium" @click="confirmDelete(item)">
            fas fa-trash
          </v-icon>
        </div>
      </template>

      <template v-slot:item.releaseDate="{ item }">
        {{ moment(item.releaseDate).format("DD/MM/YYYY") }}
      </template>
    </v-data-table>

    <AddProjectRelease
      v-if="activeAddProjectRelease"
      :active="activeAddProjectRelease"
      :project="project"
      @close-dialog="activeAddProjectRelease = false"
      @update-list="listReleases()"
    ></AddProjectRelease>

    <EditProjectRelease
      v-if="activeEditProjectRelease"
      :active="activeEditProjectRelease"
      :project="project"
      :projectRelease="selectedProjectRelease"
      @close-dialog="onCloseEditDialog()"
      @update-list="onEdit()"
    ></EditProjectRelease>

    <DeleteProjectRelease
      v-if="activeDeleteProjectRelease"
      :active="activeDeleteProjectRelease"
      :project="project"
      :release="selectedProjectRelease"
      @close-dialog="onCloseDeleteDialog()"
      @update-list="onDelete()"
    ></DeleteProjectRelease>
  </v-card>
</template>
<script>
import AddProjectRelease from "../project-release/AddProjectRelease.vue";
import DeleteProjectRelease from "../project-release/DeleteProjectRelease.vue";
import EditProjectRelease from "../project-release/EditProjectRelease.vue";
import moment from "moment";
export default {
  props: {
    project: Object,
  },
  components: {
    AddProjectRelease,
    DeleteProjectRelease,
    EditProjectRelease,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          value: "version",
          sortable: true,
          text: "Versão",
        },
        {
          align: "start",
          value: "releaseDate",
          sortable: true,
          text: "Data de Lançamento",
        },
        {
          align: "start",
          value: "projectReleaseStatusName",
          sortable: true,
          text: "Status",
        },
        {
          align: "start",
          value: "description",
          sortable: false,
          text: "Descrição",
        },
        { text: "Ações", value: "actions", sortable: false },
      ],
      releases: [],
      activeAddProjectRelease: false,
      activeDeleteProjectRelease: false,
      activeEditProjectRelease: false,
      selectedProjectRelease: null,
    };
  },

  methods: {
    async listReleases() {
      try {
        const releases = await this.$http.get(
          `api/v1/projects/${this.project.id}/releases`
        );

        this.releases = releases.map((r) => {
          return {
            ...r,
            projectReleaseStatusName: r.projectReleaseStatus?.name,
          };
        });
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      }
    },

    addProjectRelease() {
      this.activeAddProjectRelease = true;
    },

    editRelease(item) {
      this.selectedProjectRelease = { ...item };
      this.activeEditProjectRelease = true;
    },

    onCloseEditDialog() {
      this.activeEditProjectRelease = false;
      this.selectedProjectRelease = false;
    },

    onEdit() {
      this.onCloseEditDialog();
      this.listReleases();
    },

    confirmDelete(item) {
      this.selectedProjectRelease = { ...item };
      this.activeDeleteProjectRelease = true;
    },

    onCloseDeleteDialog() {
      this.selectedProjectRelease = null;
      this.activeDeleteProjectRelease = false;
    },

    onDelete() {
      this.onCloseDeleteDialog();
      this.listReleases();
    },

    async exportToExcel() {
      const loader = await this.$loading.show();
      try {
        import("@/vendor/Export2Excel").then(async (excel) => {
          let headerTitle = [
            "Versão",
            "Data de lançamento",
            "Status",
            "Descrição",
          ];
          let headerVal = [
            "version",
            "releaseDate",
            "projectReleaseStatusName",
            "description",
          ];
          const list = this.releases;
          const data = await this.formatJson(headerVal, list);
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: `${this.project.name}_releases_${moment(
              new Date()
            ).format("DD/MM/YYYY")}`,
            autoWidth: false,
            bookType: "xlsx",
          });
        });
      } catch (err) {
        console.log(err);
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
  async mounted() {
    await this.listReleases();
  },
};
</script>
