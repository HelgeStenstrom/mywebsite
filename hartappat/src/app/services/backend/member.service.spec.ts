import {MemberService} from "./member.service";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {Member, MemberCreate} from "../../models/common.model";
import {TestBed} from "@angular/core/testing";
import {provideHttpClient} from "@angular/common/http";

describe('MemberService', () => {

  let service: MemberService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aMember: Member = {id: 1, given: 'Test', surname: 'Testsson'};
  const aMemberCreate: MemberCreate = {given: 'Test', surname: 'Testsson'};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberService,provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MemberService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/members';
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  test('It gets members', done => {
    service.getMembers()
      .subscribe(result => {
        expect(result).toEqual([aMember]);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aMember]);
  });

  test('It adds a member', done => {
    service.addMember(aMemberCreate)
      .subscribe(result => {
        expect(result).toEqual(aMember);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(aMemberCreate);
    req.flush(aMember);
  });

  test('It deletes a member', done => {
    service.deleteMember(1)
      .subscribe(() => {
        done();
      });
    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  })


});
