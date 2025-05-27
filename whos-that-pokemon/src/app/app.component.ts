import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CameraComponent } from "./shared/component/camera/camera.component";
import { PicService } from "./shared/service/pic.service";
import { Prediction } from "./shared/interface/prediction";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CameraComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'whos-that-pokemon';

  predictions: Prediction[] = [];
  isLoading = false;

  constructor(
    private predictionService: PicService
  ) {}
  getPredictions(file: File): void {
    this.isLoading = true;

    this.predictionService.predict(file).subscribe(
      (response: Prediction[]) => {
        this.predictions = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur de prédiction :', error);
        this.isLoading = false;
      }
    );
  }
}
