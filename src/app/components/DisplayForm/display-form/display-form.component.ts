import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-form',
  templateUrl: './display-form.component.html',
  styleUrls: ['./display-form.component.scss']
})
export class DisplayFormComponent implements OnInit {
  form!: FormGroup;
  formGroups!: FormGroup[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    const state = history.state;
    if (state && state.form) {
      const formValue = JSON.parse(state.form);
      this.form = this.reconstructFormGroup(formValue);
      const fa = this.form.get('questions') as FormArray;
      this.formGroups = fa.controls as FormGroup[];
      console.log(this.formGroups);
    } else {
      console.error('Form data is missing in router state.');
    }
  }

  reconstructFormGroup(formValue: any): FormGroup {
    const formGroup = this.fb.group({
      questions: this.fb.array(
        formValue.questions.map((question: any) => this.createQuestionGroup(question))
      )
    });
    return formGroup;
  }

  createQuestionGroup(question: any): FormGroup {
    const questionGroup = this.fb.group({
      type: [question.type, Validators.required],
      question: [question.question, Validators.required],
      isRequired: [question.isRequired],
      answer: this.createAnswerGroup(question.type, question.answer)
    });

    if (question.type === 'short' || question.type === 'long') {
      (questionGroup as FormGroup).addControl('placeholder', this.fb.control(question.placeholder || ''));
    }

    return questionGroup;
  }

  createAnswerGroup(type: string, answer: any): FormGroup {
    const answerGroup = this.fb.group({});
    if (type === 'short' || type === 'long' || type === 'time' || type === 'date') {
      answerGroup.addControl('response', this.fb.control(answer.response || ''));
    } else if (type === 'multiple' || type === 'checkbox') {
      const options = this.fb.array(
        answer.options.map((option: any) => this.fb.group({ value: [option.value, Validators.required] }))
      );
      answerGroup.addControl('options', options);
      if (type === 'checkbox') {
        answerGroup.addControl('selectedOptions', this.fb.array(answer.selectedOptions || []));
      } else {
        answerGroup.addControl('selectedOption', this.fb.control(answer.selectedOption || ''));
      }
    }
    return answerGroup;
  }

  getOptions(questionGroup: FormGroup): FormArray {
    return questionGroup.get('answer.options') as FormArray;
  }

  getSelectedOptions(questionGroup: FormGroup): FormArray {
    return questionGroup.get('answer.selectedOptions') as FormArray;
  }

  isRequired(question: AbstractControl): boolean | undefined {
    const questionGroup = question as FormGroup;
    return questionGroup.get('answer.response')?.hasError('required');
  }
}
