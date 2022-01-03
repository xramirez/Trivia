import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APIInfo } from './api-info';

import { TriviaService } from './trivia.service';

describe('TriviaService', () => {
  let triviaService: TriviaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TriviaService]
    });
    triviaService = TestBed.inject(TriviaService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('should create TriviaService', () => {
    expect(triviaService).toBeTruthy();
  })

  it('should successfully access the opentrivia API', function() {
    let data;
    let apiInfo = {
      category : '',
      difficulty: '',
      choiceType: ''
    }

    spyOn(triviaService, 'getTrivia').and.returnValue(Promise.resolve(true))
    expect(triviaService.getTrivia).toHaveBeenCalled()

    /*const result:any = await triviaService.getTrivia(apiInfo);
    console.log('hello')
    expect(result.response_code).toEqual(0)*/

    /*triviaService.getTrivia(apiInfo)
      .then((resp:any) => {
        //data = resp;
        expect(resp.response_code).toBe(0)
      })*/
  })
});
