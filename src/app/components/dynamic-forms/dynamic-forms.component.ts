import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
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
      answer: this.fb.group({})
    });

    if (type === 'short' || type === 'long' || type === 'time' || type === 'date') {
      (question.get('answer') as FormGroup).addControl('response', this.fb.control('', Validators.required));
    } else if (type === 'multiple' || type === 'checkbox') {
      const options = this.fb.array([this.createOption()]);
      (question.get('answer') as FormGroup).addControl('options', options);
      if (type === 'checkbox') {
        (question.get('answer') as FormGroup).addControl('selectedOptions', this.fb.array([]));
      } else {
        (question.get('answer') as FormGroup).addControl('selectedOption', this.fb.control('', Validators.required));
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
    options.push(this.createOption());
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answer.options') as FormArray;
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

  onTypeChange(event: any, questionIndex: number) {
    const selectedType = event.target.value;
    const answerControl = this.questions.at(questionIndex).get('answer') as FormGroup;

    answerControl.reset();

    if (selectedType === 'short' || selectedType === 'long' || selectedType === 'time' || selectedType === 'date') {
      answerControl.addControl('response', this.fb.control('', Validators.required));
    } else if (selectedType === 'multiple' || selectedType === 'checkbox') {
      const options = this.fb.array([this.createOption()]);
      answerControl.addControl('options', options);
      if (selectedType === 'checkbox') {
        answerControl.addControl('selectedOptions', this.fb.array([]));
      } else {
        answerControl.addControl('selectedOption', this.fb.control('', Validators.required));
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

  onSubmit() {
    console.log(this.form.value);
  }
}
