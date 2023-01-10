import './cart-page.scss';
import { DOMElement } from '../../../shared/components/base-elements/dom-element';
import { Page } from '../../../shared/components/page';
import { CartItems } from '../../components/cart-page/items/items';
import { Summary } from '../../components/cart-page/summary/summary';
import { State } from '../../../shared/services/state.service';
import CartService from '../../services/cart-page/cart.service';

export class CartPage extends Page {
  private itemsContainer: DOMElement;
  private summaryContainer: DOMElement;

  private summary: Summary;

  constructor(id: string) {
    super(id);

    this.itemsContainer = new DOMElement(this.node, {
      tagName: 'div',
      classList: ['cart-page__items'],
    });

    this.summaryContainer = new DOMElement(this.node, {
      tagName: 'div',
      classList: ['cart-page__summary'],
    });
    CartService.cartItems = new CartItems(this.itemsContainer.node, State.cart);
    this.summary = new Summary(this.summaryContainer.node);
    this.node.addEventListener('click', () => this.render());
  }

  public render() {
    CartService.cartItems.render();
    this.summary.render();
  }
}
