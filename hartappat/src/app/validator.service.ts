import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  aField = "a field";
  private validatorHostPort = 'http://localhost:8082/';

  constructor(private http: HttpClient) {
  }

  validateFile(file: File): ValidationObservable {
    console.log('ValidatorService.validateFile() called');
    const url = this.validatorHostPort + 'api/v1/validate/val1';
    return this.http.post(url, file) as ValidationObservable;
  }

  uploadMultipart(file: File): ValidationObservable {

    console.log('ValidatorService.validateFile() called');

    const formData = new FormData();
    formData.append('name', 'fileForValidation');
    formData.append('file', file);

    const url = this.validatorHostPort + 'api/v1/validate/multipart';
    const objectObservable: ValidationObservable = this.http.post(url, formData) as ValidationObservable;
    console.log("Result back from Validator: ", objectObservable);
    return objectObservable;

  }

  // type PostReturn = Observable<Object>;
}

export type ValidationObservable = Observable<ValidationReply>;

/**
 * This type should match what is being returned from the (Java/Spring) backend.
 */
export type ValidationReply = {
  verdict:ValidationVerdict
  length: number,
  ctrVersion: string,
  failureReason: string,
  filename: string,
  stackTrace: string
}

export enum ValidationVerdict {PASS, FAIL, NOT_VALIDATED,}

