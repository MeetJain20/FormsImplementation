import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsComponent } from './components/dynamic-forms/dynamic-forms.component';
import { FormPreviewComponent } from './components/FormPreview/form-preview/form-preview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {InputTextModule} from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DisplayFormComponent } from './components/DisplayForm/display-form/display-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormsComponent,
    FormPreviewComponent,
    DisplayFormComponent,
  ],
  imports: [
    BrowserModule,
    InputTextModule,
    DropdownModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
