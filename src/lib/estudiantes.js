import { readFileSync, writeFileSync } from 'fs';

const DATA_FILE = './data/alumnos.json';

class Estudiantes {
  constructor() {
    this.estudiantes = [];
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
    if (!nombre || !apellido || !curso) {
      throw new Error("Todos los campos (nombre, apellido, curso) son obligatorios");
    }

    const estudianteExistente = this.estudiantes.find(
      estudiante => estudiante.nombre.toLowerCase() === nombre.toLowerCase() && 
                   estudiante.apellido.toLowerCase() === apellido.toLowerCase()
    );

    if (estudianteExistente) {
      throw new Error(`El estudiante ${nombre} ${apellido} ya existe en el sistema`);
    }

    const nuevoEstudiante = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      curso: curso.trim()
    };

    this.estudiantes.push(nuevoEstudiante);
    
    this.guardarEstudiantes();
    
    return `✅ ${nombre} ${apellido} fue registrado en el curso ${curso}`;
  }

  buscarEstudiantePorNombre(nombre) {
    if (!nombre) {
      throw new Error("El nombre es obligatorio para la búsqueda");
    }

    const nombreBusqueda = nombre.toLowerCase().trim();
    const estudiantesEncontrados = this.estudiantes.filter(
      estudiante => estudiante.nombre.toLowerCase().includes(nombreBusqueda)
    );

    if (estudiantesEncontrados.length === 0) {
      return `❌ No hay estudiantes registrados con el nombre "${nombre}"`;
    }

    const resultado = estudiantesEncontrados.map(estudiante => 
      `${estudiante.nombre} ${estudiante.apellido} - Curso: ${estudiante.curso}`
    ).join('\n');

    return `🔍 Resultados para "${nombre}":\n${resultado}`;
  }

  buscarEstudiantePorApellido(apellido) {
    if (!apellido) {
      throw new Error("El apellido es obligatorio para la búsqueda");
    }

    const apellidoBusqueda = apellido.toLowerCase().trim();
    const estudiantesEncontrados = this.estudiantes.filter(
      estudiante => estudiante.apellido.toLowerCase().includes(apellidoBusqueda)
    );

    if (estudiantesEncontrados.length === 0) {
      return `❌ No hay estudiantes registrados con el apellido "${apellido}"`;
    }

    const resultado = estudiantesEncontrados.map(estudiante => 
      `${estudiante.nombre} ${estudiante.apellido} - Curso: ${estudiante.curso}`
    ).join('\n');

    return `🔍 Resultados para apellido "${apellido}":\n${resultado}`;
  }

  listarEstudiantes() {
    if (this.estudiantes.length === 0) {
      return "📋 El sistema no tiene estudiantes registrados";
    }

    const estudiantesPorCurso = this.estudiantes.reduce((acc, estudiante) => {
      if (!acc[estudiante.curso]) {
        acc[estudiante.curso] = [];
      }
      acc[estudiante.curso].push(estudiante);
      return acc;
    }, {});

    let resultado = `📊 Registro de estudiantes (${this.estudiantes.length} alumnos):\n\n`;
    
    Object.keys(estudiantesPorCurso).sort().forEach(curso => {
      resultado += `🎓 Curso ${curso}:\n`;
      estudiantesPorCurso[curso].forEach(estudiante => {
        resultado += `  • ${estudiante.nombre} ${estudiante.apellido}\n`;
      });
      resultado += '\n';
    });

    return resultado.trim();
  }
}

export { Estudiantes }
