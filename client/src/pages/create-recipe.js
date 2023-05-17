import Head from "next/head";
import AppLayout from "@/layouts/AppLayout";
import styles from "@/styles/Recipes.module.scss";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useGetUserID } from "@/hooks/useGetUserID";
import { useRouter } from "next/router";
import slugify from "slugify";
import randomstring from "randomstring";
import { motion } from "framer-motion";
import Button from "@/components/Button/Button";

export default function createRecipe() {
  
    const userID = useGetUserID();
    const router = useRouter();

    const imageFormats = ["jpg", "jpeg", "png", "gif", "webp"];
      
    const [recipe, setRecipe] = useState({
    userOwner: "",
    name: "",
    description: "",
    slug: "",
    imageUrl: "",
    ingredients: [],
    cookingTime: 0,
    instructions: [],
    });
    
    useEffect(() => {
      setRecipe((prevRecipe) => ({ ...prevRecipe, userOwner: userID }));
    }, [userID]);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      
      if (name === "name") {
        const slug = slugify(value, { lower: true }) + "-" + randomstring.generate(3);
        setRecipe({ ...recipe, [name]: value, slug: slug });
      } else {
        setRecipe({ ...recipe, [name]: value });
      };
    };

    const handleBlur = (event) => {
      const { name, value } = event.target;
    
      if (name === "imageUrl") {
        const isImageFormatSupported = imageFormats.some((format) =>
          value.endsWith(`.${format}`)
        );
        if (!isImageFormatSupported) {
          notifyError("Invalid image format. Supported formats: " + imageFormats.join(", "));
          return;
        }
      }
    };

    const handleIngredientChange  = (event, index) => {
      const { value } = event.target;
      const ingredients = [...recipe.ingredients];

      if(!value) {
        notifyError("Ingredient field cannot be empty");
      } else {
        ingredients[index] = value;
        setRecipe({ ...recipe, ingredients });
      }
    };

    // sets recipe obj same as it was before but adds the ingredients
    const addIngredient = () => {
      setRecipe({ ...recipe, ingredients: [ ...recipe.ingredients, "" ] });
    };

    const handleInstructionsChange  = (event, index) => {
      const { value } = event.target;
      const instructions = [...recipe.instructions];
      if(!value) {
        notifyError("Instruction field cannot be empty");
      } else {
        instructions[index] = value;
        setRecipe({ ...recipe, instructions });
      }
    };

    // sets recipe obj same as it was before but adds the instructions
    const addInstruction = () => {
      setRecipe({ ...recipe, instructions: [ ...recipe.instructions, "" ] });
    };

    const notifySuccess = () => toast.success("Recipe created successfully!");
    const notifyError = (errorMessage) => toast.error(errorMessage || "Something went wrong!");

    const handleSubmit = async (event) => {
      event.preventDefault();
          
      // check if there is at least one non-empty ingredient
      const hasIngredient = recipe.ingredients.some((ingredient) => ingredient.trim() !== '');
        
      // check if there is at least one non-empty instruction
      const hasInstruction = recipe.instructions.some((instruction) => instruction.trim() !== '');
      
      // check if both ingredients and instructions are not empty
      if (!hasIngredient || !hasInstruction) {
        notifyError('Please add at least one ingredient and one instruction');
        return;
      }
      try {
        await axios.post("https://baricare-app.herokuapp.com/recipes", recipe);
        notifySuccess();
        setTimeout(() => {
          router.push('/');
        }, 6000);
      } catch (error) {
        notifyError(error.response.data.message);
      }
    };
    
  return (
    <>
      <AppLayout>
        <Head>
          <title>BariCare - Create Recipe</title>
        </Head>
        <div className="main-wrap">
          <>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0,
                delay: 0,
                ease: "easeOut"
              }}
            >
              <div className="home-wrap">
                <div className="create-recipe-wrap">
                  <div className="home-intro">
                    <h1>Create Recipe</h1>
                    <p>Fill out the form below to submit your very own bariatric-friendly recipe. </p>
                  </div>
                  <form className={styles["create-recipe-form"]} onSubmit={handleSubmit}>
                    <div className={styles["form-element"]}>
                      <label className={styles["label"]} htmlFor="name" >Name</label>
                      <input className={styles["input"]}
                          type="text"
                          id="name"
                          name="name"
                          required
                          onChange={handleChange}
                          maxLength={80}
                        />
                    </div>
                    <div className={styles["form-element"]}>
                      <label className={styles["label"]} htmlFor="description" >Description (optional)</label>
                      <textarea className={styles["textarea"]}
                          type="text"
                          id="description"
                          name="description"
                          onChange={handleChange} />
                    </div>
                    <input
                      type="hidden"
                      name="slug"
                      value={recipe.slug}
                    />
                    <div className={styles["form-element"]}>
                      <label className={styles["label"]} htmlFor="imageURL">Image URL</label>
                      <input className={styles["input"]}
                          type="text"
                          id="imageUrl"
                          name="imageUrl"
                          required
                          onChange={handleChange}
                          onBlur={handleBlur} />
                    </div>
                    <div className={styles["form-element"]}>
                      <label className={styles["label"]} htmlFor="ingredients">Ingredients (1 per line)</label>
                      {recipe.ingredients.map((ingredient, index) => (
                          <input
                              className={styles["input"]}
                              type="text"
                              key={index}
                              name="ingredients"
                              value={ingredient}
                              id="ingredients"
                              required
                              onChange={(event) => handleIngredientChange(event, index)} />
                      ))}
                      <Button type="button" buttonType="secondary" onClick={addIngredient} >Add Ingredient</Button>
                    </div>
                    <div className={styles["form-element"]}>
                      <label className={styles["label"]} htmlFor="cookingTime">Cooking time (in minutes)</label>
                      <input className={styles["input"]}
                          type="number"
                          id="cookingTime"
                          name="cookingTime"
                          required
                          onChange={handleChange}
                          min="2"
                          max="600"
                      />
                    </div>
                    <div className={styles["form-element"]}>
                      <label className={styles["label"]} htmlFor="instructions">Instructions (1 per line)</label>
                      {recipe.instructions.map((instructions, index) => (
                          <input
                              className={styles["input"]}
                              type="text"
                              key={index}
                              name="instructions"
                              value={instructions}
                              required
                              id="instructions"
                              onChange={(event) => handleInstructionsChange(event, index)} />
                      ))}
                      <Button type="button" buttonType="secondary" onClick={addInstruction} >Add Instruction</Button>
                    </div>
                    <Button type="submit" buttonType="primary">Submit Recipe</Button>
                  </form>
                  <div>
                      <ToastContainer
                          position="top-center"
                          autoClose={5000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                          theme="light"
                      />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        </div>
      </AppLayout>
    </>
  );
};