import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private stack: string[] = [];
  fallback = '/tab3'
  constructor(private router: Router) {}

  push(url: string) {
    this.stack.push(url);
    console.log(this.stack)
  }

  canGoBack(): boolean {
    console.log(this.stack)
    return this.stack.length > 0;
  }

  back() {
    // Quitamos la página actual
    this.stack.pop();
    const previous = this.stack[this.stack.length - 1];
    console.log(this.stack)
    if (previous) {
        console.log(previous)
      this.router.navigateByUrl(previous);
    } else {
      // Fallback: ir al tab1
      this.router.navigateByUrl(this.fallback);
    }
  }
  pop(){
    this.stack.pop()
  }

  emptyStack(){
    this.stack = []
  }
}
