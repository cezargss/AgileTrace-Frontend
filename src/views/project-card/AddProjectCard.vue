<template>
  <v-dialog v-model="active" inset persistent max-width="1200">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Adicionar Atividade</div>
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
          <v-col cols="12" class="pa-0 mt-2" justify="center" align="start">
            <v-form ref="form">
              <v-row>
                <v-col>
                  <v-select
                    v-model="formData.responsibleId"
                    item-id="id"
                    item-text="name"
                    item-value="id"
                    :items="users"
                    label="Responsável"
                    filled
                  ></v-select>
                </v-col>
                <v-col>
                  <v-select
                    v-model="formData.cardTypeId"
                    item-id="id"
                    item-text="name"
                    item-value="id"
                    :items="cardTypes"
                    label="Tipo do card"
                    filled
                  ></v-select
                ></v-col>
                <v-col>
                  <v-text-field
                    filled
                    label="Pontos de função"
                    :rules="rules.field"
                    v-model="formData.points"
                    type="number"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="3">
                  <div class="text-h7 dark--text">Data estimada</div>
                  <date-picker
                    v-model="formData.estimatedDate"
                    type="date"
                    style="width: 100%"
                    format="DD/MM/YYYY"
                  ></date-picker>
                </v-col>
              </v-row>

              <v-text-field
                filled
                label="Título"
                :rules="rules.field"
                v-model="formData.title"
              >
              </v-text-field>
              <v-textarea
                filled
                auto-grow
                label="Descrição"
                :rules="rules.field"
                v-model="formData.description"
              ></v-textarea>
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
    project: Object,
  },

  components: {
    DatePicker,
  },

  data() {
    return {
      formData: {
        title: "",
        description: "",
        responsibleId: {},
      },
      rules: {
        field: [(v) => !!v || "Campo obrigatório"],
      },
      users: [],
      cardTypes: [],
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
          role: pu.projectRole,
        }));
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      }
    },

    async listCardTypes() {
      try {
        this.cardTypes = await this.$http.get(`api/v1/card-types`);
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
        console.log(this.formData);
        await this.$http.post(`api/v1/projects/${this.project.id}/activities`, {
          ...this.formData,
          statusId: 1,
        });
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.CREATED_SUCCESSFULLY
          )
        );
        this.$emit("update-list");
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },

    itemProps(item) {
      return {
        title: item.name,
      };
    },
  },
  async mounted() {
    this.formData = {
      name: "",
      description: "",
      responsibleId: {},
    };
    this.listUsers();
    this.listCardTypes();
  },
};
</script>
