import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../data/data.js";

const productsCollection = collection(db, "products");

export const getAllProductsModel = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(docSnap => ({ 
      id: docSnap.id, 
      ...docSnap.data() 
    }));
  } catch (error) {
    console.error("Error en getAllProductsModel:", error);
    throw new Error(`Error al obtener productos: ${error.message}`);
  }
};

export const getProductByIdModel = async (id) => {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    
    return { 
      id: snap.id, 
      ...snap.data() 
    };
  } catch (error) {
    console.error("Error en getProductByIdModel:", error);
    throw error;
  }
};

export const createProductModel = async (productData) => {
  try {
    const ref = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date().toISOString(),
    });
    
    return { 
      id: ref.id, 
      ...productData 
    };
  } catch (error) {
    console.error("Error en createProductModel:", error);
    throw new Error(`Error al crear producto: ${error.message}`);
  }
};

export const updateProductModel = async (id, productData) => {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    
    await updateDoc(ref, { 
      ...productData, 
      updatedAt: new Date().toISOString() 
    });
    
    const updatedSnap = await getDoc(ref);
    return { 
      id: updatedSnap.id, 
      ...updatedSnap.data() 
    };
  } catch (error) {
    console.error("Error en updateProductModel:", error);
    throw error;
  }
};

export const deleteProductModel = async (id) => {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    
    await deleteDoc(ref);
    return { 
      id,
      deleted: true 
    };
  } catch (error) {
    console.error("Error en deleteProductModel:", error);
    throw error;
  }
};