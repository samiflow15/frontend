import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  prediction!:string;
  suggestion!:string;
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.prediction="";
      this.suggestion="";
      const formData = {
        age: form.value.age,
        gender: form.value.gender=='Masculino'? 1:0,
        impulse: form.value.impulse,
        pressure_high: form.value.pressure_high,
        pressure_low: form.value.pressure_low,
        glucose: form.value.glucose,
        kcm: form.value.kcm,
        troponin: form.value.troponin,
      };

      this.http.post<{ prediction: string }>('https://be-hearth-attack-7ztx7qqjwq-uc.a.run.app/predict', formData)
        .subscribe(response => {
          this.prediction = response.prediction=="negative"?"No presenta riezgo de ataque al corazón": "Presenta riezgo de ataque al corazón" ;
          this.suggestion=""
          this.handleResponse({...formData, prediction:response.prediction});
        }, error => {
          console.error('Error:', error);
        });
    } else {
      console.log('Form is invalid');
    }
  }

  handleResponse(response: any) {
    this.http.post<{ suggestion: string }>('https://be-hearth-attack-7ztx7qqjwq-uc.a.run.app/suggest', response)
        .subscribe(response => {
          this.suggestion = response.suggestion;
        }, error => {
          console.error('Error:', error);
        });
  }
}