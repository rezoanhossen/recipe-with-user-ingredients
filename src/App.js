import React, { useState } from "react";
import "./styles.css";

const API_KEY = "YOUR SPOONACULAR KEY";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecipesByIngredients = async () => {
    if (!ingredients) return alert("Please enter some ingredients.");
    const query = ingredients.replace(/\s+/g, "");

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&number=5&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes by ingredients:", error);
      alert("Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return alert("Please upload an image.");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const concepts = data.outputs?.[0]?.data?.concepts || [];
      const bestMatch = concepts[0]?.name;

      if (!bestMatch) {
        alert("Could not identify the food in the image.");
        return;
      }

      const recipeRes = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${bestMatch}&number=5&apiKey=${API_KEY}`
      );
      const recipeData = await recipeRes.json();
      setRecipes(recipeData.results || []);
    } catch (error) {
      console.error("Image analysis error:", error);
      alert("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="overlay" />
      <div className="content">
        <h1>🍽 Recipe Finder</h1>
        <p>Enter your ingredients and find the perfect recipe! 🧑‍🍳</p>

        <input
          type="text"
          placeholder="e.g., tomato, onion, cheese"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={fetchRecipesByIngredients}>🔍 Find Recipes</button>

        <h3>📷 Or upload an image of food</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleImageUpload}>🧠 Analyze Image & Find Recipes</button>

        {loading && <p style={{ marginTop: 20 }}>⏳ Loading recipes...</p>}

        <hr />

        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <div className="recipe-info">
                <h2>{recipe.title}</h2>
                <a
                  href={`https://spoonacular.com/recipes/${recipe.title.replace(
                    / /g,
                    "-"
                  )}-${recipe.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  🔗 View Full Recipe
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
