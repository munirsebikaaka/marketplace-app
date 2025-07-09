const userName = (user) => {
  const fullName = user?.name || "User";
  const firstName =
    fullName.split(" ")[0].charAt(0).toUpperCase() +
    fullName.split(" ")[0].slice(1);

  return firstName;
};
export default userName;
