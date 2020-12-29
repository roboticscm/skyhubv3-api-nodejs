import {isDevMode} from '../lib/util';
// import {page} from '../index';

const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

export const renderTemplate = (templateName, data) => {
    const templatePath = isDevMode ? `public/templates/${templateName}.hbs` : path.join(__dirname, `public/templates/${templateName}.hbs`);
    const html = fs.readFileSync(templatePath, {encoding: 'utf-8'});
    const compiledTemplate = hbs.compile(html);
    const rendered = compiledTemplate(data);
    return rendered;
}


export const renderBufferTemplate = async (templateId, data) => {
    const { ReportTemplate } = require('../models/ReportTemplate');
    const knex = ReportTemplate.knex();
    const html = (await knex.raw(`SELECT * from get_report_template(${templateId})`)).rows[0].templateContent;
    const compiledTemplate = hbs.compile(html);
    const rendered = compiledTemplate(data);
    return rendered;
}

export const toPdf = async (outputPath, htmlContent, header, footer) => {
    const cssPath = isDevMode ? 'public/css/index.css' : path.join(__dirname, 'public/css/index.css');
    const reportPath = isDevMode ? 'public/reports' : path.join(__dirname, 'public/reports');
    if(!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath);
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.emulateMediaType('print');
    await page.addStyleTag({path: cssPath});
    await page.pdf({path: `${reportPath}/${outputPath}.pdf`, format: 'A4', displayHeaderFooter: true, printBackground: true, margin: {top: '50px', bottom: '50px', left: '20px', right: '20px'}, headerTemplate: header, footerTemplate: footer});
    await browser.close();
}


export const toBufferPdf = async (htmlContent, header, footer, cssFile="index") => {
    const cssPath = isDevMode ? `public/css/${cssFile}.css` : path.join(__dirname, `public/css/${cssFile}.css`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);
    await page.emulateMediaType('print');

    await page.addStyleTag({path: cssPath});

    const buffer = await page.pdf({format: 'A4', displayHeaderFooter: true, printBackground: true, margin: {top: '50px', bottom: '50px', left: '20px', right: '20px'}, headerTemplate: header, footerTemplate: footer});
    await browser.close();
    return buffer;
}