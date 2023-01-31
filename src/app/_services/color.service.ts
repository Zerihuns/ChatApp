import { Injectable } from '@angular/core';

const color :string[] = ['#1ABC9C','#16A085','#2ECC71','#27AE60','#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E','#2C3E50','#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D']
const color_flat : string[] = ['#00b894','#81ecec','#0984e3','#6c5ce7','#d63031','#e17055','#2d3436']
@Injectable({
  providedIn: 'root'
})
export class ColorService {
  GetRandomColor():string {
    return color_flat[Math.floor(Math.random() * color_flat.length)]
  }
}
