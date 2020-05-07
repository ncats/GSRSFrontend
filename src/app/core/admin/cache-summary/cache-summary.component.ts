import { Component, OnInit } from '@angular/core';
import { HealthInfo } from '@gsrs-core/admin/admin-objects.model';

@Component({
  selector: 'app-cache-summary',
  templateUrl: './cache-summary.component.html',
  styleUrls: ['./cache-summary.component.scss']
})
export class CacheSummaryComponent implements OnInit {
  displayedColumns: string[] = ["database", "driver", "product", "latency", "connected"];
  health : HealthInfo = {
    "epoch": 1588692674402,
    "uptime": [
        0,
        0,
        1
    ],
    "threads": 70,
    "runningThreads": 26,
    "javaVersion": "1.8.0_121",
    "hostname": "ncats-2003870-m.fios-router.home",
    "runtime": {
        "availableProcessors": 8,
        "freeMemory": 114110792,
        "totalMemory": 1014497280,
        "maxMemory": 1014497280
    },
    "databaseInformation": [
        {
            "database": "default",
            "driver": "org.h2.Driver",
            "product": "H2 1.3.175 (2014-01-18)",
            "latency": 0,
            "connected": true
        },
        {
            "database": "srscid",
            "driver": "org.h2.Driver",
            "product": "H2 1.3.175 (2014-01-18)",
            "latency": 0,
            "connected": true
        },
        {
            "database": "farm",
            "driver": "org.h2.Driver",
            "product": "H2 1.3.175 (2014-01-18)",
            "latency": 0,
            "connected": true
        }
    ],
    "cacheInfo": {
        "maxCacheElements": 10240,
        "maxNotEvictableCacheElements": 1000,
        "timeToLive": 86400,
        "timeToIdle": 86400
    }
};
  constructor() { }

  ngOnInit() {
    console.log(this.health);
  }

}
