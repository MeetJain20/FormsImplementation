import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
  @Input() form!: FormGroup;
  formGroups!: FormGroup[];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.form) {
      const fa = this.form.get('questions') as FormArray;
      this.formGroups = fa.controls as FormGroup[];
    }
  }

  isRequired(question: AbstractControl): boolean|undefined {
    const questionGroup = question as FormGroup;
    return questionGroup.get('answer.response')?.hasError('required');
  }

  getOptions(question: FormGroup): FormArray {
    return question.get('answer.options') as FormArray;
  }
}
