export default function ({ app }) {
  const hasToken = !!app.$apolloHelpers.getToken();
  if (!hasToken) {
    app.context.redirect("/auth/login");
  }
  else {
    if (localStorage.userIsBanned === "true") {
      app.context.redirect("/banned")
    }
  }
}
