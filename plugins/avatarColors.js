export default (_, inject) => {
  const colors = [
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "blue-grey",
  ];

  const random = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const avatarColors = {
    colors,
    random,
  };

  inject("avatarColors", avatarColors);
};
