export default function (app, inject) {
  const cleanupUserInfo = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userDisplayName");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userAvatarUrl");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userIsVerified");
    localStorage.removeItem("userIsBanned");
  };
  const storeUserInfo = (user) => {
    localStorage.userId = user.userId;
    localStorage.userDisplayName = user.displayName;
    localStorage.userFirstName = user.firstName;
    localStorage.userLastName = user.lastName;
    localStorage.userAvatarUrl = user.avatarUrl;
    localStorage.userRole = user.role;
    localStorage.userIsVerified = user.isVerified;
    localStorage.userIsBanned = user.isBanned;
  };
  const isLoggedIn = () => !!app.$apolloHelpers.getToken();
  const getUserInfo = () => {
    if (isLoggedIn()) {
      const user = {
        id: localStorage.userId,
        displayName: localStorage.userDisplayName,
        firstName: localStorage.userFirstName,
        lastName: localStorage.userLastName,
        avatarUrl: localStorage.userAvatarUrl,
        role: localStorage.userRole,
        isVerified: localStorage.userIsVerified,
        isBanned: localStorage.userIsBanned,
      };
      return user;
    } else {
      return null;
      // this.$router.push('/auth/login')
    }
  };
  const updateUserInfo = ({
    displayName,
    firstName,
    lastName,
    avatarUrl,
  }) => {
    const user = {
      userId: localStorage.userId,
      displayName: displayName ? displayName : localStorage.userDisplayName,
      firstName: firstName ? firstName : localStorage.userFirstName,
      lastName: lastName ? lastName : localStorage.userLastName,
      avatarUrl: avatarUrl ? avatarUrl : localStorage.userAvatarUrl,
      role: localStorage.userRole,
      isVerified: localStorage.userIsVerified,
      isBanned: localStorage.userIsBanned,
    };
    console.log('update: ' + user)
    storeUserInfo(user);
  };

  const authHelper = {
    cleanupUserInfo,
    storeUserInfo,
    isLoggedIn,
    getUserInfo,
    updateUserInfo,
  };
  inject("authHelper", authHelper);
}
