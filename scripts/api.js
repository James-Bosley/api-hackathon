import { API_KEY, APP_ID } from "./keys.js";

// Base URL.
const BASE_URL = "https://trackapi.nutritionix.com/v2/natural";
// Required HTTP headers.
const headers = {
  headers: {
    "x-app-id": APP_ID,
    "x-app-key": API_KEY,
  },
};

// Returns array of nutrient information from a query.
export const queryNutrients = query => {
  const response = axios
    .post(`${BASE_URL}/nutrients`, { query }, headers)
    .then(res => {
      const foodData = [];
      res.data.foods.forEach(food => {
        // Extracts only the required data from the response.
        foodData.push({
          name: food.food_name,
          quantity: food.serving_qty,
          calories: food.nf_calories,
        });
      });
      return foodData;
    })
    .catch(err => console.log(err));
  return response;
};

// Returns array of exercise information from a query.
export const queryExercise = query => {
  const response = axios
    .post(`${BASE_URL}/exercise`, { query }, headers)
    .then(res => {
      const exerciseData = [];
      res.data.exercises.forEach(exercise => {
        // Extracts only the required data from the response.
        exerciseData.push({
          name: exercise.name,
          calories: exercise.nf_calories,
        });
      });
      return exerciseData;
    })
    .catch(err => console.log(err));
  return response;
};
