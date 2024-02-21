import shuffle from "npm:lodash.shuffle@4";

export type Card = {
  id: number;
  value: string;
  rank: number;
  suit: Suit;
};

export type Suit = {
  value: string;
  color: string;
  utf: string;
};

export type SuitColor = "black" | "red";
export type SuitUtf = "\u2660" | "\u2665" | "\u2666" | "\u2663";

export type CardText = {
  [key: string]: string;
};

export type SuitText = CardText;

export class Deck {
  static get CARDS(): string[] {
    return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  }

  static get CARDS_TEXT(): CardText {
    return {
      2: "Two",
      3: "Three",
      4: "Four",
      5: "Five",
      6: "Six",
      7: "Seven",
      8: "Eight",
      9: "Nine",
      10: "Ten",
      J: "Jack",
      Q: "Queen",
      K: "King",
      A: "Ace",
    };
  }

  static get SUITS(): Suit[] {
    return [
      {
        value: "S",
        color: "black",
        utf: "\u2660",
      },
      {
        value: "H",
        color: "red",
        utf: "\u2665",
      },
      {
        value: "D",
        color: "red",
        utf: "\u2666",
      },
      {
        value: "C",
        color: "black",
        utf: "\u2663",
      },
    ];
  }

  static get SUITS_COLOR(): SuitColor[] {
    return ["black", "red", "red", "black"];
  }

  static get SUITS_UTF(): SuitUtf[] {
    return ["\u2660", "\u2665", "\u2666", "\u2663"];
  }

  static get SUITS_TEXT(): SuitText {
    return {
      S: "Spades",
      H: "Hearts",
      D: "Diamonds",
      C: "Clubs",
    };
  }

  static get BLANK_CARD_UTF(): string {
    return "\u2605";
  }

  private deck: Card[] = [];
  private id = 0;

  /**
   * Generate a new deck
   */
  constructor(preShuffle = true) {
    // Fill the deck
    for (let j = 0; j < Deck.SUITS.length; j++) {
      for (let i = 0; i < Deck.CARDS.length; i++) {
        this.deck.push({
          id: this.id++,
          value: Deck.CARDS[i],
          rank: i + 1,
          suit: { ...Deck.SUITS[j] },
        });
      }
    }

    // Shuffle by default
    if (preShuffle) {
      this.deck = shuffle(this.deck);
    }
  }

  /**
   * Sort the cards
   *
   * @param {Card[]} cards
   *
   * @returns {Card[]}
   */
  sort(cards: Card[]): Card[] {
    return cards.sort((a, b) => b.rank - a.rank);
  }

  /**
   * Get a set amount of cards from the deck and remove them from the deck
   *
   * @param {number} amount
   *
   * @returns {Card[]}
   */
  getCards(amount: number): Card[] {
    if (amount >= 1 && amount < this.deck.length - amount) {
      const removedCards: Card[] = [];

      for (let i = 0; i < amount; i++) {
        const card = this.deck.shift() as Card;
        removedCards.push(card);
      }

      return removedCards;
    } else {
      return [];
    }
  }

  /**
   * Stringify an array of card objects in the format: {id}_{card}{suit}
   * Eg. ['23#AS', '4#3D', ...]
   *
   * @param {Card[]} cards
   *
   * @returns {string[]}
   */
  static stringify(cards: Card[]): string[] {
    return cards.map((card) => `${card.id}#${card.value}${card.suit.value}`);
  }

  /**
   * Parse an array of serialized cards
   *
   * @param {string[]} cards
   *
   * @returns {Card[]}
   */
  static parse(cards: string[]): Card[] {
    return cards.map((c) => {
      // Get the card and id by spliting string
      // Assuming the string format: '{id}#{card}{suit}'
      const [id, card] = c.split("#");
      const value = card.length === 3 ? "10" : card[0]; // with 10 we get string of length 3
      const rank = Deck.CARDS.indexOf(value) + 1;
      const suitValue = card.length === 3 ? card[2] : card[1];
      const suit = Deck.SUITS.find((suit) => suit.value === suitValue);

      return {
        id: parseInt(id),
        value,
        rank,
        suit,
      } as Card;
    });
  }

  /**
   * Checks if the current object is a valid card type
   *
   * @param {Card} playingCard
   *
   * @returns {boolean}
   */
  static validate(playingCard: Card): boolean {
    const cardProps = Object.keys(playingCard);

    if (
      cardProps.includes("id") &&
      cardProps.includes("value") &&
      cardProps.includes("rank") &&
      cardProps.includes("suit")
    ) {
      return true;
    }

    return false;
  }

  /**
   * Return the word equivalent of the card value, if valid.
   * Else return empty string
   *
   * @param {Card} playingCard
   *
   * @returns {string}
   */
  static getCardText(playingCard: Card): string {
    if (!Deck.validate(playingCard)) {
      return "";
    }

    return this.CARDS_TEXT[playingCard.value];
  }

  /**
   * Return the word equivalent of the card suit, if valid.
   * Else return empty string
   */
  static getSuitText(playingCard: Card): string {
    if (!Deck.validate(playingCard)) {
      return "";
    }

    return this.SUITS_TEXT[playingCard.suit.value];
  }

  /**
   * Return the description of the card, if valid.
   * Else return empty string
   *
   * @param {Card} playingCard
   *
   * @returns {string}
   */
  static getCardDescription(playingCard: Card): string {
    if (!Deck.validate(playingCard)) {
      return "";
    }

    const cardText = Deck.getCardText(playingCard);
    const suitText = Deck.getSuitText(playingCard);

    return `${cardText} of ${suitText}`;
  }
}
