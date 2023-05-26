import AppLayout from "@/layouts/AppLayout";
import styles from "./[slug].module.scss";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from "axios";
import { FaRegClock  } from "react-icons/fa";
import { useGetUserID } from "@/hooks/useGetUserID";
import Loader from "@/components/Loader/Loader";
import { motion } from "framer-motion";
import LikeButton from "@/components/Button/LikeButton";
import Image from "next/image";

export default function RecipeDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [recipeAuthor, setRecipeAuthor] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);
  const userID = useGetUserID();
  const [isLoading, setIsLoading] = useState(true);
  const [nutritionalValues, setNutritionalValues] = useState(null);

  const fetchNutritionalValues = async (ingredients) => {
    try {
      const ingrParam = encodeURIComponent(ingredients.join(','));
      const url = `https://api.edamam.com/api/nutrition-data?app_id=906912a4&app_key=fed4aadf6db1e0c0d604ca51122f92ae&nutrition-type=cooking&ingr=${ingrParam}`;
      console.log("URL:", url);
      const response = await axios.get(url);
      setNutritionalValues(response.data);
      console.log("Nutritional Values:", response.data);
    } catch (error) {
      console.log("Could not get nutritional values.");
    }
  };

  useEffect(() => {
    if (recipe && recipe.ingredients) {
      fetchNutritionalValues(recipe.ingredients);
    }
  }, [recipe?.ingredients]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const promise = await axios.get(`https://baricare-app.herokuapp.com/recipes/`);
        const matchingRecipe = promise.data.find((recipe) => recipe.slug === slug);
        setRecipe(matchingRecipe);
        if (matchingRecipe) {
          const userID = matchingRecipe.userOwner;
          if (!userID) return;
          const promise = await axios.get(`https://baricare-app.herokuapp.com/auth/${userID}/username`);
          setRecipeAuthor(promise.data.username);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch(error) {
        console.log(error);
      }
    };
  
    const fetchSavedRecipes = async () => {
      try {
        const promise = await axios.get(
          `https://baricare-app.herokuapp.com/recipes/saved-recipes/ids/${userID}`
        );
        setSavedRecipes(promise.data.savedRecipes);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (slug) {
      fetchRecipe();
      fetchSavedRecipes();
      // fetchNutritionalValues();
    }
  }, [slug]);
  
  useEffect(() => {
    if (recipe && savedRecipes) {
      setIsRecipeSaved(savedRecipes.includes(recipe._id));
    }
  }, [recipe, savedRecipes]);

  const saveRecipe = async () => {
    try {
      await axios.put(`https://baricare-app.herokuapp.com/recipes/${recipe._id}`, {
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
      await axios.delete(`https://baricare-app.herokuapp.com/recipes/saved-recipes/ids/${userId}`, {
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
    } else {
      deleteRecipe(recipe._id, userID);
      setIsRecipeSaved(false);
    }
  };

  if (!recipe) {
    return (
      console.log("Recipe not found.")
    );
  }

  return (
    <>
      <AppLayout>
        <Head>
          <title>{recipe.name}</title>
        </Head>
        <div className="main-wrap">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {recipe ? (
            <>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: "easeOut"
                }}
              >
                <div className="home-wrap">
                  {/* recipe title, info and save button container */}
                  <div className="home-intro">
                    <span className={`username-home ${styles.title}`}>
                      {recipe.name}
                    </span>
                    <Image
                      unoptimized
                      className={styles.img}
                      src={recipe.imageUrl}
                      width="960"
                      height="320"
                      alt={recipe.name}
                      placeholder="blur"
                      blurDataURL="https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1784&q=80"
                    />
                    <div className={`flex flex-col sm:flex-row justify-between sm:gap-2 gap-4 ${styles.intro}`}>
                      {/* recipe title and author  */}
                      <div className="flex flex-col">
                        <span className={styles.spanInteract}>
                          <FaRegClock className={styles.Fa} />
                          {recipe.cookingTime} mins
                        </span>
                        <span className={styles.spanAuthor}>From: <span className={styles.recipeAuthor}>{recipeAuthor}</span> </span>
                      </div>
                      {/* add recipe to saved list button */}
                      <LikeButton isSaved={isRecipeSaved} handleClick={handleSaveClick} />
                    </div>
                    <p>{recipe.description}</p>

                    {/* // Inside the return statement, after the recipe description */}
                    <h1>Nutritional Values</h1>
                    {nutritionalValues && (
                      <div>
                        <p>Calories: {nutritionalValues.calories}</p>
                      </div>
                    )}

                    <h1>Ingredients</h1>
                    <ol className={`list-decimal list-inside ${styles.ol}`}>
                      {recipe.ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ol>
                    <h1>Instructions</h1>
                    <ol className={styles.ol}>
                      {recipe.instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                      ))}
                    </ol>
                    <h1>Enjoy!</h1>
                  </div>
                </div>
              </motion.div>
            </>
            ) : (
              <div>Recipe details not found...</div>
            )}
          </>
        )}
        </div>
      </AppLayout>
    </>
  );
}
