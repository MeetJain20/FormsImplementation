import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormsComponent } from './components/dynamic-forms/dynamic-forms.component';
import { DisplayFormComponent } from './components/DisplayForm/display-form/display-form.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicFormsComponent,
  },
  
    { path: 'displayform', component: DisplayFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
