import {Component, Input, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {SubstanceName, SubstanceRelated, SubstanceService, SubstanceSummary} from '@gsrs-core/substance';

@Component({
  selector: 'app-substance-hierarchy',
  templateUrl: './substance-hierarchy.component.html',
  styleUrls: ['./substance-hierarchy.component.scss']
})
export class SubstanceHierarchyComponent implements OnInit {
  @Input() uuid: string;
  @Input() name: string;
  @Input() approvalID?: string;
  @Input() substance?: SubstanceSummary;
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  selfNode: HierarchyNode;
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
  constructor(
    private substanceService: SubstanceService,
  ) { }

  ngOnInit() {
    this.selfNode = {
      'id': 0,
      'type': 'ROOT',
      'parent': '#',
      'expandable': false,
      'value': {
        'refuuid': this.uuid,
        'name': this.name,
        'approvalID': this.approvalID || ''
      },
      'relationship': ''
    };
      this.substanceService.getHierarchy(this.uuid).subscribe(resp => {
        this.loadHierarchy(resp);
      }, error => {
       this.loadHierarchy([this.selfNode]);
      });
  }

  loadHierarchy(orig: any): void {

    if (orig.length === 0) {
      orig.push(this.selfNode);
    }

    for (let i = 0; i < orig.length; i++) {
      const row: any = orig[i];
      if (row.depth === 0) {
        row.parent = '#';
      }
    }
    if (orig.length > 1) {
      orig = this.formatHierarchy(orig);
    }
    const temp2 = this.list_to_tree(orig);
    this.dataSource.data = temp2;
  }

    formatHierarchy(data: any): HierarchyNode {
    let lastID = '';
    let lastProp = '';
    const parentRemap = [];

    for (let i = (data.length - 1); i >= 0; i--) {
      if (data[i].depth === 0) {
        data[i].parent = '#';
      }
      const subref = data[i].value;
      data[i].relationship = '';
      if (subref.refuuid === this.uuid) {
        data[i].self = true;
      }

      if (!subref.approvalID && subref.linkingID && subref.linkingID.length === 10) {
        data[i].value.approvalID = data[i].value.linkingID;
      }
      if (!data[i].value.approvalID) {
        const matches = data[i].text.match(/\[(.*?)\]/);
        if (matches) {
          data[i].value.approvalID = matches[1];
        }
      }
      // remove children identical to parent with active moiety relationship, format text
      if ((subref.refuuid === lastID) && (lastProp.includes('HAS ACTIVE MOIETY'))) {
        parentRemap.push([data[i + 1].id, data[i].id]);
        data.splice(i + 1, 1);
        data[i].relationship += '{ACTIVE MOIETY}';
      }
      if (data[i].type.includes('HAS ACTIVE MOIETY')) {
        data[i].relationship += '{ACTIVE FORM}';
      } else if (data[i].type.includes('IS SALT/SOLVATE OF')) {
        data[i].relationship += '{SALT/SOLVATE}';
      } else if (data[i].type.includes('IS SUBCONCEPT OF')) {
        data[i].relationship += '{SUBCONCEPT}';
      } else if (data[i].type.includes('IS G1SS CONSTITUENT OF')) {
        data[i].relationship += '{G1SS}';
      }


      data[i].refuuid = data[i].value.refuuid;
      lastID = data[i].refuuid;
      lastProp = data[i].type;
    }
    // further remove self referential relationships with both salt and moiety relationship.
    data.sort(function(a, b) {
      const textA = a.refuuid.toUpperCase();
      const textB = b.refuuid.toUpperCase();
      if (textA === textB) {
        return (a.parent < b.parent) ? -1 : (a.parent > b.parent) ? 1 : 0;
      } else {
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      }
    });

    // delete duplicates entries with both active moiety and salt/ solvate relationships.
    for (let i = (data.length - 1); i >= 0; i--) {
      if (i !== data.length - 1) {
        if ((data[i].value.refuuid === data[i + 1].value.refuuid)) {
          if ((data[i].parent === data[i + 1].parent)) {
            if (data[i].type.includes('HAS ACTIVE MOIETY') && data[i + 1].type.includes('IS SALT/SOLVATE OF')) {
              parentRemap.push([data[i].id, data[i + 1].id]);
              data.splice(i, 1);
            } else if (data[i + 1].type.includes('HAS ACTIVE MOIETY') && data[i].type.includes('IS SALT/SOLVATE OF')) {
              parentRemap.push([data[i + 1].id, data[i].id]);
              data.splice(i + 1, 1);
            }
          }
        }
      }
    }
    data.sort(function(a, b) {
      return a.id - b.id;
    });

    for (let i = data.length - 1; i >= 0; i--) {
      for (let k = 0; k < parentRemap.length; k++) {
        if (data[i].parent === parentRemap[k][0]) {
          data[i].parent = parentRemap[k][1];
        }
      }
    }
    return data;
  }

  list_to_tree(list) {
    const map = {}, roots = [];
    let node, i;
    for (i = 0; i < list.length; i += 1) {
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
    for (i = 0; i < list.length; i += 1) {
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

interface HierarchyNode {
  id: number;
  parent: any;
  type: string;
  self?: boolean;
  value: SubstanceRelated;
  expandable: boolean;
  relationship?: string;
  children?: Array<HierarchyNode>;
}
