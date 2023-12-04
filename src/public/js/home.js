const socket = io();

const form = document.getElementById("form");
const deleteBtns = document.querySelectorAll(".delete-btn");

const textbox = document.getElementById("textbox");

const addProduct = (product) => {
  socket.emit("client:newProduct", product);
};

const updateProducts = (products) => {
  textbox.innerHTML = "";

  products.forEach((product) => {
    const newProduct = document.createElement("li");

    newProduct.innerHTML = `
    <div id="product-${product.id}">
      <p>
      Id: ${product.id}
      Producto: ${product.title},
      Descripción: ${product.description},
      Código: ${product.code},
      Precio: ${product.price},
      Disponibilidad: ${product.status},
      Stock: ${product.stock},
      Categoría: ${product.category}
      </p>
      <button class="delete-btn" style="border: none; background-color: red; color: white; cursor: pointer; width: 150px; height: 25px" data-id="${product.id}">Eliminar producto</button>
    </div>
    `;

    textbox.appendChild(newProduct);
  });
};

socket.on("server:renderList", async () => {
  socket.emit("client:renderList");
});

socket.on("server:updateList", (products) => {
  updateProducts(products);
});

socket.on("server:deleteProduct", (pid) => {
  const deletedProduct = document.getElementById(`product-${pid}`);
  if (deletedProduct) {
    deletedProduct.remove();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const code = document.getElementById("code");
  const price = document.getElementById("price");
  const availability = document.getElementById("status");
  const stock = document.getElementById("stock");
  const category = document.getElementById("category");

  const product = {
    title: title.value,
    description: description.value,
    code: code.value,
    price: price.value,
    status: availability.value,
    stock: stock.value,
    category: category.value,
  };

  addProduct(product);
});

textbox.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const pid = Number(e.target.getAttribute("data-id"));
    socket.emit("client:deleteProduct", pid);
  }
});