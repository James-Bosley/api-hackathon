// Returns app state from localStorage / returns an empty data object.
export const loadData = () => {
  let foodsConsumed = [];
  let exerciseCompleted = [];
  let user = {};
  let nextIndex = { food: 0, exercise: 0 };
  if (localStorage.getItem("defecitData")) {
    const data = JSON.parse(localStorage.getItem("defecitData"));
    foodsConsumed = [...data.foodsConsumed];
    exerciseCompleted = [...data.exerciseCompleted];
    user = { ...data.user };
    nextIndex = { ...data.nextIndex };
  }
  return { foodsConsumed, exerciseCompleted, user, nextIndex };
};

// Stores current state in localStorage.
export const storeData = data => {
  if (!data) {
    localStorage.removeItem("defecitData");
    return;
  }
  localStorage.setItem("defecitData", JSON.stringify(data));
};

// Returns a specified element with classNames and content added.
export const elementCreator = (type, className = "", textContent = "") => {
  const element = document.createElement(type);
  if (typeof className === "string") {
    element.classList.add(className);
  } else {
    className.forEach(entry => element.classList.add(entry));
  }
  if (textContent) {
    element.innerText = textContent;
  }
  return element;
};

// Returns recommened calorie intake by gender and age.
export const getCalories = user => {
  if (!user.age) return 0;
  if (user.age < 30) {
    return user.gender === "m" ? 2600 : 2200;
  }
  if (user.age < 60) {
    return user.gender === "m" ? 2400 : 2000;
  }
  return user.gender === "m" ? 2200 : 1800;
};

export const getFatGrams = cals => {
  const grams = Math.round(Math.abs(cals) / 9);
  return cals < 0
    ? `Equivalent to losing ${grams}g of body fat`
    : `Equivalent to gaining ${grams}g of body fat`;
};

// Capitalises the first letter of a word, or recursively for every
// word in an array, and returns either as a string.
export const capitalise = input => {
  if (typeof input === "string") {
    return input[0].toUpperCase() + input.slice(1);
  }
  return input.map(str => capitalise(str)).join(" ");
};
