export const getToken = () => {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");
  let token = null;
  cookieArray.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    if (name === "token") {
      token = value;
    }
  });
  return token;
};
