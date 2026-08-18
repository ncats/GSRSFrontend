import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GeneralService } from '../service/general.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserManualComponent } from './user-manual.component';

describe('UserManualComponent', () => {
  let component: UserManualComponent;
  let fixture: ComponentFixture<UserManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ UserManualComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GeneralService, useValue: { getManualFile: () => of({
          headers: { get: () => 'attachment; filename=manual.pdf' },
          body: new Blob()
        }) } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v, bypassSecurityTrustUrl: (v: any) => v, bypassSecurityTrustResourceUrl: (v: any) => v } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
