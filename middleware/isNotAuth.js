export default function ({ app }) {
  const hasToken = !!app.$apolloHelpers.getToken();
  if (hasToken) {
    app.context.redirect("/home");
  }
}
