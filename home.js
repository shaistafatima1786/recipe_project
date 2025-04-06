document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.input');
  const mealList = document.getElementById('meal');
  const mealDetailsContent = document.querySelector('.meal-details-content');

  const fetchMealData = async (val) => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`);
    const { meals } = await res.json();
    return meals;
  };

  const displayMeals = (meals) => {
    let html = '';
    if (meals) {
      meals.forEach(meal => {
        html += `
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">Get Recipe</a>
            </div>
          </div>`;
      });
    } else {
      html = `<p class="notFound">No meal found, please try again!</p>`;
    }
    mealList.innerHTML = html;
    attachRecipeButtons();
  };

  const attachRecipeButtons = () => {
    mealList.querySelectorAll('.recipe-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const mealItem = e.target.closest('.meal-item');
        const mealId = mealItem.getAttribute('data-id');
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const { meals } = await res.json();
        const meal = meals[0];
        const mealDetails = `
          <h2 class="recipe-title">${meal.strMeal}</h2>
          <p class="recipe-category">${meal.strCategory}</p>
          <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
          </div>
          <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
          </div>
          <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
          </div>`;
        mealDetailsContent.innerHTML = mealDetails;
        mealDetailsContent.parentElement.classList.add('showRecipe');
      });
    });
  };

  const searchMeal = async (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      const meals = await fetchMealData(val);
      displayMeals(meals);
    } else {
      alert('Please enter a search term');
    }
  };

  document.querySelector('.input-container').addEventListener('submit', searchMeal);

  const recipeCloseBtn = document.getElementById('recipe-close-btn');
  recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.innerHTML = '';
    mealDetailsContent.parentElement.classList.remove('showRecipe');
  });

  // Initial meal fetch to display meals on page load
  const initialFetch = async () => {
    let html = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let promises = alphabet.map(letter => fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          data.meals.forEach(meal => {
            html += `
              <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                  <img src="${meal.strMealThumb}" alt="food">
                </div>
                <div class="meal-name">
                  <h3>${meal.strMeal}</h3>
                  <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
              </div>`;
          });
        }
      })
      .catch(err => console.error(err))
    );

    await Promise.all(promises);
    mealList.innerHTML = html;
    attachRecipeButtons();
  };

  initialFetch();
});
