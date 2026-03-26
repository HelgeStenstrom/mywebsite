import {Injectable} from '@angular/core';
import {ScoresConfig} from "../models/score.model";

@Injectable({
  providedIn: 'root',
})
export class ScoresConfigService {

  loadConfig(tastingId: number): ScoresConfig | null {
    const item = localStorage.getItem(this.key(tastingId));
    return item ? JSON.parse(item) : null;
  }

  saveConfig(tastingId: number, config: ScoresConfig) {
    localStorage.setItem(this.key(tastingId), JSON.stringify(config));
  }

  private key(tastingId: number) {
    return `scores-config-${tastingId}`;
  }
}
