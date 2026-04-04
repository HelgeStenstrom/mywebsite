import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Member, MemberCreate} from "../../models/common.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {
  }

  getMembers(): Observable<Member[]> {
    const url = `${this.apiBase}/members`;
    return this.http.get<any[]>(url)
      .pipe(
        map(ms => ms
          .map(m => ({
            id: m.id,
            given: m.given,
            surname: m.surname})
          )
        ),
      );
  }

  addMember(aMember: MemberCreate) {
    return this.http.post<Member>(`${this.apiBase}/members`, aMember);
  }

  deleteMember(id:number) {
    const url: string = this.apiBase + `/members/${id}`;
    return this.http.delete<void>(url);
  }

  getMemberById(id: number) {

    const url =  `${this.apiBase}/members/${id}`;

    return this.http.get<Member>(url);

  }
}
