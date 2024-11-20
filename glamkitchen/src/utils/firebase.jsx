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
import { useState, useCallback } from "react";

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
    const provider = new GoogleAuthProvider();

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
    try {
      const productDocRef = doc(db, "Products", id); // Assuming your products are in a collection called "Products"
      const productSnap = await getDoc(productDocRef);

      if (productSnap.exists()) {
        const productData = { ...productSnap.data(), id: id }; // Include the ID in the returned data
        return {
          success: true,
          data: productData,
          message: "Product found",
        };
      } else {
        return {
          success: false,
          data: null,
          message: "Product not found",
        };
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return {
        success: false,
        data: null,
        message: "Error fetching product",
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

// /////////////////////////////
//   Order Related Functions //
// ///////////////////////////
export const useOrdersFunctions = () => {
  // Add a new order to a specified sub-collection type
  const addOrder = async (data, type = "general") => {
    try {
      // Define the orders collection with type-based sub-collection
      const ordersCollectionRef = collection(db, "Orders", type, type);

      // Add default status to the data object
      const orderData = { ...data, status: "pending" };

      // Create a new document reference in the specified sub-collection
      const newOrderRef = doc(ordersCollectionRef);
      await setDoc(newOrderRef, orderData);

      return { success: true, message: "Order added successfully" };
    } catch (error) {
      return { success: false, message: "Failed to add the order", error };
    }
  };

  // Get all orders from a specific sub-collection and status
  const getAllOrdersbyStatus = async (orderStatus, type = "general") => {
    try {
      // Define the sub-collection path
      const ordersCollectionRef = collection(db, "Orders", type, type);
      const ordersQuery = query(
        ordersCollectionRef,
        where("status", "==", orderStatus)
      );

      const ordersSnapshot = await getDocs(ordersQuery);

      if (ordersSnapshot?.empty) {
        return {
          success: false,
          data: [],
          message: `No orders exist under the selected status: ${orderStatus}`,
        };
      } else {
        const orderData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return {
          success: true,
          data: orderData,
          message: "Orders retrieved successfully",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: "Failed to fetch orders",
        error,
      };
    }
  };

  // Update the status of an order by its ID in a specific sub-collection
  const updateOrderStatusById = async (id, status, type = "general") => {
    try {
      // Define the specific document path in the sub-collection
      const orderDocRef = doc(db, "Orders", type, type, id);

      // Check if the document exists
      const orderToUpdateSnapShot = await getDoc(orderDocRef);
      if (orderToUpdateSnapShot.exists()) {
        // Update the status of the order
        await updateDoc(orderDocRef, { status });
        return {
          success: true,
          message: "Order updated successfully",
          status,
        };
      } else {
        return {
          success: false,
          message: "Order not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to update the order",
        error,
      };
    }
  };

  // Get all orders from a specific sub-collection
  const getAllOrders = async (type = "general") => {
    try {
      // Define the sub-collection path
      const ordersCollectionRef = collection(db, "Orders", type, type);
      const ordersSnapshot = await getDocs(ordersCollectionRef);

      if (ordersSnapshot?.empty) {
        return {
          success: false,
          data: [],
          message: "No orders found",
        };
      } else {
        const orderData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return {
          success: true,
          data: orderData,
          message: "Orders retrieved successfully",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: "Failed to fetch orders",
        error,
      };
    }
  };

  return {
    addOrder,
    getAllOrders,
    getAllOrdersbyStatus,
    updateOrderStatusById,
  };
};
export const useNewslettersFunctions = () => {
  const addNewsletter = async (data) => {
    const newslettersCollectionRef = collection(db, "Newsletters");
    try {
      const newNewsletterRef = doc(newslettersCollectionRef);
      await setDoc(newNewsletterRef, data);
      return { success: true, message: "Newsletter added successfully" };
    } catch (error) {
      return { success: false, message: "Failed to add the Newsletter" };
    }
  };

  const getAllNewsletters = async () => {
    const newslettersCollectionRef = collection(db, "Newsletters");

    const newslettersSnapshot = await getDocs(newslettersCollectionRef);

    if (newslettersSnapshot?.empty) {
      console.log("No newsletter exists in the selected category");
      return {
        success: false,
        data: [],
        message: "No newsletter exists in the selected category",
      };
    } else {
      console.log(
        "newslettersSnapshot from getAllNewsletters >> ",
        newslettersSnapshot
      );
      const newslettersData = newslettersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return {
        success: true,
        data: newslettersData,
        message: "Newsletters exist in the selected category",
      };
    }
  };

  const updateNewsletterStatusId = async (id, status) => {
    console.log(`newsletter_id : ${id} || Status : ${status}`);
    const newslettersCollectionRef = doc(db, "Newsletters", id);
    try {
      const newsletterToUpdateSnapShot = await getDoc(newslettersCollectionRef);
      if (newsletterToUpdateSnapShot.exists()) {
        console.log(
          "newsletter_found_and_ready_for_update >> ",
          newsletterToUpdateSnapShot
        );
        await updateDoc(newslettersCollectionRef, {
          status: status,
        });
        return {
          success: true,
          message: "Newsletter updated Successfully",
          status: status,
        };
      }
    } catch (error) {
      console.log("error occurred trying to update a newsletter");
      return {
        success: false,
        message: "Failed to update the Newsletter",
        error: error,
      };
    }
  };

  const getAllNewslettersByStatus = async (status) => {
    const newslettersCollectionRef = collection(db, "Newsletters");
    const newslettersCollectionQuery = query(
      newslettersCollectionRef,
      where("status", "==", status)
    );
    try {
      const newsletterToUpdateSnapshot = await getDocs(
        newslettersCollectionQuery
      );
      console.log(
        "newsletter_found_and_ready_for_update >> ",
        newsletterToUpdateSnapshot
      );
      const newslettersSnapshotData = newsletterToUpdateSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
      return {
        success: true,
        message: "Newsletter updated Successfully",
        status: status,
        data: newslettersSnapshotData,
      };
    } catch (error) {
      console.log("error occurred trying to Fetch newsletters");
      return {
        success: false,
        message: "Failed to get the Newsletters",
        error: error,
        data: null,
      };
    }
  };

  return {
    addNewsletter,
    getAllNewsletters,
    updateNewsletterStatusId,
    getAllNewslettersByStatus,
  };
};

// ////////////////////////////
//   Cart Related Functions //
// //////////////////////////

export function useCartFunctions() {
  const CART_KEY = "cart";

  // Create a cart if one doesn't exist
  const createCart = useCallback(() => {
    const existingCart = localStorage.getItem(CART_KEY);

    if (existingCart) {
      console.log("Cart already exists:", JSON.parse(existingCart));
      return JSON.parse(existingCart);
    }

    const cartId = `cart_${Date.now()}`;
    const newCart = {
      cartId,
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    console.log("New cart created:", newCart);
    return newCart;
  }, []);

  // Add an item to the cart
  const addItemToCart = useCallback(
    (item) => {
      let cart = localStorage.getItem(CART_KEY);

      if (!cart) {
        cart = createCart(); // If no cart, create one
      } else {
        cart = JSON.parse(cart);
      }

      // Ensure price is an integer
      const price =
        typeof item.price === "string" ? parseInt(item.price, 10) : item.price;

      // Set the default quantity to 1 if not provided
      const quantity = item.quantity || 1;

      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Update quantity and subtotal for existing item
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal += quantity * price;
      } else {
        // Add new item
        const newItem = {
          ...item,
          price, // Ensure price is stored as a number
          quantity,
          subtotal: quantity * price,
        };
        cart.items.push(newItem);
      }

      // Update total quantity and price
      cart.totalQuantity += quantity;
      cart.totalPrice += quantity * price;

      // Save updated cart to local storage
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      console.log("Item added to cart:", cart);
      return { success: true, data: cart };
    },
    [createCart]
  );

  // Get the current cart
  const getCart = useCallback(() => {
    const cart = localStorage.getItem(CART_KEY);

    if (cart) {
      console.log("Fetched cart:", JSON.parse(cart));
      return JSON.parse(cart);
    } else {
      console.log("No cart found");
      return null;
    }
  }, []);

  // Delete an item from the cart
  const deleteCartItem = useCallback((itemId) => {
    const cart = localStorage.getItem(CART_KEY);

    if (!cart) {
      console.log("No cart found to delete item from");
      return null;
    }

    const parsedCart = JSON.parse(cart);

    // Filter out the item to be deleted
    const updatedItems = parsedCart.items.filter(
      (item) => item.productId !== itemId
    );

    if (updatedItems.length === parsedCart.items.length) {
      console.log("Item not found in cart");
      return parsedCart;
    }

    // Recalculate totals
    const updatedCart = {
      ...parsedCart,
      items: updatedItems,
      totalQuantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
    };

    // Save updated cart to local storage
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    console.log("Item deleted from cart:", updatedCart);
    return updatedCart;
  }, []);

  // Return all cart functions
  return { createCart, addItemToCart, getCart, deleteCartItem };
}
