import { test, expect } from '@playwright/test';

test('emits player error event on segment timeout', async ({ page }) => {
  const cspUrl = `${process.env.CSP_URL}/api/v2/manifests/hls/proxy-master.m3u8`;

  const testVod = 'https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8';
  const corruptionUrl = `${cspUrl}?url=${testVod}&timeout=[{i:1}]`;
  await page.goto('index.html');
  await page.locator('#manifest-input').fill(corruptionUrl);
  await page.locator('#load-button').click();
  await page.locator('video').waitFor();

  const msg = await page.waitForEvent('console');
  const error = JSON.parse(msg.text());
  expect(error.category).toEqual('networkError');
});
