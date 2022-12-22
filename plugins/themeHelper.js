export default ({ $vuetify }, inject) => {
  const getCurrentTheme = () => {
    const themeName = $vuetify.theme.isDark ? "dark" : "light";
    return $vuetify.theme.themes[themeName];
  };

  const getColor = (colorName) => {
    const currentTheme = getCurrentTheme();
    return currentTheme[colorName];
  };

  const setThemeColorOpacity = (themeColor, opacity) => {
    console.log(getColor("background"));
    return hexToRGBA(getColor(themeColor), opacity);
  };

  const themeHelper = {
    getCurrentTheme,
    getColor,
    setThemeColorOpacity,
  };

  inject("themeHelper", themeHelper);
};

function hexToRGBA(hexColor, opacity) {
  let hex = hexColor[0] === "#" ? hexColor.substring(1) : hexColor;
  if (hex.length === 3) {
    hex = shorthandHexToFull(hex);
  } else if (hex.length === 8) {
    hex = stripHexAlpha(hex);
  }
  const [r, g, b] = hex.match(/.{2}/g);
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${
    opacity ? opacity : "1"
  })`;
}

function shorthandHexToFull(shorthand) {
  let hex = shorthand;
  if (hex[0] === "#") hex = hex.substring(1);
  return `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
}
function stripHexAlpha(argbHex) {
  let hex = argbHex;
  if (hex[0] === "#") hex = hex.substring(1);
  return `${hex[2]}${hex[3]}${hex[4]}${hex[5]}${hex[6]}${hex[7]}`;
}
