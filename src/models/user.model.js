import { db } from "../data/data.js";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from "firebase/firestore";

export const userModel = {
  async create(userData) {
    try {
      const { uid, email, nombre, rol = 'user', ubicacion = '', experiencia = '' } = userData;
      
      const userRef = doc(db, "users", uid);
      const userDoc = {
        uid,
        email,
        nombre,
        rol,
        ubicacion,
        experiencia,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(userRef, userDoc);
      return userDoc;
    } catch (error) {
      console.error("Error en userModel.create:", error);
      throw new Error("Error al crear usuario en Firestore");
    }
  },

  async getById(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("Usuario no encontrado");
      }
      
      return { id: userSnap.id, ...userSnap.data() };
    } catch (error) {
      console.error("Error en userModel.getById:", error);
      throw error;
    }
  },

  async getAll() {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      console.error("Error en userModel.getAll:", error);
      throw new Error("Error al obtener usuarios");
    }
  },

  async update(uid, updates) {
    try {
      const userRef = doc(db, "users", uid);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, updateData);
      
      const updatedDoc = await getDoc(userRef);
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      console.error("Error en userModel.update:", error);
      throw new Error("Error al actualizar usuario");
    }
  },

  async delete(uid) {
    try {
      const userRef = doc(db, "users", uid);
      await deleteDoc(userRef);
      return { success: true, message: "Usuario eliminado correctamente" };
    } catch (error) {
      console.error("Error en userModel.delete:", error);
      throw new Error("Error al eliminar usuario");
    }
  },

  async getByEmail(email) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("Error en userModel.getByEmail:", error);
      throw error;
    }
  }
};