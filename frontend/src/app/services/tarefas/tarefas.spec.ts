import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TarefasService } from './tarefas';

describe('TarefasService', () => {
  let service: TarefasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TarefasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
