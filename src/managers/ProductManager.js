import fs from "fs";

export default class ProductManager {
  // Constructor:
  constructor() {
    this.path = "src/files/products.json";
  }

  // Métodos:
  addProduct = async (product) => {
    // Recibe un objeto, le asigna un id autoincrementable y lo guarda en el arreglo:
    const products = await this.getProducts();

    if (products.length === 0) {
      product.id = 1;
    } else {
      product.id = products[products.length - 1].id + 1;
    }

    products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return products;
  };

  getProducts = async () => {
    // Lee el archivo de productos y devuelve todos los productos en formato de arreglo:
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };

  getProductById = async (id) => {
    // Recibe un id, y tras leer el archivo, busca el producto con el id especificado y lo devuelve en formato objeto:
    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === id);
    if (id === 0) {
      console.log("Error: id inexistente");
    } else if (productIndex === -1) {
      console.log("Error: producto no encontrado");
    } else {
      return console.log(products[productIndex]);
    }
  };

  updateProduct = async (pid, updateFields) => {
    // Recibe el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y actualiza el producto que tenga ese id en el archivo. SIN BORRAR SU ID:
    const products = await this.getProducts();

    const productIndex = products.findIndex(product => product.id === pid);

    if (productIndex !== -1) {
      const {pid, ...updatedFields} = updateFields;
      const updatedProduct = {
        ...products[productIndex],
        ...updatedFields,
        pid,
      };
      products[productIndex] = updatedProduct;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return updatedProduct;
    } else {
      return console.log("Error: producto no encontrado");
    }
  };

  deleteProduct = async (pid) => {
    // Recibe un id y elimina el producto que tenga ese id en el archivo:
    const products = await this.getProducts();

    const productIndex = products.findIndex((product) => product.id === pid);
    if (pid === 0) {
      console.log("Error: id inexistente");
    }
    if (productIndex === -1) {
      console.log("Error: producto no encontrado");
    } else {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return products;
    }
  };
};