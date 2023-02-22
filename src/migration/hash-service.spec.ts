
import { sha256HashContent } from './hash-service';

describe ( 'HashService' , () => {
  it('should hash content', () => {
    const content = 'Hello World';
    const hash = sha256HashContent(content);
    expect(hash.length).toEqual(64);
  });
});


