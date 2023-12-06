import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config/config.service';

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
  private privateAltId?: string;

  constructor(
    private el: ElementRef,
    private utilsService: UtilsService,
    private configService: ConfigService,
    private http: HttpClient
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
  set stagingId(stagingId: string) {
    if (stagingId !== this.privateAltId) {
      this.privateAltId = stagingId;
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
          let srcUrl = this.utilsService.getStructureImgUrl(
            this.privateEntityId, this.privateSize, this.privateStereo, this.privateAtomMaps);
          if (this.privateAltId) {
            srcUrl = this.utilsService.getStructureImgUrl(
              this.privateEntityId, this.privateSize, this.privateStereo, this.privateAtomMaps, null, this.privateAltId);
          } else {
          }
         
          if (useDataUrlConfig === true) {
            this.setImageSrcAsBlob(srcUrl);
          } else {
            this.imageElement.src = srcUrl;
          }
        }
    } else { 
      let srcUrl =`${this.configService.environment.baseHref || ''}assets/images/noimage.svg`;

      if(this.privateAltId) {
        srcUrl = this.utilsService.getStructureImgUrl(
          this.privateEntityId, this.privateSize, this.privateStereo, this.privateAtomMaps, null, this.privateAltId);
      }
      if(this.privateSize){
        this.imageElement.height = this.privateSize;
        this.imageElement.width = this.privateSize;
        }else{
              this.imageElement.height = 150;
              this.imageElement.width = 150;
        }
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
