import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumoAPIService {

  private baseUrl = 'https://h9bgqh4n-5000.brs.devtunnels.ms';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  // Obtener todos los profesores
  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/profesores`);
  }

  // Obtener los cursos de un profesor por su ID
  getCursos(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/profesores/${profesorId}/cursos`);
  }

  // Obtener los alumnos de un curso específico de un profesor
  getAlumnosCurso(profesorId: number, cursoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/profesores/${profesorId}/cursos/${cursoId}/alumnos`);
  }

  // Registrar la asistencia de un alumno
  registrarAsistencia(alumnoId: number, codigo: string, seccion: string, fecha: string): Observable<any> {
    const body = { alumno_id: alumnoId, codigo, seccion, fecha };
    return this.http.post(`${this.baseUrl}/registrar_asistencia`, body);
  }

  getCursosEstudiante(estudianteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/estudiantes/${estudianteId}/cursos`);
  }
}