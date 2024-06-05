import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
})
export class DynamicFormsComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      questionsListFormArray: this.fb.array([]),
    });

  }

  ngOnInit() {}

  get questionsListFormArray(): FormArray {
    return this.form.get('questionsListFormArray') as FormArray;
  }

  addQuestion(type: string) {
    const newQuestionFormGroup = this.fb.group({
      questionType: [type, Validators.required],
      placeholder: new FormControl(''),
      questionText: new FormControl('', Validators.required),
      isRequired: new FormControl(false),
      answer: new FormControl(''),
      options: new FormArray([]),
    });

    (newQuestionFormGroup.get('options') as FormArray).push(
      this.createOption()
    );

    this.questionsListFormArray.push(newQuestionFormGroup);
  }

  createOption(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required],
    });
  }

  removeQuestion(index: number) {
    this.questionsListFormArray.removeAt(index);
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    if (this.areOptionsEmpty(options)) {
      alert('Please fill in the current option before adding a new one.');
      return;
    }
    options.push(this.createOption());
  }

  getOptions(questionIndex: number): FormArray {
    return this.questionsListFormArray
      .at(questionIndex)
      .get('options') as FormArray;
  }

  areOptionsEmpty(options: FormArray): boolean {
    for (let i = 0; i < options.controls.length; i++) {
      if (!options.at(i).get('value')?.value.trim()) {
        return true;
      }
    }
    return false;
  }

  handleIconClick(event: Event, index: number) {
    event.stopPropagation();
    this.addOption(index);
  }

  onTypeChange(event: any, questionIndex: number) {
    const selectedType = event.target.value;
    const answerControl = this.questionsListFormArray
      .at(questionIndex)
      .get('answer') as FormControl;

    answerControl.reset();

  }

  onTypeSelect(event: any, dropdown: HTMLSelectElement) {
    const selectedType = event.target.value;
    if (selectedType) {
      this.addQuestion(selectedType);
      dropdown.value = '';
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex);
    if (options.length > 1) {
      options.removeAt(optionIndex);
    } else {
      alert('You must have at least one option.');
    }
  }

  onRequiredChange(event: any, questionIndex: number) {
    const isRequired = event.target.checked;
    const questionControl = this.questionsListFormArray.at(questionIndex);
    const answerControl = questionControl.get('answer');

    if (isRequired) {
      answerControl?.setValidators(Validators.required);
    } else {
      answerControl?.clearValidators();
    }
    answerControl?.updateValueAndValidity();
  }

  onSubmit() {
    const invalidQuestion = this.getInvalidQuestion();
    if (invalidQuestion) {
      alert(invalidQuestion);
      return;
    }
    if(this.questionsListFormArray.length===0)
    {
      alert('Please add atleast one question');
      return;
    }
    console.log(this.form.value);
    const formValue = this.form.getRawValue();
    this.router.navigate(['/displayform'], { state: { form: formValue } });
  }

  getInvalidQuestion(): string | null {
    const questions = this.questionsListFormArray.controls;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (question.invalid) {
        if (!question.get('questionText')?.value.trim()) {
          return 'Please fill in all the questions.';
        }
        const type = question.get('questionType')?.value;
        if (
          (type === 'multiple' || type === 'checkbox') &&
          this.areOptionsEmpty(this.getOptions(i))
        ) {
          return 'Please fill in all the options.';
        }
      }
    }
    return null;
  }
}
