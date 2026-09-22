import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@gsrs-core/config';
import {
  SDF_ONLINE_RESOURCES,
  SDF_QUICK_GUIDE_FILENAME,
  SDF_RECOMMENDED_HEADERS,
  SDF_SAMPLE_FILENAME,
  SDF_SUPPORT_CONTACTS,
  SDF_TOOLS_ASSET_DIR
} from '../sdf-tools.constants';

@Component({
  selector: 'app-sdf-guide',
  templateUrl: './sdf-guide.component.html',
  styleUrls: ['./sdf-guide.component.scss'],
  standalone: false
})
export class SdfGuideComponent implements OnInit {
  quickGuideUrl: string;
  sampleFileUrl: string;
  sampleFilename = SDF_SAMPLE_FILENAME;
  recommendedHeaders = SDF_RECOMMENDED_HEADERS;
  supportContacts = SDF_SUPPORT_CONTACTS;
  onlineResources = SDF_ONLINE_RESOURCES;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    const baseHref = this.configService.environment?.baseHref || '/';
    this.quickGuideUrl = `${baseHref}${SDF_TOOLS_ASSET_DIR}${SDF_QUICK_GUIDE_FILENAME}`;
    this.sampleFileUrl = `${baseHref}${SDF_TOOLS_ASSET_DIR}${SDF_SAMPLE_FILENAME}`;
  }
}
