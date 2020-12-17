import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private titleService: Title, private meta: Meta) { }

  updateTitle(title: string) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
  }

  getTitle() {
    return this.titleService.getTitle();
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
  }
}
