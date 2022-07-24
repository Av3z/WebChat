const path = require("path");
const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "src/public")));
app.set('views', path.join(__dirname, "src/public"));
app.engine('html', require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) =>{
    res.render("index.html");
});

let messages = [];

io.on("connection", socket => {
    console.log(`Socket connectado: ${socket.id}`);

    socket.emit("previousMessage", messages);

    socket.on("sendMessage", data => {
        console.log(data);
        messages.push(data);

        socket.broadcast.emit("receivedMessage", data);
    });

});

server.listen(3000, () => {
    console.log("Servidor iniciado!")
});

