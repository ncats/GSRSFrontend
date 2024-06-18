import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  template: '<div></div>',
  styles: []
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    let url=window.location.href;
    const regex1 = /\/ginas\/app\/beta\//;
    const regex2 = /\ginas\/app\/ui\//;
    if(url.match(regex1)) { 
      url = url.replace(regex1, "/ginas/app/ui/");
      const parts = url.split(regex2);
      if (parts.length > 2) {
        const replaced = parts.slice(0, -1).join('');
        url =  replaced + 'ginas/app/ui/' + parts[parts.length - 1];
        window.location.href = url;
      }
    } else { 
      this.router.navigate(['/home']);
    } 
  }

}
