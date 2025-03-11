import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated$ = signal<boolean>(false);

  constructor() { }

  public setAuthentication(state: boolean): void {
    this.isAuthenticated$.set(state);
  }

  public logout(): void {
    if (this.isLocalStorage) {
      localStorage.removeItem('authToken');
      this.setAuthentication(false);
    }
  }

  public get isAuthenticated(): boolean {
    const signalState = this.isAuthenticated$();
    if (!signalState) {
      this.isAuthenticated$.set(true);
    }
    return signalState;
  }

  private get isLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
