import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config/config.service';
import { Environment } from '../../../environments';

@Directive({
  selector: '[appSubstanceImage]'
})
export class SubstanceImageDirective implements AfterViewInit {
  private privateEntityId: string;
  private privateSize?: number;
  private privateStereo = false;
  private imageElement: HTMLImageElement;
  private isAfterViewInit = false;
  private privateAtomMaps?: Array<number>;
  private privateVersion?: number;

  constructor(
    private el: ElementRef,
    private utilsService: UtilsService,
    private configService: ConfigService,
    private http: HttpClient,
    private environment: Environment
  ) {
    this.imageElement = this.el.nativeElement as HTMLImageElement;
  }

  ngAfterViewInit() {
    this.isAfterViewInit = true;
    this.setImageSrc();
  }

  @Input()
  set version(version: number) {
    if (version !== this.privateVersion) {
      this.privateVersion = version;
      this.setImageSrc();
    }
  }

  @Input()
  set entityId(entityId: string) {
    if (entityId !== this.privateEntityId) {
      this.privateEntityId = entityId;
      this.setImageSrc();
    }
  }

  @Input()
  set size(size: number) {
    if (size !== this.privateSize) {
      this.privateSize = size;
      this.setImageSrc();
    }
  }

  @Input()
  set stereo(showStereo: boolean) {
    if (showStereo !== this.privateStereo) {
      this.privateStereo = showStereo;
      this.setImageSrc();
    }
  }

  @Input()
  set atomMaps(atomMaps: Array<number>) {
    if (atomMaps !== this.privateAtomMaps) {
      this.privateAtomMaps = atomMaps;
      this.setImageSrc();
    }
  }

  private setImageSrc(): void {
    const useDataUrlConfig = this.configService.configData && this.configService.configData.useDataUrl || false;
    if (this.isAfterViewInit) {
      if (this.privateEntityId) {
        if (this.privateVersion) {
          const srcUrl = this.utilsService.getStructureImgUrl(
            this.privateEntityId, this.privateSize, this.privateStereo, this.privateAtomMaps, this.privateVersion);
          if (useDataUrlConfig === true) {
            this.setImageSrcAsBlob(srcUrl);
          } else {
            this.imageElement.src = srcUrl;
          }
        } else {
          const srcUrl = this.utilsService.getStructureImgUrl(
            this.privateEntityId, this.privateSize, this.privateStereo, this.privateAtomMaps);
          if (useDataUrlConfig === true) {
            this.setImageSrcAsBlob(srcUrl);
          } else {
            this.imageElement.src = srcUrl;
          }
        }
    } else { 
      const srcUrl =`${this.environment.baseHref || ''}assets/images/noimage.svg`;
      if (useDataUrlConfig === true) {
        this.setImageSrcAsBlob(srcUrl);
      } else {
        this.imageElement.src = srcUrl;
      }

    }
      this.imageElement.alt = 'structure image';
    }
  }

  private setImageSrcAsBlob(srcUrl: any): void {
    // Getting Image Source as Blob
    this.http.get(srcUrl, { responseType: "blob" }).subscribe(imgDat => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageElement.src = reader.result.toString();
      }, false);
      if (imgDat) {
        reader.readAsDataURL(imgDat);
      }
    });
  }

}
