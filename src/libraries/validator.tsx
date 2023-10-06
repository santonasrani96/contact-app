export const containsSpecialCharacters = (value: string) => {
  const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (value.match(specialCharacters)) {
    return true;
  } else {
    return false;
  }
};
