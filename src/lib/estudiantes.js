// Gestión de estudiantes
import { readFileSync, writeFileSync } from 'fs';

const DATA_FILE = './data/alumnos.json';

class Estudiantes {
  constructor() {
    this.estudiantes = [];
  }

  normalizar(str) {
    if (typeof str !== 'string') return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }


  
  cargarEstudiantesDesdeJson() {
    try {
        const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
        this.estudiantes = data.alumnos || [];
    } catch (e) {
        console.error("Error al leer el archivo de datos:", e);
    }
  }

  guardarEstudiantes() {
    try {
      writeFileSync(DATA_FILE, JSON.stringify({ alumnos: this.estudiantes }, null, 2));
      this.cargarEstudiantesDesdeJson();
    } catch (e) {
      console.error("Error al guardar los estudiantes:", e);
      throw new Error("No se pudo guardar la lista de estudiantes.");
    }
  }

  agregarEstudiante(nombre, apellido, curso) {
    const nuevoEstudiante = { nombre, apellido, curso };
    this.estudiantes.push(nuevoEstudiante);
    this.guardarEstudiantes();
    return `Estudiante ${nombre} ${apellido} agregado al curso ${curso}`;
  }

    buscarEstudiantePorNombre(nombre) {
      const needle = this.normalizar(nombre);
      return this.estudiantes.filter((estudiante) =>
        this.normalizar(estudiante.nombre).includes(needle)
      );
    }
  
    buscarEstudiantePorApellido(apellido) {
      const needle = this.normalizar(apellido);
      return this.estudiantes.filter((estudiante) =>
        this.normalizar(estudiante.apellido).includes(needle)
      );
    }

  listarEstudiantes() {
    return this.estudiantes;
  }
}

export { Estudiantes }
