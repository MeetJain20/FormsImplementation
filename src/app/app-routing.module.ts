import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormsComponent } from './components/dynamic-forms/dynamic-forms.component';
import { FormPreviewComponent } from './components/FormPreview/form-preview/form-preview.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicFormsComponent,
  },
  
    { path: 'form-preview', component: FormPreviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
