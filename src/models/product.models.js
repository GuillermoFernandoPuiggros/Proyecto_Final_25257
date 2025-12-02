import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../data/data.js";

const productsCollection = collection(db, "products");

export const getAllProductsModel = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};

export const getProductByIdModel = async (id) => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Producto no encontrado");
  return { id: snap.id, ...snap.data() };
};

export const createProductModel = async (productData) => {
  const ref = await addDoc(productsCollection, {
    ...productData,
    createdAt: new Date().toISOString(),
  });
  return { id: ref.id, ...productData };
};

export const updateProductModel = async (id, productData) => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Producto no encontrado");
  await updateDoc(ref, { ...productData, updatedAt: new Date().toISOString() });
  const updatedSnap = await getDoc(ref);
  return { id: updatedSnap.id, ...updatedSnap.data() };
};

export const deleteProductModel = async (id) => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Producto no encontrado");
  await deleteDoc(ref);
  return { id };
};