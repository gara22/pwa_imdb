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
  scoreSubject = new Subject<number>();

  getAnswerSubj() {
    return this.answerSubject.asObservable();
  }

  answer(answer: { title: string; goodAnswer: boolean }) {
    this.answerSubject.next(answer);
    if (answer.goodAnswer) this.score++;
    this.scoreSubject.next(this.score);
  }

  getScore() {
    return this.scoreSubject.asObservable();
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
