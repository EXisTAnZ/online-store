import { DOMElement } from '../../../../shared/components/DOMElement';

export class TotalPrice {
  private text: DOMElement;
  private totalPrice: DOMElement;
  private price: DOMElement;

  constructor(parentNode: HTMLElement) {
    this.totalPrice = new DOMElement(parentNode, { tagName: 'div', classList: ['total-price'] });
    this.text = new DOMElement(this.totalPrice.node, {
      tagName: 'span',
      classList: ['total-price__text'],
      content: 'Total price:',
    });
    this.price = new DOMElement(this.totalPrice.node, {
      tagName: 'span',
      classList: ['total-price__price'],
      content: '$9999',
    });
  }

  public updatePrice(newPrice: number) {
    this.price.node.textContent = `$${newPrice}`;
  }
}
