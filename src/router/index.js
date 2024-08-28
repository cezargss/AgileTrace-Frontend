import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("../views/user-projects/ListUserProjects.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../views/auth/ResetPassword.vue"),
  },
  {
    path: "/app-navbar",
    name: "appNavbar",
    redirect: "project/:id",
    component: () => import("../AppNavbar.vue"),
    children: [
      {
        path: "/project/:id",
        name: "project-board",
        component: () => import("../views/project/Project.vue"),
      },
      {
        path: "/project/:id/users",
        name: "project-users",
        component: () => import("../views/project/ProjectUsers.vue"),
      },
      {
        path: "/project/:id/dashboards",
        name: "project-dashboards",
        component: () => import("../views/project/ProjectDashboard.vue"),
      },
      {
        path: "/project/:id/overview",
        name: "project-overview",
        component: () => import("../views/project/ProjectOverview.vue"),
      },
      {
        path: "/project/:id/releases",
        name: "project-releases",
        component: () => import("../views/project/ProjectRelease.vue"),
      },
      {
        path: "/project/:id/roles",
        name: "project-roles",
        component: () => import("../views/project/ProjectRoles.vue"),
      },
    ],
  },
  { path: "/*", redirect: "/login" },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
