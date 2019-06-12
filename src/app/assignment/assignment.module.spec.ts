import { AssignmentModule } from './assignment.module';

describe('AssignmentModule', () => {
  let assignmentModule: AssignmentModule;

  beforeEach(() => {
    assignmentModule = new AssignmentModule();
  });

  it('should create an instance', () => {
    expect(assignmentModule).toBeTruthy();
  });
});
