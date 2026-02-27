import { sendReminderEmail } from '@/lib/services/email-service';

const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

describe('email-service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: 'test-key', NEXT_PUBLIC_APP_URL: 'https://test.autogoverno.app' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('sendReminderEmail', () => {
    it('should send a reminder email with correct parameters', async () => {
      mockSend.mockResolvedValue({ id: 'email-1' });

      await sendReminderEmail('maria@example.com', 'Maria');

      expect(mockSend).toHaveBeenCalledTimes(1);
      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.from).toBe('Diário de Autogoverno <noreply@autogoverno.app>');
      expect(callArgs.to).toBe('maria@example.com');
      expect(callArgs.subject).toBe('Como foi seu dia na advocacia?');
      expect(callArgs.html).toContain('Maria');
      expect(callArgs.html).toContain('https://test.autogoverno.app/entry/new');
    });

    it('should use default app URL when env var is not set', async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      mockSend.mockResolvedValue({ id: 'email-2' });

      await sendReminderEmail('joao@example.com', 'Joao');

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain('https://autogoverno.app/entry/new');
    });

    it('should propagate error when Resend API fails', async () => {
      mockSend.mockRejectedValue(new Error('API rate limit exceeded'));

      await expect(sendReminderEmail('test@example.com', 'Test')).rejects.toThrow('API rate limit exceeded');
    });

    it('should include the recipient name in the email body', async () => {
      mockSend.mockResolvedValue({ id: 'email-3' });

      await sendReminderEmail('carlos@example.com', 'Carlos');

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain('Carlos, como foi seu dia?');
    });

    it('should include branding text in the email', async () => {
      mockSend.mockResolvedValue({ id: 'email-4' });

      await sendReminderEmail('ana@example.com', 'Ana');

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.html).toContain('Diário de Autogoverno');
      expect(callArgs.html).toContain('Código A.D.V.');
      expect(callArgs.html).toContain('Registrar o dia');
    });
  });
});
