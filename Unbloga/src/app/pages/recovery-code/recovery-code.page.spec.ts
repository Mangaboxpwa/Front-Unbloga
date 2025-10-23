import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoveryCodePage } from './recovery-code.page';

describe('RecoveryCodePage', () => {
  let component: RecoveryCodePage;
  let fixture: ComponentFixture<RecoveryCodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
