document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipeListKey = 'recipeList';
    const recipeContainer = document.getElementById('recipe-container');

    const saveRecipeToLocal = (recipeData) => {
        let recipeList = JSON.parse(localStorage.getItem(recipeListKey)) || [];
        recipeList.push(recipeData);
        localStorage.setItem(recipeListKey, JSON.stringify(recipeList));
        displayRecipes(); // Refresh recipes display after adding a new one
    };

    const removeRecipeFromLocal = (recipeName) => {
        let recipeList = JSON.parse(localStorage.getItem(recipeListKey)) || [];
        recipeList = recipeList.filter(recipe => recipe.name !== recipeName);
        localStorage.setItem(recipeListKey, JSON.stringify(recipeList));
        displayRecipes(); // Refresh recipes display after removing a recipe
    };

    const displayRecipes = () => {
        recipeContainer.innerHTML = ''; // Clear previous content

        let recipeList = JSON.parse(localStorage.getItem(recipeListKey)) || [];
        recipeList.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            const recipeName = document.createElement('h3');
            recipeName.textContent = recipe.name;

            const recipeCategory = document.createElement('p');
            recipeCategory.textContent = `Category: ${recipe.category}`;

            const recipeInstructions = document.createElement('p');
            recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.imageUrl;
            recipeImage.alt = recipe.name;

            const recipeVideo = document.createElement('iframe');
            if (recipe.videoUrl) {
                recipeVideo.src = recipe.videoUrl;
                recipeVideo.width = '100%';
                recipeVideo.height = '315';
                recipeVideo.allowFullscreen = true;
            }

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeRecipeFromLocal(recipe.name); // Pass the recipe name as the unique identifier
            });

            recipeCard.appendChild(recipeName);
            recipeCard.appendChild(recipeCategory);
            recipeCard.appendChild(recipeInstructions);
            recipeCard.appendChild(recipeImage);
            if (recipe.videoUrl) {
                recipeCard.appendChild(recipeVideo);
            }
            recipeCard.appendChild(removeButton);

            recipeContainer.appendChild(recipeCard);
        });
    };

    // Initial display of recipes when page loads
    displayRecipes();

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('recipe-name').value;
        const category = document.getElementById('recipe-category').value;
        const instructions = document.getElementById('recipe-instructions').value;
        const imageUrl = document.getElementById('recipe-image').value;
        const videoUrl = document.getElementById('recipe-video').value;

        const recipeData = {
            name,
            category,
            instructions,
            imageUrl,
            videoUrl
        };

        saveRecipeToLocal(recipeData);
        console.log('Recipe submitted and saved:', recipeData);

        // Optionally, you can clear the form fields after submission
        recipeForm.reset();
    });
});
