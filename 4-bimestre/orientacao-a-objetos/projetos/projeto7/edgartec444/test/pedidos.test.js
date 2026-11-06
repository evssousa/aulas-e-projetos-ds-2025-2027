const request = require("supertest");

let app;

beforeEach(() => {
    jest.resetModules();
    app = require("../index");
});

test("GET /pedidos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/pedidos");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
});

test("GET /pedidos deve filtrar por status", async () => {
    const res = await request(app).get("/pedidos?status=separado");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
});

test("GET /pedidos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/pedidos?valorMin=120");

    expect(res.body.map(r => r.id)).toEqual([2]);
});

test("GET /pedidos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/pedidos?status=separado&valorMin=120");

    expect(res.body.map(r => r.id)).toEqual([2]);
});

test("GET /pedidos/:id deve responder 200", async () => {
    const res = await request(app).get("/pedidos/2");

    expect(res.status).toBe(200);
    expect(res.body.cliente).toBe("Bruno");
});

test("GET /pedidos/:id deve responder 404 para id inexistente", async () => {
    const res = await request(app).get("/pedidos/99");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: "Pedido nao encontrado" });
});

test("POST /pedidos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", componente: "Resistor", valor: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ mensagem: "Registro de pedido criado" });
});

test("POST /pedidos deve responder 400 sem cliente", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ componente: "Resistor", valor: 1 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" });
});

test("POST /pedidos deve responder 400 sem componente", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", valor: 1 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: "O campo componente e obrigatorio" });
});

test("POST /pedidos deve recusar valor que nao e numero", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", componente: "Resistor", valor: "muitos" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" });
});

test("POST /pedidos deve recusar valor menor ou igual a zero", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", componente: "Resistor", valor: 0 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" });
});

test("a validacao deve seguir a ordem correta", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ valor: 1 });

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" });
});

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: "Rota nao encontrada" });
});
