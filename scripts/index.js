import { queryNutrients, queryExercise } from "./api.js";
import { elementCreator, getCalories, capitalise, loadData, storeData } from "./helpers.js";

// Data initialisation.
let data = loadData();

const calorieTotals = inputArr => {
  let totalCals = 0;
  inputArr.forEach(food => {
    totalCals += food.calories;
  });
  return Math.floor(totalCals);
};

// DOM manipulators.

// Changes styling based on calorie defecit.
const totalStyling = cals => {
  const classes = [
    "output__title--hidden",
    "output__title--positive",
    "output__title--negative",
    "output__text--positive",
    "output__text--negative",
  ];
  const header = document.querySelector(".output__title--total");
  const defecit = document.querySelector(".output__title--defecit");
  const surplus = document.querySelector(".output__title--surplus");
  const total = document.querySelector(".output--total");

  [header, defecit, surplus, total].forEach(element => {
    classes.forEach(className => element.classList.remove(className));
  });

  setTimeout(() => {
    if (cals < 1) {
      header.classList.add("output__title--positive");
      surplus.classList.add("output__title--hidden");
      total.classList.add("output__text--positive");
      return;
    }
    header.classList.add("output__title--negative");
    defecit.classList.add("output__title--hidden");
    total.classList.add("output__text--negative");
  }, 0);
};

// Displays total values, called when either list or user changes and stores new state.
const displayCalories = () => {
  const caloriesIn = calorieTotals(data.foodsConsumed);
  const calIn = document.querySelector(".output--calIn");
  calIn.innerText = caloriesIn;

  const caloriesOut = calorieTotals(data.exerciseCompleted);
  const calOut = document.querySelector(".output--calOut");
  calOut.innerText = caloriesOut;

  const calorieCalculation = caloriesIn - caloriesOut - getCalories(data.user);
  const total = document.querySelector(".output--total");
  total.innerText = Math.abs(calorieCalculation);
  totalStyling(calorieCalculation);

  storeData(data);
};

// Displays food list.
const displayFood = arr => {
  const listOutlet = document.querySelector(".list--calIn");
  listOutlet.innerHTML = "";

  arr.forEach(food => {
    const listItem = elementCreator("li", "list__item");

    const text = elementCreator("p", "list__text");
    text.innerText = `${food.quantity}x ${capitalise(food.name.split(" "))} - ${Math.floor(
      food.calories
    )} calories`;
    listItem.appendChild(text);

    listOutlet.appendChild(listItem);
  });

  displayCalories();
};

// Displays exercise list.
const displayExercise = arr => {
  const listOutlet = document.querySelector(".list--calOut");
  listOutlet.innerHTML = "";

  arr.forEach(activity => {
    const listItem = elementCreator("li", "list__item");

    const text = elementCreator("p", "list__text");
    text.innerText = `${capitalise(activity.name.split(" "))} - ${Math.floor(
      activity.calories
    )} calories`;
    listItem.appendChild(text);

    listOutlet.appendChild(listItem);
  });

  displayCalories();
};

// Displays user info.
const displayUser = usr => {
  const hook = document.querySelector(".about__outlet--aboutYou");
  hook.innerText = getCalories(usr) + " " + "calories";

  displayCalories();
};

// User inputs.

// Captures and updates user data.
const userForm = document.querySelector(".form--aboutYou");
userForm.addEventListener("submit", event => {
  event.preventDefault();

  data.user.gender = event.target.gender.value || data.user.gender;
  data.user.age = event.target.age.value || data.user.age;

  displayUser(data.user);
});

// Captures calorie intake.
const calorieIntakeForm = document.querySelector(".form--calIn");
calorieIntakeForm.addEventListener("submit", async event => {
  event.preventDefault();

  event.target.calIn.classList.remove("form__input--error");
  if (!event.target.calIn.value) {
    setTimeout(() => {
      event.target.calIn.classList.add("form__input--error");
      event.target.calIn.focus();
    }, 0);
    return;
  }

  const foods = await queryNutrients(event.target.calIn.value);
  foods.forEach(food => {
    data.foodsConsumed.push(food);
  });

  displayFood(data.foodsConsumed);
  event.target.calIn.value = "";
});

// Capture calories burned.
const calorieBurnedForm = document.querySelector(".form--calOut");
calorieBurnedForm.addEventListener("submit", async event => {
  event.preventDefault();

  event.target.calOut.classList.remove("form__input--error");
  if (!event.target.calOut.value) {
    setTimeout(() => {
      event.target.calOut.classList.add("form__input--error");
      event.target.calOut.focus();
    }, 0);
    return;
  }
  const exercise = await queryExercise(event.target.calOut.value);
  exercise.forEach(activity => {
    // Add the item to the consumed foods array.
    data.exerciseCompleted.push(activity);
  });

  displayExercise(data.exerciseCompleted);
  event.target.calOut.value = "";
});

displayFood(data.foodsConsumed);
displayExercise(data.exerciseCompleted);
displayUser(data.user);
