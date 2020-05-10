import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private answerSubject = new Subject<{
    title: string;
    goodAnswer: boolean;
  }>();

  score: number = 0;

  getAnswerSubj() {
    return this.answerSubject.asObservable();
  }

  answer(answer: { title: string; goodAnswer: boolean }) {
    this.answerSubject.next(answer);
    if (answer.goodAnswer) this.score++;
  }

  getScore() {
    return this.score;
  }

  newGame() {
    this.score = 0;
    this.answerSubject = new Subject<{
      title: string;
      goodAnswer: boolean;
    }>();
  }

  constructor() {}
}
