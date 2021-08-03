import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators'; 

const DB_TIME = 5000;

enum InputFormStatus {
  VALID = 'VALID',
  INVALID = 'INVALID'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/*
 Using Form Builder for creating reactive Form along with Validators
*/
export class AppComponent implements OnInit {
  result: number;
  inputForm: FormGroup;

  private subscriptions: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {}
  //initializing the component
  ngOnInit(): void {
    //initializing the form along with controls
    this.inputForm = this.formBuilder.group({
      input1: ['', [Validators.required,  Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      input2: ['', [Validators.required,  Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
    // listening for changes in form and waiting for 500 ms after use has stopped typing
    // if no further changes come in those 500 ms , then doing further calculation.
    this.subscriptions.add(
      this.inputForm.valueChanges.pipe(
        debounceTime(DB_TIME)).subscribe(() => {
          const firstInput = this.inputForm.value.input1;
          const secondInput = this.inputForm.value.input2;
          return (this.inputForm.status === InputFormStatus.VALID) ? this.calculateResult(firstInput, secondInput) : this.result = null
        }
    ));
 }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

 //calculating the result
  calculateResult(numerator: number, denominator: number): void {
    this.result = numerator / denominator;
    // for rounding off
    // this.result = Math.round(this.result * 1000) / 1000
  }
}
