import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

interface UserDocument {
  role: string;
  taxID: string;
  bausparkasse: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async loginUser(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      if (uid) {
        const role = await this.getUserRole(uid);
        this.navigateBasedOnRole(role);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password');
    }
  }

  async registerUser(email: string, password: string, role: string = 'user', taxID: string): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      if (uid) {
        await this.firestore.collection('users').doc(uid).set({ role, taxID });
        this.navigateBasedOnRole(role);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      console.log('Logged out successfully');
      this.router.navigate(['']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getAuthState(): Observable<firebase.User | null> {
    return this.afAuth.authState as Observable<firebase.User | null>;
  }

  async getCurrentUserUID(): Promise<string | null> {
    try {
      const user = await this.afAuth.currentUser;
      return user ? user.uid : null;
    } catch (error) {
      console.error('Error fetching current user UID:', error);
      return null;
    }
  }

  private async getUserRole(uid: string): Promise<string> {
    try {
      const doc = await this.firestore.collection('users').doc(uid).get().toPromise();
      if (doc && doc.exists) {
        const userData = doc.data() as UserDocument;
        return userData.role || 'N/A';
      } else {
        console.error('User document does not exist or is undefined');
        return 'N/A';
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'N/A';
    }
  }

  async getSuperUserSparkasse(uid: string): Promise<string> {
    try {
      const doc = await this.firestore.collection('users').doc(uid).get().toPromise();
      if (doc && doc.exists) {
        const userData = doc.data() as UserDocument;
        return userData.bausparkasse || 'N/A';
      } else {
        console.error('User document does not exist');
        return 'N/A';
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      return 'N/A';
    }
  }

  async getUserTaxID(uid: string): Promise<string> {
    try {
      const doc = await this.firestore.collection('users').doc(uid).get().toPromise();
      if (doc && doc.exists) {
        const userData = doc.data() as UserDocument;
        return userData.taxID || 'N/A';
      } else {
        console.error('User document does not exist or is undefined');
        return 'N/A';
      }
    } catch (error) {
      console.error('Error fetching user tax ID:', error);
      return 'N/A';
    }
  }

  private navigateBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/download-form']);
        break;
      case 'user':
      default:
        this.router.navigate(['/data-table']);
        break;
    }
  }

  saveData(collectionName: string, data: any): Observable<void> {
    const documentId = this.firestore.createId();
    return new Observable((observer) => {
      this.firestore.collection(collectionName).doc(documentId).set(data).then(() => {
        observer.next();
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
