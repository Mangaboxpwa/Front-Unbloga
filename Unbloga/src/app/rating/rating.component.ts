import { Component, OnInit,Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
    imports: [CommonModule],
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent  implements OnInit {
@Input() rating: number = 0;

constructor() { }

  ngOnInit() {}


  getStars(): ('full' | 'half')[] {
    const stars: ('full' | 'half')[] = [];
    let remaining = this.rating;

    for (remaining; remaining > 0; remaining--) {
      if (remaining >= 1) {
        stars.push('full');
      } else if (remaining >= 0.5) {
        stars.push('half');
      }
    }

    return stars;
  }
  
}
