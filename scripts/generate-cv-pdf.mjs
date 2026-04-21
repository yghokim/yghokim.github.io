import puppeteer from 'puppeteer';
import handler from 'serve-handler';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const basePath = process.env.PAGES_BASE_PATH || '';
const outDir = './out';
const publicDir = './public';
const port = 3456;

// Ensure output directory exists
const cvDir = path.join(outDir, 'files', 'cv');
const publicCvDir = path.join(publicDir, 'files', 'cv');
fs.mkdirSync(cvDir, { recursive: true });
fs.mkdirSync(publicCvDir, { recursive: true });

// Start a local static server
const server = http.createServer((req, res) => {
    return handler(req, res, { public: outDir });
});

await new Promise((resolve) => server.listen(port, resolve));
console.log(`Static server running at http://localhost:${port}`);

// Launch Puppeteer
const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
const cvUrl = `http://localhost:${port}${basePath}/cv`;
console.log(`Navigating to ${cvUrl}`);

await page.goto(cvUrl, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for fonts to load
await page.evaluate(() => document.fonts.ready);

// Hide site chrome (header, footer, nav) and web-only elements for PDF
await page.evaluate(() => {
    // Flip to PDF mode: reveals .pdf-only content and hides .web-only content
    document.body.classList.add('pdf-mode');
    // Hide the fixed header (site navigation)
    document.querySelectorAll('header').forEach(el => el.style.display = 'none');
    // Hide the site footer
    document.querySelectorAll('footer').forEach(el => el.style.display = 'none');
    // Remove top padding that accounts for the fixed header
    const container = document.querySelector('.pt-32, [class*="pt-28"]');
    if (container) {
        container.style.paddingTop = '0';
    }
    // More robust: find the content wrapper and remove all top padding
    document.querySelectorAll('[class]').forEach(el => {
        const classes = el.className;
        if (typeof classes === 'string' && (classes.includes('pt-32') || classes.includes('pt-28'))) {
            el.style.paddingTop = '0';
        }
    });
    // Hide elements with cv-no-print class
    document.querySelectorAll('.cv-no-print').forEach(el => el.style.display = 'none');
});

// Generate current date string for footer
const now = new Date();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

const pdfPath = path.join(cvDir, 'younghokim_cv.pdf');
console.log(`Generating PDF at ${pdfPath}`);

await page.pdf({
    path: pdfPath,
    format: 'Letter',
    margin: {
        top: '0.8in',
        bottom: '0.8in',
        left: '0.7in',
        right: '0.7in',
    },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
        <div style="font-size: 8.5pt; font-family: 'Source Sans 3', 'Source Sans Pro', sans-serif; width: 100%; display: flex; justify-content: space-between; padding: 0 0.7in; color: #666;">
            <span>${dateStr}</span>
            <span>Curriculum Vitae · <b>Young-Ho Kim</b></span>
            <span><span class="pageNumber"></span></span>
        </div>
    `,
    printBackground: true,
});

// Also copy into public/ so dev-mode (`next dev`) serves the latest PDF
// without needing a full production build.
const publicPdfPath = path.join(publicCvDir, 'younghokim_cv.pdf');
fs.copyFileSync(pdfPath, publicPdfPath);
console.log(`PDF generated successfully. Copied to ${publicPdfPath}`);

await browser.close();
server.close();
