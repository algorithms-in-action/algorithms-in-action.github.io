export const commaSeparatedNumberListValidCheck = (t) => {
  const regex = /^[0-9]+(,[0-9]+)*$/g;
  return t.match(regex);
};

export const singleNumberValidCheck = (t) => {
  const regex = /^\d+$/g;
  return t.match(regex);
};
