// The delegate pattern is primarily a behavioral design pattern. Its main purpose is to define a communication or coordination mechanism between objects, focusing on their behavior rather than their structure.
//
//   Why It's Behavioral
// The delegate pattern:
//
//   Focuses on object interactions: It enables one object (the delegator) to rely on another (the delegate) to perform certain behaviors or respond to events.
//   Promotes loose coupling: Delegates allow behavior to be implemented by different objects without tightly coupling them, making the system more adaptable and reusable.
//   Encapsulates behavior: It allows the delegator to delegate responsibilities without knowing the exact details of how they are handled, focusing on "what" to do rather than "how" to do it.

// Example: Button Tap Delegate in TypeScript

// Step 1: Define the Delegate Interface
// The interface ButtonTapDelegate defines a method onButtonTap that the delegate will implement. This is similar to a protocol in Swift.
interface ButtonTapDelegate {
  onButtonTap(): void;
}
// Step 2: Create a Class with a Delegate Property
// The CustomView class has a delegate property of type ButtonTapDelegate | null. When buttonTapped() is called, it notifies the delegate by calling this.delegate?.onButtonTap().

class CustomView {
  delegate: ButtonTapDelegate | null = null;

  buttonTapped() {
    // Notify the delegate when the button is tapped
    this.delegate?.onButtonTap();
  }
}
// Step 3: Implement the Delegate in Another Class
// The ViewController class implements the ButtonTapDelegate interface and provides the functionality for onButtonTap().
class ViewController implements ButtonTapDelegate {
  onButtonTap(): void {
    console.log("Button was tapped!");
  }
}
// Step 4: Set the Delegate
// Finally, we create instances of CustomView and ViewController and set ViewController as the delegate of CustomView. When buttonTapped is called on CustomView, it triggers the onButtonTap() method in ViewController.
const customView = new CustomView();
const viewController = new ViewController();

customView.delegate = viewController;
customView.buttonTapped(); // This will log "Button was tapped!" to the console

// Explanation
// Interface (Delegate Protocol): Defines the onButtonTap() method that the delegate class must implement.
//   Delegate Property: delegate is an optional property on CustomView, allowing any class implementing ButtonTapDelegate to handle the event.
//   Event Notification: buttonTapped() calls this.delegate?.onButtonTap(), only if delegate is not null, ensuring that the delegate is notified when the button is tapped.
//   This implementation in TypeScript closely follows the delegation pattern, making it similar to the Swift example and demonstrating how delegation can be applied across different languages.

// Delegate in GoF Classification
// While not explicitly named "delegate" in the Gang of Four (GoF) design patterns, the delegate pattern is closely aligned with Observer, Strategy, and sometimes Command, all of which are behavioral patterns. It can be seen as a tailored approach to implementing these patterns for event-driven scenarios or inter-object communication.


// Q: I am assuming the real power of this pattern is that there could be different ViewController and as needed just assign to customView.deleagte and that class's buttonTapped will be caclled, which is much more flexible in a way in this context thatjust extending ? right ?

// the core advantage of the delegate pattern: flexibility and modularity.

/**
 * By using a delegate, CustomView doesn’t need to know the specifics of the class that handles the button tap. It only needs to know that the delegate conforms to the ButtonTapDelegate interface (or protocol in Swift). This approach is much more flexible than subclassing for several reasons:
 *
 * Encapsulation of Responsibilities: Delegation allows CustomView to offload specific behavior (like handling a button tap) to another class without knowing its exact details. This keeps CustomView focused on its main responsibilities and allows the delegate to handle the action.
 *
 * Dynamic Behavior: You can assign different objects as the delegate of CustomView at runtime. This makes it easy to customize or change behavior without modifying CustomView itself. For example, one ViewController might present an alert on button tap, while another might navigate to a different screen—all without changing CustomView.
 *
 * Reusable Components: The delegate pattern allows CustomView to be reused in various contexts, each with potentially different behavior. You could have multiple view controllers implementing ButtonTapDelegate, each one responding differently to buttonTapped() based on its needs.
 *
 * Avoiding Inheritance Complexity: If you used inheritance (subclassing) to extend CustomView, you would have a tight coupling between CustomView and its subclasses. This can lead to complex, rigid hierarchies and makes testing or updating individual components more challenging. With delegation, you avoid this and keep classes relatively independent.
 *
 * */

// Example of Flexibility
// Suppose you have two different view controllers, AlertViewController and NavigationViewController, both of which conform to ButtonTapDelegate. You can assign either one to CustomView's delegate property to achieve different outcomes.

class AlertViewController implements ButtonTapDelegate {
  onButtonTap(): void {
    console.log("Alert: Button was tapped!");
  }
}

class NavigationViewController implements ButtonTapDelegate {
  onButtonTap(): void {
    console.log("Navigate to a new screen!");
  }
}

// Now, you can assign too as the delegate:
const customView = new CustomView();
const alertVC = new AlertViewController();
const navigationVC = new NavigationViewController();

customView.delegate = alertVC;
customView.buttonTapped(); // Logs: "Alert: Button was tapped!"

customView.delegate = navigationVC;
customView.buttonTapped(); // Logs: "Navigate to a new screen!"
