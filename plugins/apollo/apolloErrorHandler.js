// import { onError } from "apollo-link-error";
// export default function ({ store, app }, context) {
//   const errorLink = onError(({ graphQLErrors, networkError }) => {
//     if (
//       (graphQLErrors && graphQLErrors[0].extensions.code === "invalid-jwt") ||
//       (networkError && networkError.message.indexOf("JWTExpired") !== -1)
//     ) {
//       console.log(graphQLErrors)
//     }
//   });
// }

import { refreshToken } from "~/queries/auth/refreshToken";

export default async ({ graphQLErrors }, nuxtContext) => {
  // console.log("Global error handler");
  // console.log(graphQLErrors, networkError, operation, forward);
  const oldToken = nuxtContext.$apolloHelpers.getToken();
  if (graphQLErrors[0].extensions.code == "invalid-jwt") {
    await nuxtContext.$apolloHelpers.onLogout().then(async (_) => {
      try {
        const res = await nuxtContext.app.apolloProvider.clients.defaultClient
          .query({
            query: refreshToken,
            variables: {
              oldToken: oldToken,
            },
          })
          .then(({ data }) => data && data.refreshToken)
          .catch((err) => {
            console.log(err);
            if (err.message.startsWith("GraphQL error: ")) {
              console.log(err.message.substring(15));
            } else {
              console.log("Internal error. Please try again later");
            }
          });
        // console.log(res)
        nuxtContext.$apolloHelpers.onLogin(res.newToken);
        nuxtContext.app.router.go({
          path: nuxtContext.route.fullPath,
          force: true,
        });
      } catch (err) {
        // console.log("Unknown error");
        console.log(err);
        nuxtContext.$apolloHelpers.onLogout();
        nuxtContext.app.router.push("/auth/login");
      }
    });
  }
};
