import { useState, useEffect } from "react";

export const useGetUserID = () => {
  const isLocalStorageAvailable = typeof localStorage !== "undefined";
  const [userID, setUserID] = useState(
    isLocalStorageAvailable ? localStorage.getItem("userID") : "userID"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUserID(localStorage.getItem("userID"));
    };

    if (isLocalStorageAvailable) {
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [isLocalStorageAvailable]);

  return userID;
};
