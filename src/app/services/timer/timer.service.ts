import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTime: number;
  private endTime: number;

  constructor() { }
  
  start() {
      this.startTime = new Date().getTime();
  }
    
  stop() {
      this.endTime = new Date().getTime();
  }
    
  getTime() {
      return this.endTime - this.startTime;
  }
    
  clear() {
      this.startTime = null;
      this.endTime = null;
  }
}
