import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

/* Libraries */
import { NgMathPipesModule, NgStringPipesModule } from 'angular-pipes';

/* Services */
import { EndpointService } from './services/endpoint/endpoint.service';
import { StorageService } from './services/storage/storage.service';

/* Interceptors */
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { VersionInterceptor } from './interceptors/version.interceptor';

/* Home Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/home/login/login.component';
import { RegisterComponent } from './components/home/register/register.component';

/* Dashboard Components */
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { FooterComponent } from './components/dashboard/footer/footer.component';
import { NavComponent } from './components/dashboard/nav/nav.component';
import { PanelComponent } from './components/dashboard/panel/panel.component';
import { SummaryComponent } from './components/dashboard/summary/summary.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { DataUploadComponent } from './components/dashboard/data-upload/data-upload.component';
import { DataExplorerComponent } from './components/dashboard/data-explorer/data-explorer.component';
import { AnalyticsComponent } from './components/dashboard/analytics/analytics.component';

/* Directives */
import { DndDirective } from './directives/dnd/dnd.directive';

/* Pipes */
import { MinutesPipe } from './pipes/minutes.pipe';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'summary', component: SummaryComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'data-upload', component: DataUploadComponent },
        { path: 'data-explorer', component: DataExplorerComponent },
        { path: 'analytics', component: AnalyticsComponent }
    ]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    SidebarComponent,
    PanelComponent,
    FooterComponent,
    NavComponent,
    RegisterComponent,
    ProfileComponent,
    DataUploadComponent,
    DataExplorerComponent,
    AnalyticsComponent,
    SummaryComponent,
    DndDirective,
    MinutesPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgMathPipesModule,
    NgStringPipesModule
  ],
  providers: [
    EndpointService,
    StorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: VersionInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
