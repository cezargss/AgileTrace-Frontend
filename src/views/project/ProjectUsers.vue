<template>
  <v-card flat>
    <v-row>
      <v-col col="12" class="headline"> Participantes </v-col>
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
      <v-btn class="ml-4" color="primary lighten-1" @click="addProjectUser()">
        Convidar
      </v-btn>
      <v-btn class="ml-4" color="secondary lighten-1" @click="exportToExcel()">
        Exportar
      </v-btn>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      :no-data-text="'Não há usuários cadastrados.'"
    >
      <template v-slot:item.actions="{ item }">
        <div style="display: flex; gap: 8px">
          <v-icon color="dark" size="medium" @click="editUser(item)">
            fas fa-edit
          </v-icon>

          <v-icon color="dark" size="medium" @click="confirmDelete(item)">
            fas fa-trash
          </v-icon>
        </div>
      </template>
    </v-data-table>

    <AddProjectUser
      v-if="activeAddProjectUser"
      :active="activeAddProjectUser"
      :project="project"
      @close-dialog="activeAddProjectUser = false"
      @update-list="listUsers()"
    ></AddProjectUser>

    <EditProjectUser
      v-if="activeEditProjectUser"
      :active="activeEditProjectUser"
      :project="project"
      :projectUser="selectedProjectUser"
      @close-dialog="onCloseEditDialog()"
      @update-list="onEdit()"
    ></EditProjectUser>

    <DeleteProjectUser
      v-if="activeDeleteProjectUser"
      :active="activeDeleteProjectUser"
      :project="project"
      :user="selectedProjectUser"
      @close-dialog="onCloseDeleteDialog()"
      @update-list="onDelete()"
    ></DeleteProjectUser>
  </v-card>
</template>
<script>
import AddProjectUser from "../project-user/AddProjectUser.vue";
import DeleteProjectUser from "../project-user/DeleteProjectUser.vue";
import EditProjectUser from "../project-user/EditProjectUser.vue";
import moment from "moment";

export default {
  props: {
    project: Object,
  },
  components: {
    AddProjectUser,
    DeleteProjectUser,
    EditProjectUser,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          value: "name",
          sortable: false,
          text: "Nome",
        },
        { value: "email", text: "Email" },
        { value: "roleName", text: "Cargo" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      users: [],
      activeAddProjectUser: false,
      activeDeleteProjectUser: false,
      activeEditProjectUser: false,
      selectedProjectUser: null,
      reRender: 0,
    };
  },
  methods: {
    async listUsers() {
      try {
        const projectUsers = await this.$http.get(
          `api/v1/projects/${this.project.id}/users`
        );

        this.users = projectUsers.map((pu) => ({
          ...pu.user,
          roleName: pu.projectRole?.name,
        }));

        console.log(this.users);
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      }
    },

    addProjectUser() {
      this.activeAddProjectUser = true;
    },

    editUser(item) {
      this.selectedProjectUser = { ...item };
      this.activeEditProjectUser = true;
    },

    onCloseEditDialog() {
      this.activeEditProjectUser = false;
      this.selectedProjectUser = null;
    },

    onEdit() {
      this.onCloseEditDialog();
      this.listUsers();
    },

    confirmDelete(item) {
      this.selectedProjectUser = { ...item };
      this.activeDeleteProjectUser = true;
    },

    onCloseDeleteDialog() {
      this.selectedProjectUser = null;
      this.activeDeleteProjectUser = false;
    },

    onDelete() {
      this.onCloseDeleteDialog();
      this.listUsers();
    },

    async exportToExcel() {
      const loader = await this.$loading.show();
      try {
        import("@/vendor/Export2Excel").then(async (excel) => {
          let headerTitle = ["Nome", "Email", "Cargo"];
          let headerVal = ["name", "email", "roleName"];
          const list = this.users;
          const data = await this.formatJson(headerVal, list);
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: `${this.project.name}_users_${moment(new Date()).format(
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
  mounted() {
    this.listUsers();
  },
};
</script>
