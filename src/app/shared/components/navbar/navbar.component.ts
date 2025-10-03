import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NavLink, UserInfo, ActionIcon } from '../../models/component-config.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() logoUrl = 'assets/images/logo-white.svg';
  @Input() logoAlt = 'Logo';
  @Input() navLinks: NavLink[] = [];
  @Input() actionIcons: ActionIcon[] = [];
  @Input() userInfo: UserInfo = { name: 'Administrador', avatarUrl: 'assets/images/profile-image.png' };
  @Input() rightLogoUrl = 'assets/images/logo-mandu.svg';
  @Input() rightLogoAlt = 'Logo secundario';
}

