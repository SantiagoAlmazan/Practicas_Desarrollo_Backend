from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hola desde Flask en Docker"

@app.route("/pagina")
def pagina():
    return "Estás viendo la página expuesta por el proxy"
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
