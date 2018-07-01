import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

/* Libraries */
import { NgMathPipesModule } from 'angular-pipes';

/* Services */
import { EndpointService } from './services/endpoint/endpoint.service';

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
import { FileDirective } from './directives/file/file.directive';

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
    FileDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgMathPipesModule
  ],
  providers: [
    EndpointService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
