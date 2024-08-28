<template>
  <v-dialog v-model="active" inset persistent max-width="1200">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">EditarUsuário</div>
        <div>
          <v-btn
            color="success lighten-1"
            class="mr-4"
            outlined
            @click="submitForm()"
          >
            Salvar
          </v-btn>
          <v-btn color="danger lighten-1" outlined @click="updateActive()">
            Fechar
          </v-btn>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-row dense class="my-8">
          <v-col cols="12" class="pa-0 mt-2" justify="center" align="center">
            <v-form ref="form">
              <v-text-field
                ref="name"
                :rules="rules.name"
                v-model="formData.name"
                filled
                dense
                type="name"
                name="name"
                autocomplete="email"
                prepend-icon="mdi-account-outline"
                label="Nome"
                disabled
              ></v-text-field>

              <v-text-field
                :rules="rules.email"
                v-model="formData.email"
                ref="email"
                filled
                dense
                type="email"
                name="email"
                autocomplete="email"
                prepend-icon="mdi-email-outline"
                label="Email"
                disabled
              ></v-text-field>

              <v-select
                v-model="formData.projectRoleId"
                item-id="id"
                item-text="name"
                item-value="id"
                :items="roles"
                label="Cargo"
                filled
                prepend-icon="mdi-badge-account"
              ></v-select>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    active: false,
    project: Object,
    projectUser: Object,
  },

  data() {
    return {
      formData: {
        name: "",
        email: "",
        projectRoleId: "",
      },
      users: [],
      rules: {
        email: [(v) => !!v, (v) => /.+@.+/.test(v) || "Email inválido!"],
        name: [(v) => !!v || "Campo obrigatório"],
      },
      roles: [],
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

    updateActive() {
      this.$emit("close-dialog");
    },

    async submitForm() {
      if (this.$refs.form.validate()) {
        await this.update();
      } else {
        this.$notify(
          this.$notificationHandler("app").warn(
            this.$translate.FILL_REQUIRED_FIELDS
          )
        );
      }
    },

    async update() {
      const loader = await this.$loading.show();
      try {
        await this.$http.put(
          `api/v1/projects/${this.project.id}/users/${this.projectUser.id}`,
          this.formData
        );
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.UPDATED_SUCCESSFULLY
          )
        );
        this.$emit("update-list");
        this.updateActive();
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },
  },

  async mounted() {
    await this.listRoles();
    this.formData = {
      id: this.projectUser.id,
      name: this.projectUser.name,
      email: this.projectUser.email,
      projectRoleId: this.projectUser.role?.id,
    };
  },
};
</script>
