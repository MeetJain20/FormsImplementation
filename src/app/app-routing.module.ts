import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormsComponent } from './components/dynamic-forms/dynamic-forms.component';

const routes: Routes = [
  {
    path: 'create',
    component: DynamicFormsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
