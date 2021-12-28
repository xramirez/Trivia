import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TriviaService } from '../trivia.service';
import { APIInfo } from '../api-info';
import { Answer } from './answer';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  results: Array<any> = [];
  activeQuestion: number = 0;
  answers: Answer[] = [];
  selected:Answer = {answer: '', isCorrect: false};
  correctAnswers:number = 0;

  @Input() gameInfo: APIInfo;
  @Output() endInfo = new EventEmitter();

  constructor(private triviaService: TriviaService) {
    this.gameInfo = { category: '', difficulty: '', choiceType: '' }
  }

  ngOnInit(): void {
    console.log(this.gameInfo)
    this.getTrivia();
  }

  getTrivia() {
    this.triviaService.getTrivia({ category: this.gameInfo.category, difficulty: this.gameInfo.difficulty, choiceType: this.gameInfo.choiceType })
      .then((resp: any) => {
        this.results = resp.results;
        //console.log(this.results)
        this.createAnswers();
      }).catch(console.log)
  }

  createAnswers() {
    //first, we are going to clear out answers (in case it had stuff in it)
    //then we'll fill it with answers at the index of the question
    this.answers = [];
    this.answers.push({ answer: this.results[this.activeQuestion].correct_answer, isCorrect: true })
    console.log(this.results[this.activeQuestion].correct_answer)
    for (let answer of this.results[this.activeQuestion].incorrect_answers)
      this.answers.push({ answer: answer, isCorrect: false });
    //console.log(this.answers)

    //the second portion of this function is to jumble up the answers. The min is 4, the max is 2
    if (this.answers.length > 2) {
      let currentIndex = this.answers.length, randomIndex = 0;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [this.answers[currentIndex], this.answers[randomIndex]] = [this.answers[randomIndex], this.answers[currentIndex]];
      }
    }
    else if(this.answers.length === 2)
    {
      let trueAnswer = this.answers.find(item => item.answer === 'True')!;
      let falseAnswer = this.answers.find(item => item.answer === 'False')!;
      this.answers = [trueAnswer, falseAnswer]
    }
  }

  nextQuestion() {
    if(this.activeQuestion < 9)
    {
      if(this.selected.isCorrect)
      {
        this.correctAnswers++;
        this.selected = {answer: '', isCorrect: false};
      }
      console.log(`Correct answers: ${this.correctAnswers}`)
      this.activeQuestion++;
      this.createAnswers();
    }
    else if(this.activeQuestion === 9){
      if(this.selected.isCorrect)
        this.correctAnswers++
      this.endGame()
    }
  }

  endGame()
  {
    this.endInfo.emit(this.correctAnswers)
  }
}
