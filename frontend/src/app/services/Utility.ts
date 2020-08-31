export class ConnectorAttributes {
    yBot: number = 0;
    yTop: number = Number.MAX_VALUE;
    xLeft: number = 0;
    xRight: number = 0;

    constructor(){

    }

    setYTop(yTop: number) {
        if (yTop < this.yTop) {
            this.yTop = yTop
        }
    }

    setYBot(yBot: number) {
        if (yBot > this.yBot) {
            this.yBot = yBot
        }
    }

    setXRight(xRight: number) {
        this.xRight = xRight;
    }

    setYLeft(xLeft: number) {
        this.xLeft = xLeft;
    }

    getWidth() {
        return this.xRight - this.xLeft;
    }

    getHeight() {
        return this.yBot - this.yTop;
    }
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function insert(arr, index, newItem) { 
    return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
  ]
}