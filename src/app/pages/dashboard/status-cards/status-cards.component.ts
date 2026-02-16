import { Component } from '@angular/core';

interface StatusCard {
  title: string;
  value: number;
  unit: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  alertCount?: number;
  alertLevel?: 'info' | 'warning' | 'critical';
  icon: string;
}

@Component({
  selector: 'ngx-status-cards',
  templateUrl: './status-cards.component.html',
  styleUrls: ['./status-cards.component.scss'],
})
export class StatusCardsComponent {

  cards: StatusCard[] = [
    {
      title: 'Active Users',
      value: 2847,
      unit: 'users',
      progress: 78,
      trend: 'up',
      alertCount: 3,
      alertLevel: 'warning',
      icon: 'people-outline',
    },
    {
      title: 'Server Load',
      value: 64,
      unit: '%',
      progress: 64,
      trend: 'stable',
      alertCount: 1,
      alertLevel: 'critical',
      icon: 'hard-drive-outline',
    },
    {
      title: 'Response Time',
      value: 142,
      unit: 'ms',
      progress: 85,
      trend: 'down',
      icon: 'activity-outline',
    },
    {
      title: 'Uptime',
      value: 99.9,
      unit: '%',
      progress: 99,
      trend: 'up',
      alertCount: 2,
      alertLevel: 'info',
      icon: 'checkmark-circle-outline',
    },
    {
      title: 'API Requests',
      value: 15420,
      unit: '/min',
      progress: 52,
      trend: 'up',
      icon: 'swap-outline',
    },
    {
      title: 'Error Rate',
      value: 0.12,
      unit: '%',
      progress: 12,
      trend: 'down',
      alertCount: 5,
      alertLevel: 'critical',
      icon: 'alert-triangle-outline',
    },
  ];

  onViewDetails(card: StatusCard): void {
    console.log('View details for:', card.title);
  }

  onQuickAction(card: StatusCard): void {
    console.log('Quick action for:', card.title);
  }
}
