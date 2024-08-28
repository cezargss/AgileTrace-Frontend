<template>
  <v-dialog v-model="active" inset persistent max-width="1200">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Novo Projeto</div>

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
          <v-col cols="12" class="pa-0 mt-2">
            <v-form ref="form">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    filled
                    label="Nome do Projeto"
                    :rules="rules.field"
                    v-model="project.name"
                  >
                  </v-text-field>
                </v-col>
                <v-col>
                  <div class="text-h7 dark--text">Data do projeto</div>
                  <date-picker v-model="dueDate" range></date-picker>
                </v-col>
              </v-row>

              <v-text-field
                filled
                label="Breve descrição"
                :rules="rules.field"
                v-model="project.description"
              >
              </v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  props: {
    active: false,
  },
  components: {
    DatePicker,
  },
  data() {
    return {
      dueDate: null,
      project: {
        name: "",
        description: "",
      },
      rules: {
        field: [(v) => !!v || "Campo obrigatório"],
      },
    };
  },

  methods: {
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
        await this.$http.post(`api/v1/projects`, {
          ...this.project,
          startDate: new Date(this.dueDate[0]),
          endDate: new Date(this.dueDate[1]),
        });
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.CREATED_SUCCESSFULLY
          )
        );
        this.project = {
          name: "",
          description: "",
        };
        this.$emit("update-list");
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },
  },
};
</script>
