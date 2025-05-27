import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { CameraPreview } from "@capacitor-community/camera-preview";

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements OnInit {

  cameraPermission: boolean = false;

  @Output() image: EventEmitter<File> = new EventEmitter<File>();

  ngOnInit(): void {
    this.checkPermissions().then(() => {
      if (this.cameraPermission) {
        CameraPreview.start({
          parent: "cameraPreview",
          position: "rear",
          width: 500,
          height: 500,
        });
      }
    });
  }

  async checkPermissions() {
    if (Capacitor.getPlatform() !== 'web') {
      const permissions = await Camera.checkPermissions();
      if (permissions.camera === 'prompt') {
        const auth = await Camera.requestPermissions();
        if (auth.camera === 'granted') {
          this.cameraPermission = true;
        }
      } else if (permissions.camera === 'granted') {
        this.cameraPermission = true;
      }
    } else {
      this.cameraPermission = true;
    }
  }

  async takePicture() {
    CameraPreview.capture({
      quality: 90,
      width: 500,
      height: 500,
    }).then((image) => {
      const file = this.base64ToFile(this.fixBase64(image.value), 'captured_image.png');
      if (file) {
        this.image.emit(file);
      }
    });
  }

  fixBase64(base64: string): string {
    if (!base64.startsWith('data:image/png;base64,')) {
      base64 = 'data:image/png;base64,' + base64;
    }
    return base64;
  }

  base64ToFile(base64: string, filename: string): File | undefined {
    const arr = base64.split(',');
    const arrMatch = arr[0].match(/:(.*?);/);
    if (arrMatch && arrMatch.length >= 1) {
      const mime = arrMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    return;
  }
}
