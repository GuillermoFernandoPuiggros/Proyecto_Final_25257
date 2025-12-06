import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  deleteProductService,
  updateProductService,
} from "../services/product.service.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json({
      success: true,
      message: "Productos obtenidos exitosamente",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener los productos",
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        message: "El ID del producto es requerido",
      });
    }
    const product = await getProductByIdService(id);
    res.status(200).json({
      success: true,
      message: "Producto obtenido exitosamente",
      data: product,
    });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error al obtener el producto",
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    if (!productData || Object.keys(productData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        message: "Se requieren datos para crear el producto",
      });
    }
    const newProduct = await createProductService(productData);
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al crear el producto",
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        message: "El ID del producto es requerido",
      });
    }
    if (!productData || Object.keys(productData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        message: "Se requieren datos para actualizar el producto",
      });
    }
    const updatedProduct = await updateProductService(id, productData);
    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: updatedProduct,
    });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error al actualizar el producto",
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        message: "El ID del producto es requerido",
      });
    }
    await deleteProductService(id);
    res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error al eliminar el producto",
      message: error.message,
    });
  }
};

