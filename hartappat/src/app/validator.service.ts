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

  validateFile(file: File): Observable<Object> {
    console.log('ValidatorService.validateFile() called');
    const url = this.validatorHostPort + 'api/v1/validate/val1';
    const objectObservable: Observable<Object> = this.http.post(url, file );
    //const objectObservable1 = objectObservable.pipe(x => null);
    return objectObservable;
    //return new Observable<void>(observer => observer.complete());
  }
}
