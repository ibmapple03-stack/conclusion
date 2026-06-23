import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'temporary_screenshots');
fs.mkdirSync(outDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];
const width = Number(process.argv[4]) || 1440;
const height = Number(process.argv[5]) || 900;

function nextIndex() {
  const files = fs.readdirSync(outDir).filter(f => /^screenshot-(\d+)/.test(f));
  const nums = files.map(f => Number(f.match(/^screenshot-(\d+)/)[1]));
  return nums.length ? Math.max(...nums) + 1 : 1;
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: 'networkidle0' });

const n = nextIndex();
const fileName = `screenshot-${n}${label ? '-' + label : ''}.png`;
const filePath = path.join(outDir, fileName);
await page.screenshot({ path: filePath, fullPage: true });

await browser.close();
console.log(`Saved ${filePath}`);
