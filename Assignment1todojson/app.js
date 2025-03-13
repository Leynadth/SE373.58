const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Default route (http://localhost:3000/index)
app.get(["/", "/index"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for read-todo (http://localhost:3000/read-todo)
app.get("/read-todo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "read-todo.html"));
});

// Route for JSON data (http://localhost:3000/todo)
app.get("/todo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "todo.json"));
});

// Redirect invalid routes to index.html
app.use((req, res) => {
    res.writeHead(301, { 'Location': "http://" + req.headers['host'] + '/index.html' });
    res.end();
});

// Start the server
app.listen(PORT, () => {
    console.log("Server Running on Port 3000");
}); 
