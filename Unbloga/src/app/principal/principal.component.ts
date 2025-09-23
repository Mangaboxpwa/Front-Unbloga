import { Component } from '@angular/core';
import { RatingComponent } from "../rating/rating.component";

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
