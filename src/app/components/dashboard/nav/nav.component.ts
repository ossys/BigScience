import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '../../../constants';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router,
              private storageService: StorageService) { }

  ngOnInit() {
  }
    
  logout() {
    this.storageService.remove(Constants.LOCAL_STORAGE.JWT);
    this.router.navigate(['login']);
  }

}
