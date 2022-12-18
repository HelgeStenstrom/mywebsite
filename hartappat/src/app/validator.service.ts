import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  aField = "a field";
  private validatorHostPort = 'http://localhost:8081/';

  constructor(private http: HttpClient) {
  }

  validateFile(file: File): PostReturn {
    console.log('ValidatorService.validateFile() called');
    const url = this.validatorHostPort + 'api/v1/validate/val1';
    const objectObservable: PostReturn = this.http.post(url, file );
    return objectObservable;
  }

  uploadMultipart(file: File): PostReturn {

    console.log('ValidatorService.validateFile() called');

    const formData = new FormData();
    formData.append('name', 'fileForValidation');
    formData.append('file', file);

    const url = this.validatorHostPort + 'api/v1/validate/multipart';
    const objectObservable: PostReturn = this.http.post(url, formData );
    return objectObservable;

  }

  // type PostReturn = Observable<Object>;
}

type PostReturn = Observable<Object>;
