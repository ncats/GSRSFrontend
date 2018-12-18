import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(
    private sanitizer: DomSanitizer,
    public configService: ConfigService
  ) { }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
}
