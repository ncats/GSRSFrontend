import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Location } from "@angular/common";
import { AuthService } from "@gsrs-core/auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  standalone: false,
})
export class AdminComponent implements OnInit, OnDestroy {
  activeTab: number;
  current: string;
  lastTab: number;
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  // Getters, not fields, so template reads always reflect the current privilege signal.
  get canManageCVs(): boolean {
    return this.authService.hasPrivilege('Manage CVs');
  }

  get canRunJobs(): boolean {
    return this.authService.hasPrivilege('Run Tasks');
  }

  get canImportData(): boolean {
    return this.authService.hasPrivilege('Import Data');
  }

  get canManageUsers(): boolean {
    return this.authService.hasPrivilege('Manage Users');
  }

  get canViewServerFiles(): boolean {
    return this.authService.hasPrivilege('View Files');
  }

  get canViewServiceInfo(): boolean {
    return this.authService.hasPrivilege('View Service Info');
  }

  async ngOnInit() {
    // Awaited (not the getters above) to guarantee privileges are loaded before the routing decision below, since an early wrong redirect would destroy this component with no chance to self-correct.
    await this.authService.hasSpecificPrivilege('Manage CVs');

    const routeSub = this.activatedRoute.params.subscribe((routeParams) => {
      this.current = routeParams.function;
      let actualTab = this.getActualTab(this.current);
      switch (this.current) {
        case "cache":
          this.activeTab = 0;
          break;
        case "info":
          this.activeTab = actualTab;
          break;
        case "user":
          if (!this.canManageUsers) {
            this.activeTab = -1;
            break;
          }
          this.activeTab = actualTab;
          break;
        case "import":
          if (!this.canImportData) {
            this.activeTab = -1;
            break;
          }
          this.activeTab = actualTab;
          break;
        case "cv":
          if (!this.canManageCVs) {
            this.activeTab = -1;
            break;
          }
          this.activeTab = actualTab;
          break;
        case "jobs":
          if (!this.canRunJobs) {
            this.activeTab = -1;
            break;
          }
          this.activeTab = actualTab;
          break;
        case "files":
          if (!this.canViewServerFiles) {
            this.activeTab = -1;
            break;
          }
          this.activeTab = actualTab;
          break;
        case "data":
          if (!this.canImportData) {
            this.activeTab = -1;
            break;
          }
          this.activeTab = actualTab;
          break;
        default:
          this.activeTab = 0;
          break;
      }

      if (this.activeTab <= -1) {
        this.router.navigate(["/home"]);
      }
    });
    this.subscriptions.push(routeSub);
    const tab = this.activatedRoute.snapshot.queryParams["function"] || "cache";
  }

  onTabChanged(event: MatTabChangeEvent): void {
    let route = "cache";

    let newRoute = this.getActualTabName(event.index);
    if (newRoute.length > 0) {
      route = newRoute;
    }
    if (this.current !== route) {
      if (this.current !== "jobs") {
        this.current = route;
        this.router.navigate(["/admin/" + route]);
      } else {
        this.current = route;
        this.activeTab = 0;
        this.router.navigate(["/admin/" + route]);
      }
    }
  }

  getFilteredTabs() {
    let allTabs = [
      { name: "cache", available: this.canViewServiceInfo },
      { name: "info", available: this.canViewServiceInfo },
      { name: "user", available: this.canManageUsers },
      { name: "import", available: this.canImportData },
      { name: "cv", available: this.canManageCVs },
      { name: "jobs", available: this.canRunJobs },
      { name: "files", available: this.canViewServerFiles },
      { name: "data", available: this.canImportData },
    ];

    return allTabs.filter((t) => t.available);
  }

  getActualTab(desiredFunctionality: string): number {
    let filteredTabs = this.getFilteredTabs();
    for (let t = 0; t < filteredTabs.length; t++) {
      if (filteredTabs[t].name == desiredFunctionality) {
        return t;
      }
    }
    return -1;
  }

  getActualTabName(tabNumber: number) {
    let filteredTabs = this.getFilteredTabs();
    if (tabNumber < 0 || tabNumber >= filteredTabs.length) return "";
    return filteredTabs[tabNumber].name;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub?.unsubscribe());
  }
}
