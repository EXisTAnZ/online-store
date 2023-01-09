import CartService from '../../main/services/cart-page/cart.service';
import { ViewService } from '../../main/services/store-page/change-view.service';
import { DOMElement } from '../../shared/components/base-elements/dom-element';
import { ProductsData } from '../../shared/models/response-data';
import { State } from '../../shared/services/state.service';
import { ModalPage } from '../components/modal/modal';
import { ModalService } from './modal.service';

type ValidationState = Record<string, boolean>;

export abstract class Validation {
  static state = {
    name: false,
    phone: false,
    address: false,
    email: false,
    cardNumber: false,
    mounth: false,
    cvv: false,
  };

  public static isEmptyCart(state: ProductsData[]) {
    return state.length === 0;
  }

  public static getState() {
    return Validation.state;
  }

  protected static clearState() {
    this.state = {
      name: false,
      phone: false,
      address: false,
      email: false,
      cardNumber: false,
      mounth: false,
      cvv: false,
    };
  }

  static checkAllValidity(state: ValidationState, element: HTMLElement) {
    const result = Object.entries(state).filter((item) => item[1] === false);
    ModalService.removeSumbitMessage();
    if (result.length) {
      this.createValidationMessage(element, '✖ Error in validation');
    } else {
      this.createValidationMessage(element, 'Done! Redirect in 3 sec');
      setTimeout(() => {
        window.location.hash = '#store';
        CartService.clearCart();
        const state = State.getCurrent();
        ViewService.view.render(state);
        ModalService.clearModal();
        ModalService.removeMessage();
        this.clearState();
        ModalService.removeModal();
      }, 3000);
    }
  }

  private static createValidationMessage(element: HTMLElement, message: string) {
    const error = new DOMElement(element, {
      tagName: 'p',
      classList: ['personal-info__error'],
      content: message,
    });
    element.append(error.node);
    document.querySelector('.modal__close')?.addEventListener('click', () => this.removeErrorMessage(error));
    element.addEventListener('input', () => this.removeErrorMessage(error));
  }

  private static removeErrorMessage(error: DOMElement) {
    error.node.innerText = '';
    error.node.remove();
  }

  static addListeners(modal: ModalPage) {
    modal.personalInfo.nameInput.node.addEventListener('change', (e: Event) => {
      Validation.validateName(e, modal.personalInfo.nameContainer.node);
    });
    modal.personalInfo.phoneInput.node.addEventListener('change', (e: Event) =>
      Validation.validateNumber(e, modal.personalInfo.phoneContainer.node)
    );
    modal.personalInfo.addressInput.node.addEventListener('change', (e: Event) =>
      Validation.validateAdress(e, modal.personalInfo.addressContainer.node)
    );
    modal.personalInfo.emailInput.node.addEventListener('change', (e: Event) =>
      Validation.validateEmail(e, modal.personalInfo.emailContainer.node)
    );
    modal.cardInfo.number.node.addEventListener('change', (e: Event) => {
      Validation.validateCardNumber(e, modal.cardInfo.cardContainer.node);
    });
    modal.cardInfo.number.node.addEventListener('input', (e: Event) => {
      Validation.formatCardNumber(e, modal.cardInfo.cardName.node);
    });
    modal.cardInfo.cardMounthYear.node.addEventListener('change', (e: Event) => {
      Validation.validateMounthYear(e, modal.cardInfo.cardContainer.node);
    });
    modal.cardInfo.cardMounthYear.node.addEventListener('input', (e: Event) => {
      Validation.formatMounthYear(e);
    });
    modal.cardInfo.cvv.node.addEventListener('change', (e: Event) => {
      Validation.validateCvv(e, modal.cardInfo.cardContainer.node);
    });
    modal.cardInfo.cvv.node.addEventListener('input', (e: Event) => {
      Validation.formatCvv(e);
    });
  }

  private static validateName(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value;

    const count: boolean = value.split(' ').length > 1;
    const words: boolean = /^[a-zA-Z]+$/.test(value.split(' ').join('').trim().toLowerCase());
    const length: boolean = value.split(' ').filter((item) => item.trim().length < 3).length === 0;

    const message = count && words && length ? '✓ Valid' : '✖ Invalid';
    this.state.name = count && words && length;
    this.createValidationMessage(element, message);
  }

  private static validateNumber(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value;

    const firstNumber: boolean = value.split('')[0] === '+';
    const numbers: boolean = /^\d+$/.test(value.slice(1));
    const length: boolean = value.slice(1).length > 8;

    const message = firstNumber && numbers && length ? '✓ Valid' : '✖ Invalid';
    this.state.phone = firstNumber && numbers && length;
    this.createValidationMessage(element, message);
  }

  private static validateAdress(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value;

    const count: boolean = value.split(' ').length > 2;
    const length: boolean = value.split(' ').filter((item) => item.trim().length < 5).length === 0;

    const message = count && length ? '✓ Valid' : '✖ Invalid';
    this.state.address = count && length;
    this.createValidationMessage(element, message);
  }

  private static validateEmail(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value;

    const arr1: string[] = value.split('@');
    const arr2: string[] = arr1.length > 1 ? arr1[1].split('.') : arr1;

    const message = [...arr1, ...arr2].length === 4 ? '✓ Valid' : '✖ Invalid';
    this.createValidationMessage(element, message);
    this.state.email = [...arr1, ...arr2].length === 4;
  }

  private static validateCardNumber(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value;

    const message = value.length === 16 ? '✓ Valid number' : '✖ Invalid number';
    this.createValidationMessage(element, message);
    this.state.cardNumber = value.length === 16;
  }

  private static formatCardNumber(e: Event, cardType: HTMLElement) {
    const value = (e.target as HTMLInputElement).value;

    switch (value.split('')[0]) {
      case '1':
        cardType.innerText = 'Card type: SUPER-VISA';
        break;
      case '2':
        cardType.innerText = 'Card type: PUPER-VISA';
        break;
      case '3':
        cardType.innerText = 'Card type: DUPER-VISA';
        break;
      case '4':
        cardType.innerText = 'Card type: VISA';
        break;
      case '5':
        cardType.innerText = 'Card type: MASTER-CARD';
        break;
      case '6':
        cardType.innerText = 'Card type: RS-CARD';
        break;
      default:
        cardType.innerText = 'Card type:';
        break;
    }
    if (value.length > 16) (e.target as HTMLInputElement).value = value.slice(0, 16);
  }

  private static validateMounthYear(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value.split('');

    const mounth = Number([value[0], value[1]].join('')) < 13;
    const length = value.length === 5;

    const message = mounth && length ? '✓ Valid thru' : '✖ Invalid thru';
    this.createValidationMessage(element, message);
    this.state.mounth = mounth && length;
  }

  private static formatMounthYear(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!/^\d+$/.test(value.slice(-1))) (e.target as HTMLInputElement).value = value.slice(0, -1);
    if (value.length > 5) (e.target as HTMLInputElement).value = value.slice(0, 5);
    if (value.length == 3) (e.target as HTMLInputElement).value = [value[0], value[1], '/', value[3]].join('');
  }

  private static validateCvv(e: Event, element: HTMLElement) {
    const value = (e.target as HTMLInputElement).value.split('');

    const length = value.length === 3;

    const message = length ? '✓ Valid cvv' : '✖ Invalid cvv';
    this.createValidationMessage(element, message);
    this.state.cvv = length;
  }

  private static formatCvv(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!/^\d+$/.test(value.slice(-1))) (e.target as HTMLInputElement).value = value.slice(0, -1);
    if (value.length > 3) (e.target as HTMLInputElement).value = value.slice(0, 3);
  }
}
