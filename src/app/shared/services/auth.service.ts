import { Observable } from 'rxjs/observable';
import { UserService } from './user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'shared/models/app-user';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/Observable/of';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User>;
  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    this.user$ = afAuth.authState;
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
  get appUser$(): Observable<AppUser> {
    return this.user$.switchMap((user) => {
      if (user) return this.userService.get(user.uid);
      return Observable.of(null);
    });
  }
}
