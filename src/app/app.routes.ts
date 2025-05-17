import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'courses',
    loadComponent: () =>
      import('./components/course/course.component').then(m => m.CoursesComponent)
  },
  {
    path: 'teachers',
    loadComponent: () =>
      import('./components/teacher/teacher.component').then(m => m.TeachersComponent)
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./components/student/student.component').then(m => m.StudentsComponent)
  },
  { path: '', redirectTo: '/courses', pathMatch: 'full' }
];
