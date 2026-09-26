import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

function adminAccount(): { email: string; password: string } | null {
  const raw = readFileSync(new URL('../../backend/.env', import.meta.url), 'utf8')
  const email = raw.match(/^GESBUDEP_ADMIN_EMAIL=(.*)$/m)?.[1]?.trim()
  const password = raw.match(/^GESBUDEP_ADMIN_PASSWORD=(.*)$/m)?.[1]?.trim()
  if (!email || !password) {
    return null
  }

  return { email, password }
}

async function expectNoInventedBudget(page: Page) {
  const text = await page.locator('main').innerText()
  expect(text).not.toContain('40305795803')
  expect(text).not.toMatch(/40\s*305\s*795\s*803/)
}

test('les refus de connexion restent sur l’accueil', async ({ page }) => {
  await page.goto('/app/executif')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Aller au formulaire de connexion' })).toBeFocused()
  await expect(page.getByRole('heading', { name: 'Connexion à votre espace' })).toBeVisible()
  await expect(page.getByText('Aucun compte de démonstration n’est proposé ici.')).toBeVisible()

  await page.getByLabel('Adresse email institutionnelle').fill('pas-un-email')
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill('secret')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByText('Adresse email invalide.')).toBeVisible()

  await page.getByLabel('Adresse email institutionnelle').fill('inconnu@ceeac.local')
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill('mauvais-mot-de-passe')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByRole('alert')).toContainText('Identifiants invalides.')
  await expect(page).toHaveURL('/')
})

test('le parcours connecté n’affiche aucun montant inventé', async ({ page }) => {
  const account = adminAccount()
  test.skip(account === null, 'Identifiants locaux absents du fichier d’environnement.')

  await page.goto('/')
  await page.getByLabel('Adresse email institutionnelle').fill(account!.email)
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill(account!.password)
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByRole('heading', { name: /Bonjour/ })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused()
  await expectNoInventedBudget(page)
  await expect(page.getByText('Aucun crédit exécutoire')).toBeVisible()

  const routes = [
    ['/app/executif', 'Tableau de bord exécutif'],
    ['/app/expressions-besoin', 'Expressions de besoin'],
    ['/app/engagements', 'Engagements'],
    ['/app/liquidations', 'Liquidations'],
    ['/app/ordonnancements', 'Ordonnancements'],
    ['/app/paiements', 'Paiements'],
    ['/app/ged', 'GED et documents'],
  ] as const

  for (const [path, heading] of routes) {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible({ timeout: 15000 })
    await expectNoInventedBudget(page)
  }

  await page.getByRole('button', { name: 'Quitter' }).click()
  await expect(page.getByRole('heading', { name: 'Connexion à votre espace' })).toBeVisible()
  await page.goto('/app')
  await expect(page.getByRole('heading', { name: 'Connexion à votre espace' })).toBeVisible()
})
