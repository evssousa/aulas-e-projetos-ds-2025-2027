const express = require("express");
const app = express();

app.use(express.json());

let pedidos = [
    { id: 1, cliente: "Ana", componente: "Resistor", valor: 1, status: "enviado" },
    { id: 2, cliente: "Bruno", componente: "Arduino Uno", valor: 120, status: "separado" },
    { id: 3, cliente: "Carla", componente: "Sensor DHT11", valor: 25, status: "separado" }
];

app.get("/pedidos", (req, res) => {
    let resultado = pedidos;

    if (req.query.status) {
        resultado = resultado.filter(p => p.status === req.query.status);
    }

    if (req.query.valorMin !== undefined) {
        resultado = resultado.filter(p => p.valor >= Number(req.query.valorMin));
    }

    res.status(200).json(resultado);
});

app.get("/pedidos/:id", (req, res) => {
    const pedido = pedidos.find(p => p.id === Number(req.params.id));

    if (!pedido) {
        return res.status(404).json({ erro: "Pedido nao encontrado" });
    }

    res.status(200).json(pedido);
});

app.post("/pedidos", (req, res) => {
    const { cliente, componente, valor } = req.body;

    if (!cliente) {
        return res.status(400).json({ erro: "O campo cliente e obrigatorio" });
    }

    if (!componente) {
        return res.status(400).json({ erro: "O campo componente e obrigatorio" });
    }

    if (typeof valor !== "number" || !Number.isFinite(valor)) {
        return res.status(400).json({ erro: "O campo valor deve ser um numero" });
    }

    if (valor <= 0) {
        return res.status(400).json({ erro: "O campo valor deve ser maior que zero" });
    }

    const novoPedido = {
        id: pedidos.length ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
        cliente,
        componente,
        valor,
        status: "aberto"
    };

    pedidos.push(novoPedido);

    res.status(201).json({ mensagem: "Registro de pedido criado" });
});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota nao encontrada" });
});

module.exports = app;