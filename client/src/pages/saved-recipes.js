import Head from "next/head";
import AppLayout from "@/layouts/AppLayout";
import { useState, useEffect } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import Loader from "@/components/Loader/Loader";
import { motion } from "framer-motion";

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState([]);
  const userID = useGetUserID();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const promise = await axios.get(
          `https://baricare-app.herokuapp.com/recipes/saved-recipes/ids/${userID}`
        );
        setSavedRecipes(promise.data.savedRecipes);
        setTimeout(() => setIsLoading(false), 850);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSavedRecipes();
  }, []);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const promises = savedRecipes.map((recipe) =>
          axios.get(`https://baricare-app.herokuapp.com/recipes/${recipe}`)
        );
        const responses = await Promise.all(promises);
        const recipeDetails = responses.map((response) => response.data);
        setRecipeDetails(recipeDetails.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    if (savedRecipes.length > 0) {
      fetchRecipeDetails();
    } else {
      setRecipeDetails([])
    }
  }, [savedRecipes]);

  return (
    <>
      <AppLayout>
        <Head>
          <title>BariCare - Saved Recipes</title>
        </Head>
        <div className="main-wrap">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut"
              }}
            >
              <div className="home-wrap">
                <div className="home-intro">
                  <h1>Your Saved Recipes</h1>
                </div>
                {recipeDetails.length > 0 ? (
                  <ul className="recipes-list">
                    {recipeDetails.map((recipe) => (
                      <RecipeCard
                        recipe={recipe}
                        savedRecipes={savedRecipes}
                        userID={userID}
                        key={recipe._id}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No saved recipes found. Try saving some!</p>
                )}
              </div>
            </motion.div>
          </>
        )}
        </div>
      </AppLayout>
    </>
  );
}
