import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit() {}

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion(type: string) {
    const question = this.fb.group({
      type: [type, Validators.required],
      question: ['', Validators.required],
      isRequired: [false],
      answer: this.fb.group({})
    });

    if (type === 'short' || type === 'long') {
      (question as FormGroup).addControl('placeholder', this.fb.control(''));
      (question.get('answer') as FormGroup).addControl('response', this.fb.control(''));
    } else if (type === 'time' || type === 'date') {
      (question.get('answer') as FormGroup).addControl('response', this.fb.control(''));
    } else if (type === 'multiple' || type === 'checkbox') {
      const options = this.fb.array([this.createOption()]);
      (question.get('answer') as FormGroup).addControl('options', options);
      if (type === 'checkbox') {
        (question.get('answer') as FormGroup).addControl('selectedOptions', this.fb.array([]));
      } else {
        (question.get('answer') as FormGroup).addControl('selectedOption', this.fb.control(''));
      }
    }

    this.questions.push(question);
  }

  createOption(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
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
    return this.questions.at(questionIndex).get('answer.options') as FormArray;
  }

  areOptionsEmpty(options: FormArray): boolean {
    for (let i = 0; i < options.controls.length; i++) {
      if (!options.at(i).get('value')?.value.trim()) {
        return true;
      }
    }
    return false;
  }

  onCheckboxChange(event: any, questionIndex: number) {
    const selectedOptions = this.questions.at(questionIndex).get('answer.selectedOptions') as FormArray;
    if (event.target.checked) {
      selectedOptions.push(this.fb.control(event.target.value));
    } else {
      const index = selectedOptions.controls.findIndex(x => x.value === event.target.value);
      selectedOptions.removeAt(index);
    }
  }

  onRadioChange(event: any, questionIndex: number) {
    const selectedOption = this.questions.at(questionIndex).get('answer.selectedOption');
    selectedOption?.setValue(event.target.value);
  }

  handleIconClick(event: Event, index: number) {
    event.stopPropagation();
    this.addOption(index);
  }

  onTypeChange(event: any, questionIndex: number) {
    const selectedType = event.target.value;
    const answerControl = this.questions.at(questionIndex).get('answer') as FormGroup;

    answerControl.reset();

    if (selectedType === 'short' || selectedType === 'long' || selectedType === 'time' || selectedType === 'date') {
      answerControl.addControl('response', this.fb.control(''));
    } else if (selectedType === 'multiple' || selectedType === 'checkbox') {
      const options = this.fb.array([this.createOption()]);
      answerControl.addControl('options', options);
      if (selectedType === 'checkbox') {
        answerControl.addControl('selectedOptions', this.fb.array([]));
      } else {
        answerControl.addControl('selectedOption', this.fb.control(''));
      }
    }
  }

  onTypeSelect(event: any, dropdown: HTMLSelectElement) {
    const selectedType = event.target.value;
    if (selectedType) {
      this.addQuestion(selectedType);
      dropdown.value = '';  // Reset the dropdown value
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
    const questionControl = this.questions.at(questionIndex);
    const answerControl = questionControl.get('answer.response');

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
    console.log(this.form.value);
    const formValue = this.form.value;
    this.router.navigate(['/displayform'], { state: { form: JSON.stringify(formValue) } });
  }

  getInvalidQuestion(): string | null {
    const questions = this.questions.controls;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (question.invalid) {
        if (!question.get('question')?.value.trim()) {
          return 'Please fill in all the questions.';
        }
        const type = question.get('type')?.value;
        if ((type === 'multiple' || type === 'checkbox') && this.areOptionsEmpty(this.getOptions(i))) {
          return 'Please fill in all the options.';
        }
      }
    }
    return null;
  }
}
