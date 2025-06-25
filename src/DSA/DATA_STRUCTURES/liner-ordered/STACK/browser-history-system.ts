/**
 * 
 * Problem: Build a browser history navigation system where users can go back and forward between previously visited pages.
 * Solution:
 * Use a stack to keep track of the visited pages.
 * The back operation will pop the current page off the stack, and the forward operation will push the page back.

*/

class BrowserHistory {
  private historyStack: string[] = [];
  private forwardStack: string[] = [];

  visit(url: string): void {
    this.historyStack.push(url);
    this.forwardStack = []; // Clear forward stack after new visit
  }

  back(steps: number): string {
    while (steps > 0 && this.historyStack.length > 1) {
      this.forwardStack.push(this.historyStack.pop()!);
      steps--;
    }
    return this.historyStack[this.historyStack.length - 1];
  }

  forward(steps: number): string {
    while (steps > 0 && this.forwardStack.length > 0) {
      this.historyStack.push(this.forwardStack.pop()!);
      steps--;
    }
    return this.historyStack[this.historyStack.length - 1];
  }
}

const browser = new BrowserHistory();
browser.visit("google.com");
browser.visit("stackoverflow.com");
console.log(browser.back(1)); // "google.com"
browser.visit("github.com");
console.log(browser.forward(1)); // "stackoverflow.com"


// Explanation:

// historyStack stores the pages visited.

// forwardStack is used for forward navigation.