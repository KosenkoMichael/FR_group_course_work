import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Course } from '../../services/data.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  isEditMode = false;
  editingCourseId: number | null = null;

  newCourse: Course = {
    id: 0,
    name: '',
    description: '',
    duration: null,
    price: null,
    teacher: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses as Course[];
    });
  }

  addCourse() {
    if (this.isEditMode && this.editingCourseId !== null) {
      this.dataService.updateCourse(this.editingCourseId, this.newCourse).subscribe(() => {
        this.loadCourses();
        this.resetForm();
        this.isEditMode = false;
        this.editingCourseId = null;
      });
    } else {
      this.dataService.addCourse(this.newCourse).subscribe(() => {
        this.loadCourses();
        this.resetForm();
      });
    }
  }

  editCourse(course: Course) {
    this.newCourse = { ...course };
    this.isEditMode = true;
    this.editingCourseId = course.id;
  }

  cancelEdit() {
    this.resetForm();
    this.isEditMode = false;
    this.editingCourseId = null;
  }

  deleteCourse(id: number) {
    this.dataService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }

  resetForm() {
    this.newCourse = {
      id: 0,
      name: '',
      description: '',
      duration: null,
      price: null,
      teacher: ''
    };
  }
}
