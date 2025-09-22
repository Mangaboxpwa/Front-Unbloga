import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  @Input() rating: number = 0;

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
