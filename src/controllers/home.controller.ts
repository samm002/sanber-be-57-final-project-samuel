import { Request, Response } from "express";

export default {
  apiHome(req: Request, res: Response) {
    try {
      res.status(200).send("<h1>Welcome to Toko Typescript API!</h1><h3>Repository link : <a href=\"https://github.com/samm002/sanber-be-57-final-project-samuel.git\">toko-typescript</a></h3>");

    } catch (error) {
      const _err = error as Error;

      res.status(500).json({
        message: "Error displaying api base url",
        error: _err.message,
      });
    }
  },
  homePage(req: Request, res: Response) {
    const endpoints = {
      Authentication: [
        { method: 'POST', endpoint: '/api/auth/register', description: 'Register user baru' },
        { method: 'POST', endpoint: '/api/auth/login', description: 'Login user' },
        { method: 'GET', endpoint: '/api/auth/me', description: 'Mendapatkan user profile' },
        { method: 'PUT', endpoint: '/api/auth/profile', description: 'Edit user profile' },
      ],
      Categories: [
        { method: 'GET', endpoint: '/api/categories', description: 'Mendapatkan semua categories' },
        { method: 'GET', endpoint: '/api/categories/:id', description: 'Mendapatkan category berdasarkan id' },
        { method: 'POST', endpoint: '/api/categories', description: 'Menambahkan category baru' },
        { method: 'PUT', endpoint: '/api/categories/:id', description: 'Edit category berdasarkan id' },
        { method: 'DELETE', endpoint: '/api/categories/:id', description: 'Hapus category berdasarkan id' },
      ],
      Products: [
        { method: 'GET', endpoint: '/api/products', description: 'Mendapatkan semua products' },
        { method: 'GET', endpoint: '/api/products/:id', description: 'Mendapatkan product berdasarkan id' },
        { method: 'POST', endpoint: '/api/products', description: 'Menambahkan product baru' },
        { method: 'PUT', endpoint: '/api/products/:id', description: 'Edit product berdasarkan id' },
        { method: 'DELETE', endpoint: '/api/products/:id', description: 'Hapus product berdasarkan id' },
      ],
      Orders: [
        { method: 'GET', endpoint: '/api/orders', description: 'Mendapatkan semua orders' },
        { method: 'GET', endpoint: '/api/orders/:id', description: 'Mendapatkan order berdasarkan id' },
        { method: 'POST', endpoint: '/api/orders', description: 'Menambahkan order baru' },
        { method: 'PUT', endpoint: '/api/orders/:id', description: 'Edit order berdasarkan id' },
        { method: 'DELETE', endpoint: '/api/orders/:id', description: 'Hapus order berdasarkan id' },
      ],
      "Upload File": [
        { method: 'POST', endpoint: '/api/upload', description: 'Upload single file' },
        { method: 'POST', endpoint: '/api/uploads', description: 'Upload multiple file' },
      ]
    };

    try {
      res.render('index', {endpoints});

    } catch (error) {
      const _err = error as Error;

      res.status(500).json({
        message: "Error displaying home page",
        error: _err.message,
      });
    }
  }
}