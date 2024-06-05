import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-form',
  templateUrl: './display-form.component.html',
  styleUrls: ['./display-form.component.scss'],
})
export class DisplayFormComponent implements OnInit {
  form!: FormGroup;
  formGroups!: FormGroup[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    const state = history.state;
    if (state && state.form) {
      this.form = this.fb.group({
        questionsListFormArray: this.fb.array([]),
      });
      this.populateForm(state.form);
      if (this.form) {
        const fa = this.form.get('questionsListFormArray') as FormArray;
        this.formGroups = fa.controls as FormGroup[];
      }
    } else {
      console.error('Form data is missing in router state.');
    }
  }

  populateForm(formValue: any) {
    const questionsArray = this.form.get('questionsListFormArray') as FormArray;
    formValue.questionsListFormArray.forEach((question: any) => {
      const answerValidators = question.isRequired ? [Validators.required] : [];
  
      const questionGroup = this.fb.group({
        questionType: [question.questionType, Validators.required],
        placeholder: [question.placeholder],
        questionText: [question.questionText, Validators.required],
        isRequired: [question.isRequired],
        answer: [question.answer, answerValidators], 
        options: this.fb.array(
          question.options.map((option: any) =>
            this.fb.group({
              value: [option.value, Validators.required],
            })
          )
        ),
      });
      questionsArray.push(questionGroup);
    });
  }

  getOptions(questionGroup: FormGroup): FormArray {
    return questionGroup.get('options') as FormArray;
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
}
