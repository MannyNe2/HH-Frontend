export default (_, inject) => {
  const format = (amount, showCents = true) => {
    let [realString, decimalString] = amount.toFixed(2).toString().split(".");
    let money = "",
      count = 0;
    for (let i = realString.length - 1; i >= 0; i--) {
      if (count === 3) {
        money = "," + money;
        count = 0;
      }
      money = realString[i] + money;
      count++;
    }
    decimalString =
      decimalString === "00" || decimalString === "0"
        ? ""
        : `.${decimalString}`;

    const moneyString = showCents ? `${money}${decimalString}` : `${money}`;
    return moneyString;
  };

  const money = {
    format,
  };

  inject("money", money);
};
