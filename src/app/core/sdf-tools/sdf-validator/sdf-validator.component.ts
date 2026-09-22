import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import { SDF_TOOLS_ASSET_DIR, SDF_VALIDATOR_FILENAME } from '../sdf-tools.constants';

/**
 * Hosts the FDA-authored SD File Validator.
 *
 * The validator is embedded verbatim rather than reimplemented so that the FDA/GSRS team
 * retains ownership of the validation rules. It is sandboxed without `allow-same-origin`
 * so the embedded document cannot reach GSRS session state; it needs no network access of
 * its own because all of its processing is client-side.
 */
@Component({
  selector: 'app-sdf-validator',
  templateUrl: './sdf-validator.component.html',
  styleUrls: ['./sdf-validator.component.scss'],
  standalone: false
})
export class SdfValidatorComponent implements OnInit {
  validatorUrl: string;
  safeValidatorUrl: SafeResourceUrl;
  validatorFilename = SDF_VALIDATOR_FILENAME;
  isBrowser = false;

  constructor(
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const baseHref = this.configService.environment?.baseHref || '/';
    this.validatorUrl = `${baseHref}${SDF_TOOLS_ASSET_DIR}${SDF_VALIDATOR_FILENAME}`;
    this.safeValidatorUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.validatorUrl);
  }
}
