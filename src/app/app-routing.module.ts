import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';

const routes: Routes = [
  { path: '', component: ProjectsPageComponent },
  {path: 'create-project', component: CreateProjectPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
