import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NavLink, UserInfo, ActionIcon } from '../../models/component-config.interface';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.logoUrl).toBe('assets/images/logo-white.svg');
    expect(component.logoAlt).toBe('Logo');
    expect(component.userInfo.name).toBe('Administrador');
    expect(component.rightLogoUrl).toBe('assets/images/logo-mandu.svg');
  });

  it('should render nav links from input', () => {
    const links: NavLink[] = [
      { label: 'Dashboard', href: '/dashboard', active: false },
      { label: 'Organización', href: '/organization', active: true }
    ];
    component.navLinks = links;
    fixture.detectChanges();

    const linkElements = fixture.nativeElement.querySelectorAll('.nav-link');
    expect(linkElements.length).toBe(2);
    expect(linkElements[0].textContent.trim()).toContain('Dashboard');
    expect(linkElements[1].textContent.trim()).toContain('Organización');
    expect(linkElements[1].classList.contains('active')).toBe(true);
  });

  it('should render action icons from input', () => {
    const icons: ActionIcon[] = [
      { icon: 'mail', ariaLabel: 'Messages' },
      { icon: 'bell', ariaLabel: 'Notifications', badge: 3 }
    ];
    component.actionIcons = icons;
    fixture.detectChanges();

    const iconButtons = fixture.nativeElement.querySelectorAll('.icon-button');
    expect(iconButtons.length).toBe(2);
  });

  it('should render user info from input', () => {
    component.userInfo = { name: 'John Doe', avatarUrl: 'test-avatar.png' };
    fixture.detectChanges();

    const userNameElement = fixture.nativeElement.querySelector('.user-name');
    expect(userNameElement.textContent.trim()).toBe('John Doe');
  });

  it('should render logo from input', () => {
    component.logoUrl = 'custom-logo.svg';
    component.logoAlt = 'Custom Logo';
    fixture.detectChanges();

    const logoElement = fixture.nativeElement.querySelector('.logo img');
    expect(logoElement.src).toContain('custom-logo.svg');
    expect(logoElement.alt).toBe('Custom Logo');
  });

  it('should render dropdown icon for links with hasDropdown', () => {
    const links: NavLink[] = [
      { label: 'Modelos', href: '#', hasDropdown: true }
    ];
    component.navLinks = links;
    fixture.detectChanges();

    const linkElement = fixture.nativeElement.querySelector('.nav-link');
    const dropdownIcon = linkElement.querySelector('.nav-dropdown-icon');
    expect(dropdownIcon).toBeTruthy();
  });
});
