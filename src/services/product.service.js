import {
  getAllProductsModel,
  getProductByIdModel,
  createProductModel,
  updateProductModel,
  deleteProductModel,
} from "../models/product.models.js";

export const getAllProductsService = async () => {
  try {
    return await getAllProductsModel();
  } catch (error) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
};

export const getProductByIdService = async (id) => {
  try {
    if (!id) throw new Error("ID del producto es requerido");
    return await getProductByIdModel(id);
  } catch (error) {
    throw new Error(
      error.message.includes("Producto no encontrado")
        ? error.message
        : `Error al obtener el producto: ${error.message}`
    );
  }
};

export const createProductService = async (productData) => {
  try {
    if (!productData || Object.keys(productData).length === 0) {
      throw new Error("Los datos del producto son requeridos");
    }
    return await createProductModel(productData);
  } catch (error) {
    throw new Error(`Error al crear el producto: ${error.message}`);
  }
};

export const updateProductService = async (id, productData) => {
  try {
    if (!id) throw new Error("ID del producto es requerido");
    if (!productData || Object.keys(productData).length === 0) {
      throw new Error("Los datos del producto son requeridos");
    }
    return await updateProductModel(id, productData);
  } catch (error) {
    throw new Error(
      error.message.includes("Producto no encontrado")
        ? error.message
        : `Error al actualizar el producto: ${error.message}`
    );
  }
};

export const deleteProductService = async (id) => {
  try {
    if (!id) throw new Error("ID del producto es requerido");
    return await deleteProductModel(id);
  } catch (error) {
    throw new Error(
      error.message.includes("Producto no encontrado")
        ? error.message
        : `Error al eliminar el producto: ${error.message}`
    );
  }
};
