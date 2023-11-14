import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Project } from '../models';
import { ProjectService } from '../project-service.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-project-page',
  templateUrl: './create-project-page.component.html',
  styleUrls: ['./create-project-page.component.css']
})
export class CreateProjectPageComponent implements OnInit {
  projectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const project: Project = {
        id: 0,
        name: this.projectForm.value.name || '',
        description: this.projectForm.value.description || '',
       };
      this.projectService.createProject(project).subscribe({
        next: project => {
          this.router.navigate(['/']);
        },
        error: error => {
          console.error('Error creating project', error);
        }
      });
    }
  }
  }