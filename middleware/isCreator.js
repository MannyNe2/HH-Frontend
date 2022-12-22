export default function ({ app, error }) {
  const token = app.$apolloHelpers.getToken();
  const isLoggedIn = !!token;
  if (isLoggedIn) {
    try {
      if (localStorage.userRole !== "creator") {
        // app.context.redirect("/home");
        error({ statusCode: 404, message: "Page not found" });
      }
    } catch (err) {
      console.log(err);
      app.$apolloHelpers.onLogOut();
      cleanupAndRedirect();
    }
  } else {
    cleanupAndRedirect();
  }
}

function cleanupAndRedirect() {
  app.$authHelper.cleanupUserInfo();
  app.context.redirect("/auth/login");
}
