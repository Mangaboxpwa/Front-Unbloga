import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, home, search, person } from 'ionicons/icons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private navigation:NavigationService,) {
    addIcons({ triangle, ellipse, square, home, search,person });
  }
  goTab() {
  this.navigation.emptyStack();
}
}
