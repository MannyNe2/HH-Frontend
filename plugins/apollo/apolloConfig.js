export default (context) => {
  return {
    httpEndpoint: context.$config.httpEndpoint,
    wsEndpoint: context.$config.wsEndpoint
  }
}