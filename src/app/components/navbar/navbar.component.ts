import { Component, OnInit } from '@angular/core';

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { AuthService } from '../../services/auth.service';
import { PicturesService } from '../../services/pictures.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string;
  profilePicUrl: string;
  fullName: string;
  routerLinkOpts: object = { exact: true };
  userId: string;

  constructor(public authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,
              private picturesService: PicturesService) {
  }

  ngOnInit() {
    const decodedToken = this.authHelperService.getDecodedAuthToken();
    if (decodedToken) {
      this.fullName = `${decodedToken.firstName} ${decodedToken.lastName}`;
    }

    this.username = this.authHelperService.getUsernameFromToken();
    this.userId = this.authHelperService.getUserIdFromToken();
    this.profilePicUrl = this.picturesService.getProfilePicUrl(this.userId);

    this.authHelperService.loginAnnounced.subscribe(data => {
      const decToken = this.authHelperService.getDecodedAuthToken();
      this.username = this.authHelperService.getUsernameFromToken();
      this.userId = this.authHelperService.getUserIdFromToken();
      this.fullName = `${decToken.firstName} ${decToken.lastName}`;
      this.profilePicUrl = this.picturesService.getProfilePicUrl(this.userId);
    });
  }

  onLogoutClick() {
    this.authHelperService.logout();
    this.toastService.toast('Logged out.');
    this.router.navigate(['/']);
    return false;
  }

}
