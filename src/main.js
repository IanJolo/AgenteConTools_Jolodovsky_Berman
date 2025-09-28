import { tool, agent } from "llamaindex";
import { Ollama } from "@llamaindex/ollama";
import { z } from "zod";
import { empezarChat } from "./lib/cli-chat.js";
import { Estudiantes } from "./lib/estudiantes.js";

const DEBUG = true;

const estudiantes = new Estudiantes();
estudiantes.cargarEstudiantesDesdeJson();

const systemPrompt = `
Sos un asistente para gestionar estudiantes.
Tu tarea es ayudar a consultar o modificar una base de datos de alumnos.

Usá las herramientas disponibles para:
- Buscar estudiantes por nombre o apellido
- Agregar nuevos estudiantes
- Mostrar la lista completa de estudiantes

Respondé de forma clara y breve.
`.trim();

const ollamaLLM = new Ollama({
    model: "qwen3:1.7b",
    temperature: 0.75,
    timeout: 2 * 60 * 1000, 
});


const buscarPorNombreTool = tool({
    name: "buscarPorNombre",
    description: "Usa esta función para encontrar estudiantes por su nombre",
    parameters: z.object({
        nombre: z.string().describe("El nombre del estudiante a buscar"),
    }),
    execute: ({ nombre }) => {
        try {
            console.log(`🔍 Ejecutando búsqueda por nombre: "${nombre}"`);
            const resultado = estudiantes.buscarEstudiantePorNombre(nombre);
            console.log("📋 Resultado:", resultado);
            return resultado;
        } catch (error) {
            return `Error al buscar estudiante: ${error.message}`;
        }
    },
});

const buscarPorApellidoTool = tool({
    name: "buscarPorApellido",
    description: "Usa esta función para encontrar estudiantes por su apellido",
    parameters: z.object({
        apellido: z.string().describe("El apellido del estudiante a buscar"),
    }),
    execute: ({ apellido }) => {
        try {
            const resultado = estudiantes.buscarEstudiantePorApellido(apellido);
            return resultado;
        } catch (error) {
            return `Error al buscar estudiante: ${error.message}`;
        }
    },
});

const agregarEstudianteTool = tool({
    name: "agregarEstudiante",
    description: "Usa esta función para agregar un nuevo estudiante",
    parameters: z.object({
        nombre: z.string().describe("El nombre del estudiante"),
        apellido: z.string().describe("El apellido del estudiante"),
        curso: z.string().describe("El curso del estudiante (ej: 4A, 4B, 5A)"),
    }),
    execute: ({ nombre, apellido, curso }) => {
        try {
            const resultado = estudiantes.agregarEstudiante(nombre, apellido, curso);
            return resultado;
        } catch (error) {
            return `Error al agregar estudiante: ${error.message}`;
        }
    },
});

const listarEstudiantesTool = tool({
    name: "listarEstudiantes",
    description: "Muestra todos los estudiantes registrados. Usa esta función SOLO cuando el usuario quiera ver la lista completa de estudiantes.",
    parameters: z.object({}),
    execute: () => {
        try {
            console.log("🔍 Ejecutando listar estudiantes");
            const resultado = estudiantes.listarEstudiantes();
            console.log("📋 Resultado:", resultado);
            return resultado;
        } catch (error) {
            return `Error al listar estudiantes: ${error.message}`;
        }
    },
});

const elAgente = agent({
    tools: [buscarPorNombreTool, buscarPorApellidoTool, agregarEstudianteTool, listarEstudiantesTool],
    llm: ollamaLLM,
    verbose: DEBUG,
    systemPrompt: systemPrompt,
});

const mensajeBienvenida = `
¡Hola! Soy tu asistente para gestionar estudiantes.
Puedo ayudarte a:
- Buscar estudiantes por nombre o apellido
- Agregar nuevos estudiantes
- Mostrar la lista completa de estudiantes

¿Qué necesitás?
`;

empezarChat(elAgente, mensajeBienvenida);
