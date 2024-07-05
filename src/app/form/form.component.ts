import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  note2 = "Prämienberechtigt für 2022 sind alle unbeschränkt einkommensteuerpflichtigen Personen, die vor dem 2. 1.2007 geboren oder Vollwaisen sind. Unbeschränkt einkommensteuerpflichtig sind natürliche Personen, die in der Bundesrepublik Deutschland ansässig sind (Wohnsitz oder gewöhnlicher Aufenthalt), oder die im Ausland ansässig sind und zu einer inländischen juristischen Person des öffentlichen Rechts in einem Dienstverhältnis stehen und dafür Arbeitslohn aus einer inländischen öffentlichen Kasse beziehen. Prämienberechtigt sind auch Personen ohne Wohnsitz oder gewöhnlichen Aufenthalt im Inland, wenn sie auf Antrag nach § 1 Absatz 3 des Einkommensteuergesetzes (EStG) als unbeschränkt einkommensteuerpflichtig behandelt werden. Alleinstehende sind alle Personen, die 2022 nicht verheiratet / verpartnert waren, und Ehegatten / Lebenspartner nach dem LPartG, die keine Höchstbetragsgemeinschaft bilden. Ehegatten / Lebenspartnern nach dem LPartG steht ein gemeinsamer Höchstbetrag zu (Höchstbetragsgemeinschaft), wenn sie beide mindestens während eines Teils des Kalenderjahres 2022 miteinander verheiratet / verpartnert waren, nicht dauernd getrennt gelebt haben, unbeschränkt einkommensteuerpflichtig i. S. d. § 1 Absatz 1 oder 2 oder des § 1a EStG waren und sie nicht die Einzelveranlagung zur Einkommensteuer wählen. Sie gelten in den Fällen des § 1 Absatz 1 oder 2 EStG als zusammenveranlagte Ehegatten / Lebenspartner nach dem LPartG, auch wenn keine Veranlagung durchgeführt worden ist. Ehegatten / Lebenpartner nach dem LPartG, die keine Höchstbetragsgemeinschaft bilden, gelten als Alleinstehende.";
  note3 = "Bausparbeiträge, die vermögenswirksame Leistungen sind, werden vorrangig durch Gewährung einer Arbeitnehmer-Sparzulage gefördert. Eine Einbeziehung vermögenswirksamer Leistungen in die prämienbegünstigten Aufwendungen kommt deshalb nur in Betracht, wenn Sie keinen Anspruch auf Arbeitnehmer-Sparzulage haben. Ein Anspruch auf Arbeitnehmer-Sparzulage besteht, wenn das maßgebende zu versteuernde Einkommen unter Berücksichtigung der Freibeträge für Kinder nicht mehr als 17.900 Euro bei Alleinstehenden bzw. 35.800 Euro bei zusammenveranlagten Ehegatten / Lebenspartnern nach dem LPartG beträgt. Sind diese Einkommensgrenzen überschritten, können Sie im Rahmen der prämienbegünstigten Höchstbeträge (700 / 1.400 Euro) für diese vermögenswirksamen Leistungen Wohnungsbauprämie beanspruchen.";


  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }


}
