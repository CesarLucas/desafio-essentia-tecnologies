import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarTarefaComponent } from './criar-tarefa';

describe('CriarTarefaComponent', () => {
  let component: CriarTarefaComponent;
  let fixture: ComponentFixture<CriarTarefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarTarefaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CriarTarefaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
