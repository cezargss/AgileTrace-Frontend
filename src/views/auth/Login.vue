<template>
  <div @keydown.enter="submitForm()" class="bg">
    <v-form ref="loginForm" class="my-16">
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
                    <span class="white--text">Login</span>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  class="pa-0 mt-2 my-7"
                  justify="center"
                  align="center"
                >
                  <v-text-field
                    :rules="rules.email"
                    v-model="auth.email"
                    ref="email"
                    filled
                    hide-details
                    dense
                    type="email"
                    name="email"
                    autocomplete="email"
                    prepend-icon="mdi-email-outline"
                    label="Email"
                    dark
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  justify="center"
                  align="center"
                  class="pa-0 mb-2"
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
                  class="pa-0 mt-7 mb-4"
                  justify="center"
                  align="center"
                >
                  <v-btn color="success" @click="submitForm()" dark x-large text
                    >Login</v-btn
                  >
                </v-col>
                <v-divider></v-divider>
                <v-col
                  cols="12"
                  justify="center"
                  align="end"
                  class="py-2 px-0 m-0"
                  ><v-btn
                    color="danger lighten-1"
                    small
                    text
                    @click="rememberPassword()"
                    >Esqueci Minha Senha</v-btn
                  >
                </v-col>
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
        email: "",
        password: "",
      },
      showPass: false,
      rules: {
        email: [(v) => !!v, (v) => /.+@.+/.test(v) || "Email inválido!"],
        password: [(v) => !!v, (v) => v.length > 5 || "Senha inválida!"],
      },
    };
  },
  methods: {
    async submitForm() {
      if (this.$refs.loginForm.validate()) {
        await this.login();
      } else {
        this.$notify(
          this.$notificationHandler("app").warn(
            this.$translate.FILL_REQUIRED_FIELDS
          )
        );
      }
    },
    async login() {
      const loader = await this.$loading.show();
      try {
        const user_auth = await this.$http.post(
          `api/v1/auth/sign-in`,
          this.auth
        );
        await this.setItemsLocalStorage(user_auth);
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.LOGIN_SUCCESSFULLY
          )
        );
        window.location.href = "/projects";
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.LOGIN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },

    async setItemsLocalStorage(user_auth) {
      localStorage.setItem("user", user_auth.user);
      localStorage.setItem("token", user_auth.token);
    },

    async rememberPassword() {
      if (await this.$refs["email"].validate(true)) {
        const loader = await this.$loading.show();
        try {
          await this.$http.post(`api/v1/auth/reset-password`, this.auth);
          this.$notify(
            this.$notificationHandler("app").success(
              this.$translate.REDEFINE_PASSWORD_SUCCESS
            )
          );
        } catch (err) {
          this.$notify(
            this.$notificationHandler("app").danger(
              this.$translate.REDEFINE_PASSWORD_ERROR
            )
          );
        } finally {
          await loader.hide();
        }
      } else {
        this.$notify(
          this.$notificationHandler("app").warn(
            this.$translate.FILL_REQUIRED_FIELDS
          )
        );
      }
    },
  },
};
</script>
<style>
.bg {
  background: #0b6374;
}
</style>
