<template>
  <v-dialog v-model="active" inset persistent max-width="1200">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Convidar Usuário</div>
        <div>
          <v-btn
            color="success lighten-1"
            class="mr-4"
            outlined
            @click="submitForm()"
          >
            Enviar
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
        await this.save();
      } else {
        this.$notify(
          this.$notificationHandler("app").warn(
            this.$translate.FILL_REQUIRED_FIELDS
          )
        );
      }
    },

    async save() {
      const loader = await this.$loading.show();
      try {
        await this.$http.post(
          `api/v1/projects/${this.project.id}/users/invite`,
          this.formData
        );
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.CREATED_SUCCESSFULLY
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
      name: "",
      email: "",
      projectRoleId: "",
    };
  },
};
</script>
