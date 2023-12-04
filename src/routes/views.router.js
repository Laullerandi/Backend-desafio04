import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

let socketInstance;

// Rutas:
router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.status(200).render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.status(200).render("realTimeProducts", { products });
});

router.post("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  const product = req.body;
  if (
    product.title &&
    product.description &&
    product.code &&
    product.price &&
    product.status &&
    product.stock &&
    product.category
  ) {
    await manager.addProduct(product);

    socketInstance.emit("server:newProduct", product);

    res.status(200).render("realTimeProducts", { products });
  } else
    return res
      .status(400)
      .send({
        status: "error",
        message: "Ingrese todos los campos requeridos",
      });
});

router.delete("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const deletedProduct = manager.deleteProduct(pid);

  if(deletedProduct) {
    socketInstance.emit("server:deleteProduct", pid);
    return res.status(200).send({ status: "success", message: "Producto eliminado" });
  }
  else {
    return res.status(404).send({message: "Producto no encontrado"});
  }
});


export default router;