import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentData, DynamicForm } from '../firestore.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  note2 =
    'Prämienberechtigt für 2022 sind alle unbeschränkt einkommensteuerpflichtigen Personen, die vor dem 2. 1.2007 geboren oder Vollwaisen sind...';
  note3 =
    'Bausparbeiträge, die vermögenswirksame Leistungen sind, werden vorrangig durch Gewährung einer Arbeitnehmer-Sparzulage gefördert...';

  form: FormGroup;
  documentId: string | null = null;  // Variable to store document ID


  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      taxID: ['', Validators.required],
      identifikationsnummerEhegatte: ['', Validators.required],
      familienname: ['', Validators.required],
      vorname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      partnerFamilienname: [''],
      partnerVorname: [''],
      partnerGeburtsdatum: [''],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      stadt: ['', Validators.required],
      bundesland: ['', Validators.required],
      postleitzahl: ['', Validators.required],
      familienstand: ['', Validators.required],
      dynamicForms: this.fb.array([]),
    });

    this.addForm(); // Initialize with one form
  }

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.fetchDocumentData(uid);
      this.documentId = uid;
    }
  }

  get dynamicForms() {
    return this.form.get('dynamicForms') as FormArray;
  }

  addForm(): void {
    const dynamicForm = this.fb.group({
      vertragsnummer: [''],
      abschlussdatum: [''],
      bausparsumme: [''],
      bausparbeitrag: [''],
      hoechstbetrag: [''],
      vermoegenswirksameLeistungen: [''],
    });

    this.dynamicForms.push(dynamicForm);
  }

  removeForm(index: number): void {
    if (this.dynamicForms.length > 1) {
      this.dynamicForms.removeAt(index);
    } else {
      alert('At least one form is required.');
    }
  }


  private async fetchDocumentData(uid: string): Promise<void> {
    try {
      const docSnapshot = await this.firestore.collection('wohnungsbaupraemie').doc(uid).get().toPromise();
      if (docSnapshot?.exists) {
        const data = docSnapshot.data() as DocumentData;
        if (data) {
          this.form.patchValue({
            taxID: data.taxID,
            identifikationsnummerEhegatte: data.identifikationsnummerEhegatte,
            familienname: data.familienname,
            vorname: data.vorname,
            geburtsdatum: data.geburtsdatum,
            partnerFamilienname: data.partnerFamilienname,
            partnerVorname: data.partnerVorname,
            partnerGeburtsdatum: data.partnerGeburtsdatum,
            strasse: data.strasse,
            hausnummer: data.hausnummer,
            stadt: data.stadt,
            bundesland: data.bundesland,
            postleitzahl: data.postleitzahl,
            familienstand: data.familienstand,
          });

          const dynamicFormsArray = this.form.get('dynamicForms') as FormArray;
          if (data.dynamicForms) {
            data.dynamicForms.forEach((dynamicForm: DynamicForm) => {
              const formGroup = this.fb.group({
                vertragsnummer: [dynamicForm.vertragsnummer],
                abschlussdatum: [dynamicForm.abschlussdatum],
                bausparsumme: [dynamicForm.bausparsumme],
                bausparbeitrag: [dynamicForm.bausparbeitrag],
                hoechstbetrag: [dynamicForm.hoechstbetrag],
                vermoegenswirksameLeistungen: [dynamicForm.vermoegenswirksameLeistungen],
              });
              dynamicFormsArray.push(formGroup);
            });
          }
        }
      } else {
        console.error('No document found with the specified UID');
      }
    } catch (error) {
      console.error('Error fetching document data:', error);
    }
  }


  onSubmit(): void {
    if (this.form.valid) {
      if (this.documentId) {
        // Prepare the main form data with the 'status' field
        const formData = { ...this.form.value, status: 'submitted' };
  
        // Update the existing document
        this.firestore.collection('wohnungsbaupraemie').doc(this.documentId).update(formData)
          .then(() => {
            console.log('Main form data updated in Firestore');
  
            const dynamicFormsPromises = this.dynamicForms.controls.map(
              (form, index) =>
                this.firestore
                  .collection('wohnungsbaupraemie')
                  .doc(this.documentId!)
                  .collection('dynamicForms')
                  .doc(index.toString())
                  .set(form.value) // Use .set() to update dynamic forms
                  .then(() => {
                    console.log(`Dynamic form ${index + 1} updated successfully`);
                  })
                  .catch((error) => {
                    console.error(
                      `Error updating dynamic form ${index + 1}`,
                      error
                    );
                  })
            );
  
            return Promise.all(dynamicFormsPromises);
          })
          .then(() => {
            console.log('All data updated in Firestore');
            this.router.navigate(['/form-sent-notification']);
          })
          .catch((error) => {
            console.error('Error updating main form data in Firestore', error);
          });
      } else {
        alert('No document ID found.');
      }
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
  }
