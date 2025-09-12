import { validateEmail, validatePassword, formatDate, truncateText } from '../utils';

describe('Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates password with minimum length', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
    });

    it('rejects password shorter than minimum', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('formats recent dates correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      
      expect(formatDate(oneMinuteAgo.toISOString())).toBe('1 min atrás');
    });

    it('formats older dates correctly', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date.toISOString())).toContain('dias atrás');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('returns original text if shorter than limit', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });
  });
});
