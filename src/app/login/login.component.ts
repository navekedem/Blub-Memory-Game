import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {NavigationExtras, Router} from '@angular/router';

//initialize routing state
const navigationExtras: NavigationExtras = {
  state: {
    username: '',
  }
};
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({
    username: '',
  });

  constructor(private formBuilder: FormBuilder,private router:Router) { }

  ngOnInit(): void {
  }

  //Validate user name input
  isEmptyOrSpaces(str:string){
    return str === null || str.match(/^ *$/) !== null;
  }

  //Display Error By field Name
  displayErrorByName(fieldName: string) {
    if(fieldName) {
      let fieldId:string = fieldName + "-error" ;
      let field = document.getElementById(fieldId) as HTMLElement;  
      if(field) field.style.display = "block";
    }
  }

  login(event: Event): void {
    event.preventDefault();
    if(this.isEmptyOrSpaces(this.loginForm.value.username)) {
      this.displayErrorByName("username")
      return;
    } else {
      navigationExtras.state = this.loginForm.value;
      this.router.navigateByUrl('/game', navigationExtras);
      this.loginForm.reset();
    }
  }

}
