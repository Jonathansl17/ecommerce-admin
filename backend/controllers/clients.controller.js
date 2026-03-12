import * as clientsService from "../services/clients.service.js";

export const getAll = async (req, res) => {
  try {
    const clients = await clientsService.getAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const client = await clientsService.getById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const client = await clientsService.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const client = await clientsService.update(req.params.id, req.body);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const client = await clientsService.remove(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json({ message: "Client deleted", client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
