import { useState,  useEffect } from "react";
import Link from "next/link";
import { FaRegClock, FaRegHeart, FaHeart } from "react-icons/fa";
import axios from "axios";
import styles from "./RecipeCard.module.scss";
import LikeButton from "../Button/LikeButton";
import Button from "../Button/Button";
import Image from "next/image";

export default function RecipeCard({ recipe, savedRecipes, userID,  }) {
  const [isRecipeSaved, setIsRecipeSaved] = useState(savedRecipes.includes(recipe._id));
  const [recipeAuthor, setRecipeAuthor] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipeAuthor = async () => {
      try {
        const userID = recipe.userOwner;
        const promise = await axios.get(`http://localhost:3001/auth/${userID}/username`);
        setRecipeAuthor(promise.data.username);
      } catch(error) {
        console.log(error || "Couldn't find username");
      }
    };
    setIsRecipeSaved(savedRecipes.includes(recipe._id));
    fetchRecipeAuthor();
  }, [savedRecipes, recipe._id]);

  const saveRecipe = async () => {
    try {
      await axios.put(`http://localhost:3001/recipes/${recipe._id}`, {
        userId: userID,
      });
      setIsRecipeSaved(true);
      savedRecipes.push(recipe._id);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async (recipeId, userId) => {
    try {
      await axios.delete(`http://localhost:3001/recipes/saved-recipes/ids/${userId}`, {
        data: { recipeId }
      });
      setIsRecipeSaved(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveClick = () => {
    if (!isRecipeSaved) {
      saveRecipe();
      setIsRecipeSaved(true);
      // setIsSaved(!isSaved);
    } else {
      deleteRecipe(recipe._id, userID);
      setIsRecipeSaved(false);
    }
  };

  return (
    <li key={recipe._id}>
      <div className={styles.recipeCard}>
        <div className={styles.recipeCardImage}>
          <Link className="image-link" href={`/recipes/${recipe.slug}`} legacyBehavior>
            <Image
              unoptimized
              className={styles.imageUrl}
              src={recipe.imageUrl}
              width="450"
              height="320"
              alt={recipe.name}
              placeholder="blur"
              blurDataURL="https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1784&q=80"
            />
          </Link>
        </div>
        <h2 className={styles.recipeName}>{recipe.name}</h2>
        {/* display recipe cooking time and author */}
        <div className="flex flex-col sm:flex-row justify-between sm:gap-2 gap-4 p-4 sm:items-center">
          <div className="flex flex-col">
            <span className={styles.spanInteract}>
              <FaRegClock className={styles.Fa} style={{color: "#ebf2ff",}} />
              {recipe.cookingTime} mins
            </span>
            <span>From: <span className={styles.recipeAuthor}>{recipeAuthor}</span> </span>
          </div>
          {/* add recipe to saved list */}
          <LikeButton className={styles.likeButton} isSaved={isRecipeSaved} handleClick={handleSaveClick} />
        </div>
        {/* recipe details button */}
        <div className="flex flex-col sm:p-4 px-4">
          <Link href={`/recipes/${recipe.slug}`} legacyBehavior>
            <Button buttonType="primary">View Recipe</Button>
          </Link>
        </div>
      </div>
    </li>
  );
}