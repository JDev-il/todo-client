export const environment = {
  production: false,
  wsUrl: "ws://localhost:5001",
  api: {
    baseUrl: "http://localhost:5001/todos",
    todos: {
      add: "/add",
      many: "/update/many",
      update: "/update/:id",
      delete: "/delete/:id"
    }
  }
};
