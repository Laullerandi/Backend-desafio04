/*---- Websockets + Handlebars ----*/
import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;
const manager = new ProductManager();

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("client:newProduct", (product) => {
    manager.addProduct(product);
  });
  
  socket.on("client:deleteProduct", async pid => {
    await manager.deleteProduct(pid);
  });

  socket.emit("server:renderList");

  socket.on("client:renderList", async () => {
    const products = await manager.getProducts();
    io.emit("server:updateList", products);
  });
});