import AppLayout from "@/layouts/AppLayout";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "@/hooks/useGetUserID";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import Loader from "@/components/Loader/Loader";
import { motion } from "framer-motion";

export default function Home() {

  const userID = useGetUserID();

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    // get list of all recipes
    const fetchRecipes = async () => {
      try {
        const promise = await axios.get("https://baricare-app-server.up.railway.app/recipes");
        const sortedRecipes = promise.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecipes(sortedRecipes);
        setTimeout(() => setIsLoading(false), 850);
      } catch(error) {
        console.log(error);
      }
    };

    // get saved recipes
    const fetchSavedRecipes = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const promise = await axios.get(
          `https://baricare-app-server.up.railway.app/recipes/saved-recipes/ids/${userID}`
        );
        setSavedRecipes(promise.data.savedRecipes);
      } catch (error) {
        console.log(error);
      }
    };

    // get username based on the userID that is saved as a local storage item
    const fetchUsername = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const promise = await axios.get(`https://baricare-app-server.up.railway.app/auth/${userID}/username`);
        setUsername(promise.data.username);
      } catch(error) {
        console.log(error || "Couldn't find username");
      }
    }
    fetchRecipes();
    fetchSavedRecipes();
    fetchUsername();
  }, []);

  return (
    <>
      <AppLayout>
        <Head>
          <title>BariCare</title>
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
              <main className="home-wrap">
                <div className="home-intro">
                  <h1><span className="username-home">Welcome {username},</span></h1>
                </div>
                <ul className="recipes-list">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      recipe={recipe}
                      savedRecipes={savedRecipes}
                      userID={userID}
                      key={recipe._id}
                    />
                    ))}
                </ul>
              </main>
            </motion.div>
          </>
          )}
        </div>
      </AppLayout>
    </>
  )
}