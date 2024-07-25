import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


interface UserDocument {
  role: string;
  taxID: string; // Add taxID to the UserDocument interface
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

  async loginUser(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const uid = result.user?.uid;
      if (uid) {
        const role = await this.getUserRole(uid);
        this.navigateBasedOnRole(role);
      }
    } catch (error) {
      console.error('Login error', error);
      alert('Invalid email or password');
    }
  }

  async registerUser(email: string, password: string, role: string = 'user', taxID: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      if (uid) {
        // Save role and taxID in the Firestore document
        await this.firestore.collection('users').doc(uid).set({ role, taxID });
        this.navigateBasedOnRole(role);
      }
    } catch (error) {
      console.error('Registration error', error);
    }
  }

  async logout(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await this.afAuth.signOut();
      console.log('logged out');
      this.router.navigate(['']);
    } catch (error) {
      console.error('Logout error', error);
    }
  }

  getAuthState() {
    return this.afAuth.authState;
  }


  // Method to get the current user's UID
  async getCurrentUserUID(): Promise<string | null> {
    try {
      const user = await this.afAuth.currentUser;
      return user ? user.uid : null;
    } catch (error) {
      console.error('Error fetching current user UID:', error);
      return null; // Handle error, maybe throw or return null
    }
  }

  private async getUserRole(uid: string): Promise<string> {
    const doc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();

    if (doc && doc.exists) {
      const userData = doc.data() as UserDocument;
      return userData.role || 'N/A'; // Use a distinct default value
    } else {
      console.error('User document does not exist or is undefined');
      return 'N/A'; // Return a more distinct default role
    }
  }

  async getSuperUserSparkasse(uid: string): Promise<string> {
    try {
      // Fetch the document snapshot
      const doc = await this.firestore
        .collection('users')
        .doc(uid)
        .get()
        .toPromise();
  
      // Check if the document exists and is not undefined
      if (doc && doc.exists) {
        const userData = doc.data() as UserDocument;
        return userData.bausparkasse || 'N/A'; // Return 'N/A' if bausparkasse is undefined
      } else {
        console.error('User document does not exist.');
        return 'N/A'; // Return 'N/A' or another distinct default value
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      return 'N/A'; // Return 'N/A' in case of an error
    }
  }
    

  public async getUserTaxID(uid: string): Promise<string> {
    const doc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();

    if (doc && doc.exists) {
      const userData = doc.data() as UserDocument;
      return userData.taxID || 'N/A'; // Use a distinct default value
    } else {
      console.error('User document does not exist or is undefined');
      return 'N/A'; // Return a more distinct default value
    }
  }
  

  private navigateBasedOnRole(role: string) {
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


    // Method to save data to a specific collection
    saveData(wohnungsbaupraemie: string, data: any): Observable<void> {
      const documentId = this.firestore.createId(); // Generate a unique ID for the document
      return new Observable((observer) => {
        this.firestore.collection(wohnungsbaupraemie).doc(documentId).set(data).then(() => {
          observer.next();
          observer.complete();
        }).catch((error) => {
          observer.error(error);
        });
      });
    }
}
