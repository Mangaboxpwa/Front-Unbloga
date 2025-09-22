import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rate.component.html',
  styleUrl: './star-rate.component.css'
})
export class StarRateComponent {
  stars = [1, 2, 3, 4, 5];
  selected = 0; // valor guardado
  hoverValue = 0; // valor mientras paso el mouse

  // Detecta mitad de estrella
  getStarValue(star: number, event: MouseEvent): number {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    return star - (isHalf ? 0.5 : 0);
  }

  // Hover dinámico
  onMouseMove(star: number, event: MouseEvent) {
    this.hoverValue = this.getStarValue(star, event);
  }

  // Reset al salir
  onMouseLeave() {
    this.hoverValue = 0;
  }

  // Guardar selección
  onClick(star: number, event: MouseEvent) {
    this.selected = this.getStarValue(star, event);
  }

  // Determinar clase del ícono
  getIcon(star: number): string {
    const value = this.hoverValue || this.selected;

    if (value >= star) {
      return 'bi bi-star-fill';
    } else if (value >= star - 0.5) {
      return 'bi bi-star-half';
    } else {
      return 'bi bi-star';
    }
  }
}
