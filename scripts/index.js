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

// Displays total values, called when either list or user changes and stores new state.
const displayCalories = () => {
  const caloriesIn = calorieTotals(data.foodsConsumed);
  const calIn = document.querySelector(".output__section--calIn");
  calIn.innerText = caloriesIn;

  const caloriesOut = calorieTotals(data.exerciseCompleted);
  const calOut = document.querySelector(".output__section--calOut");
  calOut.innerText = caloriesOut;

  const total = document.querySelector(".output__section--total");
  total.innerText = caloriesIn - caloriesOut - getCalories(data.user);

  storeData(data);
};

// Displays food list.
const displayFood = arr => {
  const listOutlet = document.querySelector(".input__outlet--calIn");
  listOutlet.innerHTML = "";

  arr.forEach(food => {
    const listItem = elementCreator("li", "input__outlet-item");

    const text = elementCreator("p", "input__outlet-text");
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
  const listOutlet = document.querySelector(".input__outlet--calOut");
  listOutlet.innerHTML = "";

  arr.forEach(activity => {
    const listItem = elementCreator("li", "input__outlet-item");

    const text = elementCreator("p", "input__outlet-text");
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
  const hook = document.querySelector(".input__outlet--aboutYou");
  hook.innerText = getCalories(usr);

  displayCalories();
};

// User inputs.

// Captures and updates user data.
const userForm = document.querySelector(".form--aboutYou");
userForm.addEventListener("submit", event => {
  event.preventDefault();

  data.user.gender = event.target.gender.value;
  data.user.age = event.target.age.value;

  displayUser(data.user);
});

// Captures calorie intake.
const calorieIntakeForm = document.querySelector(".form--calIn");
calorieIntakeForm.addEventListener("submit", async event => {
  event.preventDefault();

  if (!event.target.calIn.value) {
    return; // TODO validate input properly.
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

  if (!event.target.calOut.value) {
    return; // TODO validate input properly.
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
