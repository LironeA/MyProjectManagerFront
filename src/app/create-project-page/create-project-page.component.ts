import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Project, User } from '../models';
import { ProjectService } from '../project-service.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-create-project-page',
  templateUrl: './create-project-page.component.html',
  styleUrls: ['./create-project-page.component.css']
})
export class CreateProjectPageComponent implements OnInit {
  projectForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    user : new FormControl('')
  });
  users: User[] = [];

  constructor(private projectService: ProjectService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const project: Project = {
        id: 0,
        name: this.projectForm.value.name || '',
        description: this.projectForm.value.description || '',
        userId: 1
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