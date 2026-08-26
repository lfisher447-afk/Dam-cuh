export const validateAuth = (email, username, password, isLogin) => {
  const error = {};

  if (!email?.trim()) {
    error.emailError = "Email can't be empty";
  }

  if (!password?.trim()) {
    error.passwordError = "Password can't be empty";
  }

  if (!isLogin && !username?.trim()) {
    error.usernameError = "Username can't be empty";
  }
  return error;
};
