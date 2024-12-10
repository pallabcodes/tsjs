# TEMPLATE FOR ANY PROGRAMMING PROBLEM

1. **Understanding the Question**  
   - Fully understand the problem and requirements.

2. **Take the Smallest Inputs and Derive the Edge Cases from It**  
   - Test the problem with the smallest inputs and derive edge cases.  
   - Identify potential edge cases, such as empty input, maximum values, or other special conditions.

3. **Plan the Approach (Pseudocode -> Brute Force -> Optimized Approach)**  
   - **Pseudocode**: Outline a high-level solution in plain text (if time permits), or plan it in your head if under time constraints.  
   - **Brute Force (BF)**: First, think about a brute force solution.  
   - **Optimized Approach**: Try to identify areas to optimize the brute force approach.

4. **Storage (Consider when/where to store data)**  
   - **Storage options**:  
     - Store in a different data structure (DS) when needed during iteration.
     - Store the input as it is or in a new DS.
     - Store part of the input in another DS when necessary.
     - Sort the input if required before processing.
     - Consider using temporary or auxiliary storage based on the problem’s needs.
   
   **Action**: Decide whether to perform the action directly or use storage before or after the action.
   
   **Action -> Storage** or **Storage -> Action**: Choose the right order depending on whether you need to perform actions and then store, or store first and perform actions later.

5. **Write the Actual Approach**  
   - Implement the approach you’ve planned, keeping it simple and efficient.

6. **Test Quickly (with all the possible inputs + edge cases)**  
   - Test with various inputs, especially edge cases that you identified earlier. Ensure that the solution works for both normal and corner cases.

---

### Additional Notes:

- **For Storage**: You've already covered the main strategies (e.g., storing input, partial input, sorted input). In most problems, you'll be using storage to make the process efficient (e.g., storing intermediate results). There aren’t many more storage techniques beyond these unless the problem involves specific constraints (e.g., limited memory).
  
- **For Action**: The "action" part can often involve either processing data, modifying it, or using it to generate the result. You may also need to choose whether to modify data in place or create new structures for intermediate results.
