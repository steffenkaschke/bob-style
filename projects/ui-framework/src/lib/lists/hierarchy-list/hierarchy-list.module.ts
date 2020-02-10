import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyListComponent } from './hierarchy-list.component';
import { HierarchyListService } from './hierarchy-list.service';
import { FiltersModule } from '../../services/filters/filters.module';
import { SearchModule } from '../../search/search/search.module';
import { ListFooterModule } from '../list-footer/list-footer.module';

@NgModule({
  declarations: [HierarchyListComponent],
  imports: [CommonModule, FiltersModule, SearchModule, ListFooterModule],
  exports: [HierarchyListComponent],
  providers: [HierarchyListService],
})
export class HierarchyListModule {}
