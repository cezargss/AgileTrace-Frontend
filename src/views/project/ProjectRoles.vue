<template>
  <v-card flat>
    <v-row>
      <v-col col="12" class="headline"> Cargos </v-col>
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
      <v-btn class="ml-4" color="primary lighten-1" @click="addProjectRole()">
        Adicionar
      </v-btn>
      <v-btn class="ml-4" color="secondary lighten-1" @click="exportToExcel()">
        Exportar
      </v-btn>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="roles"
      :search="search"
      :no-data-text="'Não há cargos cadastrados.'"
    >
      <template v-slot:item.actions="{ item }">
        <div style="display: flex; gap: 8px">
          <v-icon color="dark" size="medium" @click="editRole(item)">
            fas fa-edit
          </v-icon>

          <v-icon color="dark" size="medium" @click="confirmDelete(item)">
            fas fa-trash
          </v-icon>
        </div>
      </template>
    </v-data-table>

    <AddProjectRole
      v-if="activeAddProjectRole"
      :active="activeAddProjectRole"
      :project="project"
      @close-dialog="activeAddProjectRole = false"
      @update-list="listRoles()"
    ></AddProjectRole>

    <EditProjectRole
      v-if="activeEditProjectRole"
      :active="activeEditProjectRole"
      :project="project"
      :projectRole="selectedProjectRole"
      @close-dialog="onCloseEditDialog()"
      @update-list="onEdit()"
    ></EditProjectRole>

    <DeleteProjectRole
      v-if="activeDeleteProjectRole"
      :active="activeDeleteProjectRole"
      :project="project"
      :role="selectedProjectRole"
      @close-dialog="onCloseDeleteDialog()"
      @update-list="onDelete()"
    ></DeleteProjectRole>
  </v-card>
</template>
<script>
import AddProjectRole from "../project-role/AddProjectRole.vue";
import DeleteProjectRole from "../project-role/DeleteProjectRole.vue";
import EditProjectRole from "../project-role/EditProjectRole.vue";
import moment from "moment";

export default {
  props: {
    project: Object,
  },
  components: {
    AddProjectRole,
    DeleteProjectRole,
    EditProjectRole,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          value: "name",
          sortable: true,
          text: "Nome",
        },
        {
          align: "start",
          value: "description",
          sortable: false,
          text: "Descrição",
        },
        { text: "Ações", value: "actions", sortable: false },
      ],
      roles: [],
      activeAddProjectRole: false,
      activeDeleteProjectRole: false,
      activeEditProjectRole: false,
      selectedProjectRole: null,
    };
  },

  methods: {
    async listRoles() {
      try {
        this.roles = await this.$http.get(
          `api/v1/projects/${this.project.id}/roles`
        );
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      }
    },

    addProjectRole() {
      this.activeAddProjectRole = true;
    },

    editRole(item) {
      this.selectedProjectRole = { ...item };
      this.activeEditProjectRole = true;
    },

    onCloseEditDialog() {
      this.activeEditProjectRole = false;
      this.selectedProjectRole = false;
    },

    onEdit() {
      this.onCloseEditDialog();
      this.listRoles();
    },

    confirmDelete(item) {
      this.selectedProjectRole = { ...item };
      this.activeDeleteProjectRole = true;
    },

    onCloseDeleteDialog() {
      this.selectedProjectRole = null;
      this.activeDeleteProjectRole = false;
    },

    onDelete() {
      this.onCloseDeleteDialog();
      this.listRoles();
    },

    async exportToExcel() {
      const loader = await this.$loading.show();
      try {
        import("@/vendor/Export2Excel").then(async (excel) => {
          let headerTitle = ["Nome", "Descrição"];
          let headerVal = ["name", "description"];
          const list = this.roles;
          const data = await this.formatJson(headerVal, list);
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: `${this.project.name}_cargos_${moment(new Date()).format(
              "DD/MM/YYYY"
            )}`,
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
    await this.listRoles();
  },
};
</script>
