import { Component, OnInit } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { DirectoryFile } from '@gsrs-core/admin/admin-objects.model';
import { LoadingService } from '@gsrs-core/loading';

@Component({
  selector: 'app-all-files',
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.scss']
})
export class AllFilesComponent implements OnInit {

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.id,
      text: node.text,
      level: level,
      hasLink: node.hasLink
    };
  }
  // it is impossible to follow the ordering rule. Doing so results in another tslint error.
/* tslint:disable */
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
/* tslint:enable */
  ngOnInit() {
    this.loadingService.setLoading(true);
    this.adminService.getFiles().pipe(take(1)).subscribe( result => {
      console.log(result);
        for (let i = 0; i < result.length; i += 1) {
          if (result[i].isDir === false) {
            result[i].hasLink = this.adminService.getDownloadLink(result[i].id);
          }
        }
          const temp = this.list_to_tree(result);
         this.dataSource.data = temp;
         this.loadingService.setLoading(false);

    }, error => this.loadingService.setLoading(false));

  }




  list_to_tree(list) {
    const map = {}, roots = [];
    let node;
    for (let i = 0; i < list.length; i += 1) {
      map[list[i].id] = i;
      list[i].children = [];
      if (i === 0) {
        list[i].order = 'primary';

      } else if (i % 2 === 0) {
        list[i].order = 'even';
      } else {
        list[i].order = 'odd';
      }
    }
    for (let i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent !== '#') {
        list[map[node.parent]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
}


interface FileTreeNode {
  expandable: boolean;
  name?: string;
  id?: string;
  level: number;
  text?: string;
  hasLink?: string;
}
