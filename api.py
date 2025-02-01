from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

profesores = [
    {
        "id": 1,
        "nombre": "Juan Pérez",
        "cursos": [
            {
                "id": 1,
                "nombre": "Matemáticas",
                "codigo": "PGY0000",
                "seccion": "013V",
                "alumnos": [
                    {"id": 1, "nombre": "Luis","status":0},
                    {"id": 2, "nombre": "María","status":0},
                    {"id": 3, "nombre": "AAA","status":0}
                ]
            },
            {
                "id": 2,
                "nombre": "Fisica",
                "codigo": "PGY0000",
                "seccion": "015V",
                "alumnos": [
                    {"id": 1, "nombre": "Luis","status":0},
                    {"id": 2, "nombre": "María","status":0}
                ]
            },
            {
                "id": 3,
                "nombre": "Quimica",
                "codigo": "PGY0000",
                "seccion": "018V",
                "alumnos": [
                    {"id": 1, "nombre": "Luis","status":0},
                    {"id": 2, "nombre": "María","status":0},
                    {"id": 3, "nombre": "Luis","status":1},
                    {"id": 4, "nombre": "María","status":1},
                    {"id": 5, "nombre": "Luis","status":0},
                    {"id": 6, "nombre": "María","status":0}
                ]
            },
            {
                "id": 4,
                "nombre": "Prueba Cursos",
                "codigo": "PGY0000",
                "seccion": "018V",
                "alumnos": [
                    {"id": 1, "nombre": "Luis","status":0},
                    {"id": 2, "nombre": "María","status":0},
                    {"id": 3, "nombre": "Luis","status":0}
                ]
            }
        ]
    }
]


usuarios = [
    {
        "id": 1,
        "user": "docente",
        "password": "password1",
        "nombre": "Juan Perez",
        "perfil":  1,
        "correo": "docente@gmail.com"
    },
    {
        "id": 2,
        "user": "alumno",
        "password": "password2",
        "nombre": "Luis Gonzalez",
        "perfil": 2,
        "correo": "alumno@gmail.com"
    }
]


@app.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido a la API!"})


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('user')
    password = request.json.get('password')
    
    usuario = next((u for u in usuarios if u["user"] == username and u["password"] == password), None)
    
    if usuario:
        return jsonify({
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "user": usuario["user"],
            "correo": usuario["correo"],
            "tipoPerfil": usuario["perfil"]
        }), 200
    else:
        return jsonify({"message": "Credenciales incorrectas"}), 401

@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    return jsonify(usuarios), 200


@app.route('/profesores', methods=['GET'])
def obtener_profesores():
    return jsonify(profesores), 200

#LOS CURSOS DADO UN ID PROFESOR
@app.route('/profesores/<int:profesor_id>/cursos', methods=['GET'])
def obtener_cursos_profesor(profesor_id):
    profesor = next((p for p in profesores if p["id"] == profesor_id), None)
    if not profesor:
        return jsonify({"message": "Profesor no encontrado"}), 404
    return jsonify(profesor["cursos"]), 200

# LOS ALUMNOS DE UN CURSO DADO UN ID PROFESOR
@app.route('/profesores/<int:profesor_id>/cursos/<int:curso_id>/alumnos', methods=['GET'])
def obtener_alumnos_curso(profesor_id, curso_id):
    profesor = next((p for p in profesores if p["id"] == profesor_id), None)
    if not profesor:
        return jsonify({"message": "Profesor no encontrado"}), 404
    curso = next((c for c in profesor["cursos"] if c["id"] == curso_id), None)
    if not curso:
        return jsonify({"message": "Curso no encontrado"}), 404
    return jsonify(curso["alumnos"]), 200

# Obtener los cursos de un estudiante
@app.route('/estudiantes/<int:estudiante_id>/cursos', methods=['GET'])
def obtener_cursos_estudiante(estudiante_id):
    cursos_estudiante = []
    for profesor in profesores:
        for curso in profesor["cursos"]:
            # Verificar si el estudiante está en este curso
            if any(alumno["id"] == estudiante_id for alumno in curso["alumnos"]):
                cursos_estudiante.append(curso)
    if not cursos_estudiante:
        return jsonify({"message": "No se encontraron cursos para el estudiante"}), 404
    return jsonify(cursos_estudiante), 200

@app.route('/registrar_asistencia', methods=['POST'])
def registrar_asistencia():
    alumno_id = request.json.get('alumno_id')
    codigo = request.json.get('codigo')
    seccion = request.json.get('seccion')
    fecha = request.json.get('fecha')
    
    # Aquí se busca el curso y al alumno y se actualiza su estado.
    for profesor in profesores:
        for curso in profesor["cursos"]:
            if curso["codigo"] == codigo and curso["seccion"] == seccion:
                for alumno in curso["alumnos"]:
                    if alumno["id"] == alumno_id:
                        alumno["status"] = 1  # 1 es para presente
                        return jsonify({"message": "Asistencia registrada"}), 200
    
    return jsonify({"message": "No se pudo registrar la asistencia"}), 400


if __name__ == '__main__':
    app.run(debug=True)
