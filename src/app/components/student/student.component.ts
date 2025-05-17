import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Student } from '../../services/data.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  isEditMode = false;
  editingStudentId: number | null = null;

  newStudent = {
    name: '',
    age: null as number | null,
    courses: '',
    grades: '',
    status: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.dataService.getStudents().subscribe((data: Student[]) => {
      this.students = data;
    });
  }

  addStudent() {
    const student: Student = {
      id: 0,
      name: this.newStudent.name,
      age: this.newStudent.age ?? 0,
      courses: this.newStudent.courses.split(',').map(c => c.trim()).filter(Boolean),
      grades: this.newStudent.grades.split(',').map(g => g.trim()).filter(Boolean),
      status: this.newStudent.status
    };

    if (this.isEditMode && this.editingStudentId !== null) {
      this.dataService.updateStudent(this.editingStudentId, { ...student, id: this.editingStudentId })
        .subscribe(() => {
          this.loadStudents();
          this.resetForm();
        });
    } else {
      this.dataService.addStudent(student).subscribe(() => {
        this.loadStudents();
        this.resetForm();
      });
    }

    this.isEditMode = false;
    this.editingStudentId = null;
  }

  editStudent(student: Student) {
    this.newStudent = {
      name: student.name,
      age: student.age,
      courses: student.courses.join(', '),
      grades: student.grades.join(', '),
      status: student.status
    };
    this.isEditMode = true;
    this.editingStudentId = student.id;
  }

  cancelEdit() {
    this.resetForm();
    this.isEditMode = false;
    this.editingStudentId = null;
  }

  deleteStudent(id: number) {
    this.dataService.deleteStudent(id).subscribe(() => {
      this.loadStudents();
    });
  }

  resetForm() {
    this.newStudent = {
      name: '',
      age: null,
      courses: '',
      grades: '',
      status: ''
    };
  }
}
