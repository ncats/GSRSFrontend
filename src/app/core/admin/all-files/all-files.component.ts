import { Component, OnInit } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MatTreeFlattener} from '@angular/material/tree';
import {MatTreeFlatDataSource} from '@angular/material/tree';
import { DirectoryFile } from '@gsrs-core/admin/admin-objects.model';
import { LoadingService } from '@gsrs-core/loading';

@Component({
  selector: 'app-all-files',
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.scss']
})
export class AllFilesComponent implements OnInit {

  /* eslint-enable */
  ngOnInit() {
    this.loadingService.setLoading(true);
    this.adminService.getFiles().pipe(take(1)).subscribe( result => {
        for (const r of result) {
          if (r.isDir === false) {
            r.hasLink = this.adminService.getDownloadLink(r.id);
          }
        }
          const temp = this.listToTree(result);
         this.dataSource.data = temp;
         this.loadingService.setLoading(false);

    }, error => this.loadingService.setLoading(false));

  }

  listToTree(list) {
    const map = {};
    const roots = [];
    let node;
    let count = 0;
    for (const l of list) {
      count++;
      map[l.id] = count;
      l.children = [];
      if (count === 1) {
        l.order = 'primary';

      } else if (count % 2 === 0) {
        l.order = 'even';
      } else {
        l.order = 'odd';
      }
    }
    for (const l of list) {
      node = l;
      if (node.parent !== '#') {
        list[map[node.parent]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  private _transformer = (node: any, level: number) => (
     {
      expandable: !!node.children && node.children.length > 0,
      name: node.id,
      text: node.text,
      level: level,
      hasLink: node.hasLink
    }
  );
  // it is impossible to follow the ordering rule. Doing so results in another tslint error.
/* eslint-disable */
  treeControl = new FlatTreeControl<FileTreeNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    logFiles: Array< DirectoryFile >;
  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService
  ) {
  }
  hasChild = (_: number, node: FileTreeNode) => node.expandable;
}


interface FileTreeNode {
  expandable: boolean;
  name?: string;
  id?: string;
  level: number;
  text?: string;
  hasLink?: string;
}
