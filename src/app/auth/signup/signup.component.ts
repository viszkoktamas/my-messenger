import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { mimeType } from './mime-type.validator';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  triedToSubmit = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.email, Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      name: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.required]
      }),
      city: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.required]
      })
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSignup() {
    this.triedToSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      this.form.value.email,
      this.form.value.password,
      this.form.value.image,
      this.form.value.name,
      this.form.value.city
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
