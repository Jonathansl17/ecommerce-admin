import * as productsService from "../services/products.service.js";

export const getAll = async (req, res) => {
  try {
    const products = await productsService.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const product = await productsService.getById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const product = await productsService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const product = await productsService.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const product = await productsService.remove(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
