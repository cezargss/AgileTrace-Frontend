<template>
  <v-dialog v-model="active" inset persistent max-width="1200">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Editar Cargo</div>
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
                name="name"
                label="Nome"
              ></v-text-field>

              <v-text-field
                ref="description"
                :rules="rules.description"
                v-model="formData.description"
                filled
                dense
                name="description"
                label="Descrição"
              ></v-text-field>
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
    projectRole: Object,
  },

  data() {
    return {
      formData: {
        name: "",
        description: "",
      },
      rules: {
        name: [(v) => !!v || "Campo obrigatório"],
        description: [(v) => !!v || "Campo obrigatório"],
      },
    };
  },

  methods: {
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
          `api/v1/projects/${this.project.id}/roles/${this.projectRole.id}`,
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
  mounted() {
    this.formData = {
      id: this.projectRole.id,
      name: this.projectRole.name,
      description: this.projectRole.description,
    };
  },
};
</script>
