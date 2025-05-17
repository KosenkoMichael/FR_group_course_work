import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Course {
  id: number;
  name: string;
  description: string;
  duration: number | null;
  price: number | null;
  teacher: string;
}

export interface Teacher {
  id: number;
  name: string;
  experience: number | null;
  specialization: string;
  rating: number | null;
  courses: string[];
}

export interface Student {
  id: number;
  name: string;
  age: number | null;
  courses: string[];
  grades: string[];
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ================== COURSES ==================
  getCourses() {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  addCourse(course: Course) {
    return this.http.post<Course>(`${this.baseUrl}/courses`, course);
  }

  updateCourse(id: number, course: Course) {
    return this.http.put<Course>(`${this.baseUrl}/courses/${id}`, course);
  }

  deleteCourse(id: number) {
  return this.http.delete(`${this.baseUrl}/courses/${id}`, { responseType: 'text' });
  }

  // ================== STUDENTS ==================
  getStudents() {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  addStudent(student: Student) {
    return this.http.post<Student>(`${this.baseUrl}/students`, student);
  }

  updateStudent(id: number, student: Student) {
    return this.http.put<Student>(`${this.baseUrl}/students/${id}`, student);
  }

  deleteStudent(id: number) {
    return this.http.delete(`${this.baseUrl}/students/${id}`, { responseType: 'text' });
  }

  // ================== TEACHERS ==================
  getTeachers() {
    return this.http.get<Teacher[]>(`${this.baseUrl}/teachers`);
  }

  addTeacher(teacher: Teacher) {
    return this.http.post<Teacher>(`${this.baseUrl}/teachers`, teacher);
  }

  updateTeacher(id: number, teacher: Teacher) {
    return this.http.put<Teacher>(`${this.baseUrl}/teachers/${id}`, teacher);
  }

  deleteTeacher(id: number) {
    return this.http.delete(`${this.baseUrl}/teachers/${id}`, { responseType: 'text' });
  }
}
