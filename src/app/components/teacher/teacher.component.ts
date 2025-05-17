import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Teacher } from '../../services/data.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  isEditMode = false;
  editingTeacherId: number | null = null;

  newTeacher = {
    name: '',
    experience: null as number | null,
    specialization: '',
    rating: null as number | null,
    courses: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.dataService.getTeachers().subscribe((data: Teacher[]) => {
      this.teachers = data;
    });
  }

  addTeacher() {
    const teacher: Teacher = {
      id: 0,
      name: this.newTeacher.name,
      experience: this.newTeacher.experience ?? 0,
      specialization: this.newTeacher.specialization,
      rating: this.newTeacher.rating ?? 0,
      courses: this.newTeacher.courses.split(',').map(c => c.trim()).filter(Boolean)
    };

    if (this.isEditMode && this.editingTeacherId !== null) {
      this.dataService.updateTeacher(this.editingTeacherId, { ...teacher, id: this.editingTeacherId })
        .subscribe(() => {
          this.loadTeachers();
          this.resetForm();
        });
    } else {
      this.dataService.addTeacher(teacher).subscribe(() => {
        this.loadTeachers();
        this.resetForm();
      });
    }

    this.isEditMode = false;
    this.editingTeacherId = null;
  }

  editTeacher(teacher: Teacher) {
    this.newTeacher = {
      name: teacher.name,
      experience: teacher.experience,
      specialization: teacher.specialization,
      rating: teacher.rating,
      courses: teacher.courses.join(', ')
    };
    this.isEditMode = true;
    this.editingTeacherId = teacher.id;
  }

  cancelEdit() {
    this.resetForm();
    this.isEditMode = false;
    this.editingTeacherId = null;
  }

  deleteTeacher(id: number) {
    this.dataService.deleteTeacher(id).subscribe(() => {
      this.loadTeachers();
    });
  }

  resetForm() {
    this.newTeacher = {
      name: '',
      experience: null,
      specialization: '',
      rating: null,
      courses: ''
    };
  }
}
