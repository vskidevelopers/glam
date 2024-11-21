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
  addDoc,
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
  const deleteProduct = async (id) => {
    try {
      const productDocRef = doc(db, "Products", id);
      await deleteDoc(productDocRef);
      return {
        collection: "products",
        success: true,
        data: null,
        message: `product_deleted_successfully`,
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        collection: "products",
        success: false,
        data: null,
        message: `product_deletion_failed ${error}`,
      };
    }
  };

  return { addProduct, fetchAllProducts, fetchProductDetail, deleteProduct };
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
  const addOrder = async (data, type = "GENERAL") => {
    try {
      // Define the orders collection with type-based sub-collection
      const ordersCollectionRef = collection(db, "Orders", type, type);

      // Add default status to the data object
      const orderData = { ...data, status: "pending" };

      // Create a new document reference in the specified sub-collection
      const newOrderRef = doc(ordersCollectionRef);
      await setDoc(newOrderRef, orderData);

      return {
        success: true,
        message: "Order added successfully",
        orderId: newOrderRef.id,
      };
    } catch (error) {
      return { success: false, message: "Failed to add the order", error };
    }
  };

  // Get all orders from a specific sub-collection and status
  const getAllOrdersbyStatus = async (orderStatus, type = "GENERAL") => {
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
  const updateOrderStatusById = async (id, status, type = "GENERAL") => {
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
  const getAllOrders = async (type = "GENERAL") => {
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

  // Delete an order by its ID in a specific sub-collection
  const deleteOrder = async (id, type = "GENERAL") => {
    try {
      // Define the specific document path in the sub-collection
      const orderDocRef = doc(db, "Orders", type, type, id);

      // Delete the document
      await deleteDoc(orderDocRef);

      return {
        success: true,
        message: "Order deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete the order",
        error,
      };
    }
  };

  // Track an order by ID and phone number
  const trackOrder = async (orderId, phoneNumber) => {
    try {
      // Check in both sub-collections: "GENERAL" and "SPECIAL"
      const subCollections = ["GENERAL", "EXPRESS"];

      for (const type of subCollections) {
        const orderDocRef = doc(db, "Orders", type, type, orderId);
        const orderSnapshot = await getDoc(orderDocRef);

        if (orderSnapshot.exists()) {
          const orderData = { ...orderSnapshot.data(), id: orderSnapshot.id };
          console.log("order data fro tracking from firebase >> ", orderData);

          // Check if the phone number matches (if available)
          if (orderData?.customer?.phone === phoneNumber) {
            return {
              success: true,
              order: orderData,
              status: orderData.status,
              message: `Order ${orderId} found in ${type} sub-collection.`,
            };
          }
        }
      }

      // Order not found in either sub-collection
      return {
        success: false,
        status: null,
        message: `Order ${orderId} not found.`,
      };
    } catch (error) {
      return {
        success: false,
        status: null,
        message: "Failed to track the order",
        error,
      };
    }
  };

  const fetchOrderById = async (id) => {
    try {
      // Define the sub-collections to check
      const subCollections = ["EXPRESS", "GENERAL"];

      // Iterate through each sub-collection
      for (const type of subCollections) {
        const orderDocRef = doc(db, "Orders", type, type, id);
        const orderSnapshot = await getDoc(orderDocRef);

        if (orderSnapshot.exists()) {
          // Return the order data with its ID
          return {
            success: true,
            data: { id: orderSnapshot.id, ...orderSnapshot.data() },
            message: `Order retrieved successfully from ${type} sub-collection`,
          };
        }
      }

      // Order not found in either sub-collection
      return {
        success: false,
        data: null,
        message: "Order not found",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: "Failed to fetch the order",
        error,
      };
    }
  };

  return {
    addOrder,
    getAllOrders,
    getAllOrdersbyStatus,
    updateOrderStatusById,
    deleteOrder,
    trackOrder,
    fetchOrderById,
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
  const cartsCollectionRef = collection(db, "Carts");

  // Create a cart (Firebase version)
  const createCart = async () => {
    console.log("new cart creation initilized");

    try {
      const newCartDocRef = await addDoc(cartsCollectionRef, {
        items: [],
        totalPrice: 0,
        createdAt: new Date().toISOString(),
      });

      const cartId = newCartDocRef.id; // Get the auto-generated ID
      console.log("New cart created in Firebase:", cartId);
      return { success: true, data: cartId };
    } catch (error) {
      console.error("Error creating cart:", error);
      return { success: false, error };
    }
  };

  // Add an item to the cart (Firebase version)
  const addItemToCart = async (item) => {
    console.log("add item initilized in firebase >>> ", item);

    try {
      const cartId = localStorage.getItem("currentCartId"); // Get cart ID from local storage

      if (!cartId) {
        console.log("no cart exists to add your item");
        console.log("creating one ... ");

        const newCartResult = await createCart(); // Create a new cart if none exists
        if (newCartResult?.success) {
          cartId = newCartResult?.data;
          localStorage.setItem("currentCartId", cartId);
          console.log("cart created saved in local storage.");
        } else {
          return { success: false, error: newCartResult.error };
        }
      }

      const cartDocRef = doc(cartsCollectionRef, cartId);
      const cartSnapshot = await getDoc(cartDocRef);
      console.log(
        "cart snapshot after finding existing cart >> ",
        cartSnapshot
      );

      if (!cartSnapshot.exists()) {
        return { success: false, message: "Cart not found" };
      }

      const cartData = { id: cartSnapshot?.id, ...cartSnapshot.data() };
      console.log("cart data >>> ", cartData);

      // Ensure price is an integer
      const price =
        typeof item.price === "string" ? parseInt(item.price, 10) : item.price;

      // Set the default quantity to 1 if not provided
      const quantity = item.quantity || 1;

      const existingItemIndex = cartData?.items.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      console.log("existingItemIndex >>> ", existingItemIndex);

      if (existingItemIndex !== -1) {
        console.log(
          "item exists in the existing cart. Returning without updating."
        );
        alert("Cart item already exists!"); // Add the alert message
        return { success: true, data: cartData }; // Return the existing cart data
      } else {
        console.log(
          "item doesnot exist but a cart exist. adding new item to cart."
        );

        // Add new item
        const newItem = {
          ...item,
          price, // Ensure price is stored as a number
          quantity,
          subtotal: quantity * price,
        };
        cartData.items.push(newItem);

        // Update total quantity and price
        cartData.totalPrice += quantity * price;

        // Update the cart document in Firebase
        await updateDoc(cartDocRef, cartData);

        console.log("Item added to cart in Firebase:", cartData);
        return { success: true, data: cartData };
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      return { success: false, error };
    }
  };

  // Fetch the cart (Firebase version)
  const getCart = async () => {
    try {
      const cartId = localStorage.getItem("currentCartId");

      if (!cartId) {
        return { success: false, message: "No cart found" };
      }

      const cartDocRef = doc(cartsCollectionRef, cartId);
      const cartSnapshot = await getDoc(cartDocRef);

      if (!cartSnapshot.exists()) {
        return { success: false, message: "Cart not found" };
      }

      const cartData = cartSnapshot.data();
      console.log("Fetched cart from Firebase:", cartData);
      return { success: true, data: cartData };
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { success: false, error };
    }
  };

  // Delete an item from the cart (Firebase version)
  const deleteCartItem = async (itemId) => {
    try {
      const cartId = localStorage.getItem("currentCartId");

      if (!cartId) {
        return { success: false, message: "No cart found" };
      }

      const cartDocRef = doc(cartsCollectionRef, cartId);
      const cartSnapshot = await getDoc(cartDocRef);

      if (!cartSnapshot.exists()) {
        return { success: false, message: "Cart not found" };
      }

      const cartData = cartSnapshot.data();

      // Find the index of the item to delete
      const itemIndex = cartData?.items.findIndex((item) => item.id === itemId);

      if (itemIndex === -1) {
        return { success: false, message: "Item not found in cart" };
      }

      // Get the reference to the item document to delete
      const itemDocRef = doc(
        cartDocRef,
        "items",
        cartData.items[itemIndex].id // Assuming you have an 'id' field for each item
      );

      // Delete the item document
      await deleteDoc(itemDocRef);

      console.log("Item deleted from cart in Firebase:", itemId);
      return { success: true, data: itemId }; // Return the deleted item ID
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      return { success: false, error };
    }
  };

  // Update the quantity of an item in the cart
  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      const cartId = localStorage.getItem("currentCartId");

      if (!cartId) {
        return { success: false, message: "No cart found" };
      }

      const cartDocRef = doc(cartsCollectionRef, cartId);
      const cartSnapshot = await getDoc(cartDocRef);

      if (!cartSnapshot.exists()) {
        return { success: false, message: "Cart not found" };
      }

      const cartData = cartSnapshot.data();

      // Find the item to update
      const itemIndex = cartData.items.findIndex(
        (item) => item.productId === itemId
      );

      if (itemIndex === -1) {
        return { success: false, message: "Item not found in cart" };
      }

      // Update the item's quantity
      cartData.items[itemIndex].quantity = newQuantity;

      // Calculate the subtotal based on discount price if available
      const priceToUse = cartData.items[itemIndex].discountPrice
        ? parseFloat(cartData.items[itemIndex].discountPrice)
        : cartData.items[itemIndex].price;

      cartData.items[itemIndex].subtotal = newQuantity * priceToUse;

      // Recalculate the total price
      cartData.totalPrice = cartData.items.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      // Update the cart document in Firebase
      await updateDoc(cartDocRef, cartData);

      console.log("Item quantity updated in Firebase:", cartData);
      return { success: true, data: cartData };
    } catch (error) {
      console.error("Error updating item quantity:", error);
      return { success: false, error };
    }
  };
  return {
    createCart,
    addItemToCart,
    getCart,
    deleteCartItem,
    updateCartItemQuantity,
  };
}
