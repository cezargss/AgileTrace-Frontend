<template>
  <div @keydown.enter="submitForm()" class="bg">
    <v-form ref="redefinePasswordForm" class="my-16">
      <div class="w-full my-16">
        <v-container fluid class="my-16">
          <v-row dense>
            <v-col cols="12" justify="center" align="center">
              <v-card
                hide-details
                style="
                  width: 30% !important;
                  background-color: rgb(0, 0, 0, 0.35);
                "
                class="my-16 pt-10 mx-auto px-5 pt-3"
              >
                <v-col cols="12" justify="center" align="center">
                  <div class="sys-header">
                    <h1 class="white--text ml-4 mt-1">
                      <span
                        style="
                          font-weight: 1000 !important;
                          font-size: 33px;
                          text-transform: uppercase;
                        "
                      >
                        Agile Trace.
                      </span>
                    </h1>

                    <span class="white--text">Redefinir senha</span>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  class="pa-0 mt-2 my-7"
                  justify="center"
                  align="center"
                >
                  <v-text-field
                    v-model="auth.password"
                    ref="senha"
                    name="senha"
                    :rules="rules.password"
                    autocomplete="new-password"
                    label="Senha"
                    :type="showPass ? 'text' : 'password'"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPass = !showPass"
                    filled
                    hide-details
                    prepend-icon="mdi-lock-outline"
                    dark
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  justify="center"
                  align="center"
                  class="pa-0 mb-2"
                >
                  <v-text-field
                    v-model="auth.passwordConfirm"
                    ref="senha"
                    name="senha"
                    :rules="rules.passwordConfirm"
                    autocomplete="new-password-confirm"
                    label="Confirmar senha"
                    :type="showPassConfirm ? 'text' : 'password'"
                    :append-icon="showPassConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassConfirm = !showPassConfirm"
                    filled
                    hide-details
                    prepend-icon="mdi-lock-outline"
                    dark
                  >
                  </v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  class="pa-0 mt-7 mb-4"
                  justify="center"
                  align="center"
                >
                  <v-btn color="success" @click="submitForm()" dark x-large text
                    >Redefinir</v-btn
                  >
                </v-col>
                <v-divider></v-divider>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-form>
  </div>
</template>
<script>
import components from "@/components/export.js";
export default {
  components: {
    ...components,
  },
  data() {
    return {
      auth: {
        password: "",
        passwordConfirm: "",
      },
      showPass: false,
      showPassConfirm: false,
      rules: {
        password: [(v) => !!v, (v) => v.length > 5 || "Senha inválida!"],
        passwordConfirm: [
          (v) => !!v,
          (v) => v.length > 5,
          (v) => v == this.auth?.password || "Senhas não coincide,",
        ],
      },
      user: {},
    };
  },
  methods: {
    async submitForm() {
      if (this.$refs.redefinePasswordForm.validate()) {
        await this.redefinePassword();
      } else {
        this.$notify(
          this.$notificationHandler("app").warn(
            this.$translate.FILL_REQUIRED_FIELDS
          )
        );
      }
    },

    async redefinePassword() {
      let loader = await this.$loading.show();
      try {
        await this.$http.put(`api/v1/auth/redefine-password/${this.user.id}`, {
          password: this.auth.password,
        });
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.SUCCESS_REDEFINE_PASSWORD,
            this.$translate.SUCCESS_REDEFINE_PASSWORD_DESCRIPTION
          )
        );
        await loader.hide();
        await this.$router.push("login");
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(
            this.$translate.REDEFINE_PASSWORD_ERROR
          )
        );
        console.log(err);
      } finally {
        await loader.hide();
      }
    },

    async validateToken() {
      const loader = await this.$loading.show();
      try {
        const url_string = window.location.href;
        const url = new window.URL(url_string);

        this.user = await this.$http.post(`api/v1/auth/validate-token`, {
          token: url.searchParams.get("token"),
        });
        console.log(this.user);
        this.$notify(
          this.$notificationHandler("app").info(
            this.$translate.REDEFINE_CONFIRMED,
            this.$translate.REDEFINE_CONFIRMED_DESCRIPTION
          )
        );
        await loader.hide();
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(
            this.$translate.REDEFINE_PASSWORD_ERROR
          )
        );
      } finally {
        await loader.hide();
      }
    },
  },
  async mounted() {
    await this.validateToken();
  },
};
</script>
<style>
.bg {
  background: #0b6374;
}
</style>
