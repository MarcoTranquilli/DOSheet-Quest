import { test, expect, devices } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4173/DOSheet-Quest/';

test.describe('DOSheet Quest UAT', () => {
  test('desktop primary learning flow works end-to-end', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 1, name: 'DOSheet Quest' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pulizia anagrafica clienti' })).toBeVisible();
    await expect(page.getByText('Fai questo adesso')).toBeVisible();
    await expect(page.getByText('Passo attivo')).toBeVisible();
    await expect(page.getByText('Checklist missione')).toBeVisible();

    await page.getByLabel('Modifica B2').fill('Marco Rossi');
    await page.getByLabel('Modifica D2').fill('OK');
    await page.getByLabel('Modifica B3').fill('Giulia Bianchi');
    await page.getByLabel('Modifica D3').fill('OK');
    await page.getByLabel('Modifica B4').fill('Luca Verdi');
    await page.getByLabel('Modifica D4').fill('OK');

    await expect(page.getByText('Missione risolta')).toBeVisible();
    await expect(page.getByText(/Score finale:/)).toBeVisible();
    await expect(page.getByText('Recap di mastery')).toBeVisible();

    await page.getByRole('tab', { name: 'Progresso' }).click();
    await expect(page.getByRole('heading', { name: 'Progressi del gruppo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mastery e certificazioni' })).toBeVisible();

    await page.screenshot({ path: 'output/playwright/uat-desktop.png', fullPage: true });
  });

  test('mobile view preserves core navigation and lab access', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
    });
    const page = await context.newPage();

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 1, name: 'DOSheet Quest' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Inizia' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Progresso' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Strumenti' })).toBeVisible();
    await expect(page.getByText('Come iniziare')).toBeVisible();

    await page.getByRole('tab', { name: 'Strumenti' }).click();
    await expect(page.getByRole('heading', { name: 'Gestione prodotto' })).toBeVisible();

    await page.getByRole('tab', { name: 'Inizia' }).click();
    await expect(page.getByText('Prossima missione consigliata')).toBeVisible();
    await expect(page.getByText('Checklist missione')).toBeVisible();

    await page.screenshot({ path: 'output/playwright/uat-mobile.png', fullPage: true });
    await context.close();
  });
});
