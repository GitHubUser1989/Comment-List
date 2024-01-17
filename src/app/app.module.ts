import { AppComponent } from './app.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DialogComponent, CommentComponent, EditCommentComponent, ListCommentsComponent, NewCommentComponent } from './components';
import { CommentService, ApiService, TranslationLoaderService } from './services';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    AppComponent,
    DialogComponent,
    ListCommentsComponent,
    CommentComponent,
    NewCommentComponent,
    EditCommentComponent,
  ],
  providers: [
    ApiService,
    CommentService,
    TranslationLoaderService,
    {
      provide: APP_INITIALIZER,
      useFactory: (translationLoader: TranslationLoaderService) => () => translationLoader.loadTranslation(),
      deps: [TranslationLoaderService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
