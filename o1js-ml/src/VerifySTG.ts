import { Field, SmartContract, state, State, method } from 'o1js';

export class VerifySTG extends SmartContract {
  // Define a state variable for the predefined hash. This will be set after deployment.
  @state(Field) predefinedHash = State<Field>();

  init() {
    super.init();
  }

  // A method to update the predefined hash, essentially replacing parameterized initialization.
  @method setPredefinedHash(newHash: Field) {
    this.predefinedHash.set(newHash);
  }

  // A method to check the provided state transitions against the predefined hash.
  @method checkTransitions(transitions: Field[]) {
    transitions.forEach(transition => {
      this.predefinedHash.get().assertEquals(transition);
    });
  }
}

