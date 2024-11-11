// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  getFirestore,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBlRlkdGLKbGp3VoGLDEFf9VdZ5P-FbKSE",
  authDomain: "glam-your-kitchen.firebaseapp.com",
  projectId: "glam-your-kitchen",
  storageBucket: "glam-your-kitchen.firebasestorage.app",
  messagingSenderId: "951818646070",
  appId: "1:951818646070:web:7cdc7a565806376c7b1e97",
  measurementId: "G-TDK3GPZ2Y1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

////////////////////////  /////
// GlobalUploadImageFunction //
////////////////////////  /////

export const useUploadImage = () => {
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const uploadImage = async (file, bucketName) => {
    const result = {
      data: null,
      status: "pending",
    };

    console.log("Uploading image >>", file);
    console.log("Storage bucket >>", bucketName);

    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(storage, bucketName + file.name);

    try {
      setImageUploadLoading(true);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      console.log("uploading task initiated ... ");

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            setImageUploadProgress(parseInt(progress.toFixed(0)));

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            result.status = "error";
            result.error = error;
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            result.data = downloadURL;
            result.status = "success";
            setImageUploadLoading(false);
            resolve(downloadURL);
          }
        );
      });
    } catch (err) {
      console.error("Error occurred >>", err);
      result.status = "error";
      result.error = err;
    }

    return result;
  };

  return { imageUploadProgress, imageURL, imageUploadLoading, uploadImage };
};

// ////////////////////////////
//   Auth Related Functions //
// //////////////////////////

export const useAuthenticationFunctions = () => {
  const logout = async () => {
    await signOut(auth);
    localStorage.clear();
  };

  const login = async (email, password) => {
    console.log("logging in ... ");
    console.log("email >> ", email);
    console.log("password >> ", password);

    try {
      // Authenticate the user with the provided email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Return a success message or code
      return {
        success: true,
        message: "Login successful",
        loggedInUser: userCredential.user,
      };
    } catch (error) {
      // Handle authentication errors
      console.error("Login failed", error);

      // Return an error message or code
      return {
        success: false,
        error: error.code,
        message: error.message,
        loggedInUser: null,
      };
    }
  };

  const createNewUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed up: ", user);

      // Add user data to Firestore (including userId and isAdmin flag)
      await db.collection("users").doc(user.uid).set({
        userId: user.uid, // Include the user ID
        email: user.email,
        isAdmin: true, // Default to false for regular users
      });

      return {
        success: true,
        uid: user.uid,
        email: user.email,
        message: "User created successfully!",
      };
    } catch (error) {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Code: ", errorCode);
      console.log("Error Message: ", errorMessage);
      return {
        success: false,

        message: "User failed to create!",
      };
    }
  };

  const createClientUser = async () => {
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);

      // Extracting Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Extracting signed-in user info
      const user = result.user;

      // You can access user info such as displayName, email, photoURL, etc.
      console.log("User signed in successfully: ", user);

      // Add user data to Firestore (including userId and isAdmin flag)
      await db.collection("users").doc(user.uid).set({
        userId: user.uid, // Include the user ID
        email: user.email,
        isAdmin: false, // Default to false for regular users
      });

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error Code: ", errorCode);
      console.log("Error Message: ", errorMessage);
      return {
        success: false,
        message: "User failed to create!",
      };
    }
  };

  return {
    login,
    logout,
    createNewUser,
    createClientUser,
  };
};

// ///////////////////////////////
//   Product Related Functions //
// /////////////////////////////
export const useProductFunctions = () => {
  const addProduct = async (data) => {
    console.log("add_product()_initialized ...");
    console.log("product_data_to_use >> ", data);

    try {
      const newProductRef = doc(collection(db, "Products"));
      await setDoc(newProductRef, data);
      return {
        collection: "products",
        success: true,
        data: data,
        message: `product_added_succesfully`,
      };
    } catch (e) {
      console.log("Error in adding product >>> ", e);
      return {
        collection: "products",
        success: false,
        data: null,
        message: `product_adding_failed ${e}`,
      };
    }
  };

  const fetchAllProducts = async () => {
    console.log("fetch_all_products() initialized ...");
    const productCollectionRef = collection(db, "Products");
    try {
      const allProductsQuery = query(productCollectionRef);
      const allProductsSnapShot = await getDocs(allProductsQuery);
      console.log("all_products_snapshot >> ", allProductsSnapShot);

      if (allProductsSnapShot?.empty) {
        console.log("No Products Found");
        return {
          collection: "products",
          success: false,
          data: null,
          message: "No Products Found",
        };
      } else {
        console.log("all_product_snapshot >> ", allProductsSnapShot);
        const allProductsData = allProductsSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          collection: "products",
          success: true,
          data: allProductsData,
          message: `${allProductsData.length} products_found`,
        };
      }
    } catch (error) {
      console.log("Error in getting products >>> ", error);
      return {
        collection: "products",
        success: false,
        data: null,
        message: `product_fetching_failed ${error}`,
      };
    }
  };

  const fetchProductDetail = async (id) => {
    const productItemRef = doc(db, "Products", id);
    const productSnap = await getDoc(productItemRef);
    if (productSnap.exists()) {
      console.log("product_data >> ", productSnap?.data());
      const productData = { ...productSnap?.data(), id: id };
      return {
        success: true,
        data: productData,
        message: "product_found",
      };
    } else {
      console.log("No such document!");
      return {
        success: false,
        data: null,
        message: "product_not_found",
      };
    }
  };

  return { addProduct, fetchAllProducts, fetchProductDetail };
};

// ///////////////////////////////
//   Category Related Functions //
// ///////////////////////////////
export const useCategoriesFunctions = () => {
  const addCategory = async (data) => {
    console.log("add_category() initialized ...");
    console.log("category_data_to_use >> ", data);

    try {
      const newCategoryRef = doc(collection(db, "Categories"));
      await setDoc(newCategoryRef, data);
      return {
        collection: "categories",
        success: true,
        data: data,
        message: `category_added_successfully`,
      };
    } catch (e) {
      console.log("Error in adding category >>> ", e);
      return {
        collection: "categories",
        success: false,
        data: null,
        message: `category_adding_failed ${e}`,
      };
    }
  };

  // Function to fetch all categories
  const fetchAllCategories = async () => {
    console.log("fetch_all_categories() initialized ...");
    const categoryCollectionRef = collection(db, "Categories");
    try {
      const allCategoriesQuery = query(categoryCollectionRef);
      const allCategoriesSnapShot = await getDocs(allCategoriesQuery);
      console.log("all_categories_snapshot >> ", allCategoriesSnapShot);

      if (allCategoriesSnapShot?.empty) {
        console.log("No Categories Found");
        return {
          collection: "categories",
          success: false,
          data: null,
          message: "No Categories Found",
        };
      } else {
        const allCategoriesData = allCategoriesSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          collection: "categories",
          success: true,
          data: allCategoriesData,
          message: `${allCategoriesData.length} categories_found`,
        };
      }
    } catch (error) {
      console.log("Error in getting categories >>> ", error);
      return {
        collection: "categories",
        success: false,
        data: null,
        message: `category_fetching_failed ${error}`,
      };
    }
  };

  // Function to fetch a single category's details
  const fetchCategoryDetail = async (id) => {
    console.log("fetch_category_detail() initialized ...");
    const categoryItemRef = doc(db, "Categories", id);
    try {
      const categorySnap = await getDoc(categoryItemRef);
      if (categorySnap.exists()) {
        const categoryData = { ...categorySnap.data(), id: id };
        console.log("category_data >> ", categoryData);
        return {
          success: true,
          data: categoryData,
          message: "category_found",
        };
      } else {
        console.log("No such document!");
        return {
          success: false,
          data: null,
          message: "category_not_found",
        };
      }
    } catch (error) {
      console.log("Error in fetching category details >>> ", error);
      return {
        success: false,
        data: null,
        message: `category_fetching_failed ${error}`,
      };
    }
  };

  return { addCategory, fetchAllCategories, fetchCategoryDetail };
};
