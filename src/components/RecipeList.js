import React from 'react';

const RecipeList = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          <img src={recipe.image} alt={recipe.title} />
          <h3>{recipe.title}</h3>
          <a
            href={`https://spoonacular.com/recipes/${recipe.title
              .toLowerCase()
              .replace(/ /g, '-')}-${recipe.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Recipe
          </a>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
