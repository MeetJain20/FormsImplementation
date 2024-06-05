import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
  @Input() form!: FormGroup;
  formGroups!: FormGroup[];

  ngOnInit() {
    if (this.form) {
      const fa = this.form.get('questionsListFormArray') as FormArray;
      this.formGroups = fa.controls as FormGroup[];
    }
  }

  isRequired(question: AbstractControl): boolean {
    const questionGroup = question as FormGroup;
    const answerControl = questionGroup.get('answer');
    if (answerControl && answerControl.validator) {
      const validator = answerControl.validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }
    return false;
  }

  getOptions(question: FormGroup): FormArray {
    return question.get('options') as FormArray;
  }
}
