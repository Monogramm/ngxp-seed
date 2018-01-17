import { TestBed, ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SharedModule } from '../shared';
import { HomeComponent } from './home.component';
import { click } from '../../testing';

let fixture: ComponentFixture<HomeComponent>;
let comp: HomeComponent;

describe('HomeComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
            declarations: [
                HomeComponent
            ]
        });

        fixture = TestBed.createComponent(HomeComponent);
        comp = fixture.componentInstance;
    });
/*
    it('should create HomeComponent', () => {
        expect(comp).toBeTruthy();
    });

    it('should render title as "Welcome" in element with .title class', () => {
        let titleEle: HTMLElement = fixture.debugElement.query(By.css('.title')).nativeElement;
        expect(titleEle.textContent).toBe('Welcome');
    });

    it('should display log off button with .btn-primary class', () => {
        let logOffEle: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
        fixture.detectChanges();
        expect(logOffEle.textContent).toBe('Log off');
    });
*/
});
