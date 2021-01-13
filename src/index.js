require('dotenv').config();
import { log } from '$/src/log';
import { getKnexInstance } from '$/src/db/util';
import { BehaviorSubject } from 'rxjs';
import { convertFieldsToCamelCase } from '$/src/lib/util';
const JSONbigString = require('json-bigint-x')({ storeAsString: true });

import {renderTemplate, renderBufferTemplate, toPdf, toBufferPdf} from './report/report-util.js';
import { registerRoute } from './route'

import './db/init';
import {PDFDocument} from 'pdf-lib';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const handlebars = require('express-handlebars');

const puppeteer = require('puppeteer');
const HTMLtoDOCX = require('html-to-docx');
const util = require('util');
const conversionFactory = require('html-to-xlsx');
const chromeEval = require('chrome-page-eval')({ puppeteer });
const writeFileAsync = util.promisify(fs.writeFile);
const imageToBase64 = require('image-to-base64');
const Handlebars = require('handlebars');

global.log = log

// let browser;
// export let page;

// const initBrowser = async () => {
//     browser = await puppeteer.launch();
//     page = await browser.newPage();
//     await page.setDefaultNavigationTimeout(0);
// }

// initBrowser();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with, authorization, Content-Type, Authorization, X-XSRF-TOKEN');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});


Handlebars.registerHelper('getImageUrl',  (image) => {
    return `http://localhost:${port}/images/${image}`;
});

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: 'public/templates',
    extname: 'hbs'
    }));

app.all('/images/*', (req, res, next) => {
    if(req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
        next();
    } else {
        res.status(403).send({
            message: 'Access Forbidden'
        });
    }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('main', {layout : 'index'});
});

app.get('/test', (req, res) => {
    res.status(200).send("{\"status\" : \"abc...\"}");
});

const loadImageToBase64 = async () => {
    const result = [
        {
            base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/1.jpg'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/2.jpg'),
            imageName: 'Image 2'
        },
        {
            base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/3.jpeg'),
            imageName: 'Image 3'
        },
        {
            base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/4.jpg'),
            imageName: 'Image 4'
        },
        {
            base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/5.jpg'),
            imageName: 'Image 5'
        },
        {
            base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/6.jpg'),
            imageName: 'Image 6'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/1.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/2.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/3.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/1.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/4.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/5.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/6.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/7.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/8.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/9.png'),
            imageName: 'Image 1'
        },
        {
            base64Data: 'data:image/png;base64, ' + await imageToBase64('public/images/10.png'),
            imageName: 'Image 1'
        },
        // {
        //     base64Data: 'data:image/jpeg;base64, ' + await imageToBase64('public/images/large.jpg'),
        //     imageName: 'Large Image'
        // },
    ];

    return result;
}

app.get('/report-doctor-list-test', async (req, res) => {
    const { Partner } = require('./models/Partner.js');
    const knex = Partner.knex();
    const doctorList = (await knex.raw('SELECT * from get_doctor_list()')).rows;
    res.render('main', {layout : 'doctor-list', doctors: doctorList, images: await loadImageToBase64()});
});

app.get('/report-doctor-list-pdf', async (req, res, next) => {
    const start = new Date().getTime();
    const { Partner } = require('./models/Partner.js');
    const knex = Partner.knex();
    const doctorList = (await knex.raw('SELECT * from get_doctor_list()')).rows;
    
    const rendered = await renderBufferTemplate(1, {doctors: doctorList, images: await loadImageToBase64()});
    fs.writeFileSync('test.html', rendered);
    const buffer = await toBufferPdf (rendered , `<span style="margin-left: 20px; font-size: 13px;">Danh Sách Bác Sĩ</span>`, `<span style="font-size: 13px; margin-left: 20px;">Trang <span class="pageNumber"></span>/<span class="totalPages"></span> </span>`);
    const end = new Date().getTime();
    console.log(end - start);
    res.contentType("application/pdf");
    res.send(buffer);

    // const rendered = renderTemplate('doctor_list', {doctors: doctorList});
    // const rendered2 = renderTemplate('doctor_list2', {doctors: doctorList});
    // const buffer1 = await toBufferPdf (rendered , `<span style="margin-left: 20px; font-size: 13px;">Danh Sách Bác Sĩ</span>`, `<span style="font-size: 13px; margin-left: 20px;">Trang <span class="pageNumber"></span>/<span class="totalPages"></span> </span>`);
    // const buffer2 = await toBufferPdf (rendered2 , `<span style="margin-left: 20px; font-size: 13px;">Danh Sách Bác Sĩ</span>`, `<span style="font-size: 13px; margin-left: 20px;">Trang <span class="pageNumber"></span>/<span class="totalPages"></span> </span>`, "index2");
    
    // const merged = [buffer1, buffer2];

    // const mergedPdf = await PDFDocument.create(); 
    // for (let pdfBytes of merged) { 
    //     const pdf = await PDFDocument.load(pdfBytes); 
    //     const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    //     copiedPages.forEach((page) => {
    //         mergedPdf.addPage(page); 
    //     }); 
    // } 

    // const buffer = await mergedPdf.save();  
    
    // let path = `merged${new Date().getTime()}.pdf`; 
    // // let path = `merged.pdf`; 
    // fs.open(path, 'w', function (err, fd) {
    //     fs.write(fd, buffer, 0, buffer.length, null, function (err) {
    //         fs.close(fd, function () {
    //             console.log('wrote the file successfully');
    //             const buf = fs.readFileSync(path);
    //             res.contentType("application/pdf");
    //             res.send(buf);
    //         }); 
    //     }); 
    // }); 

});

// docx
app.get('/report-doctor-list-docx', async (req, res, next) => {
    const { Partner } = require('./models/Partner.js');
    const knex = Partner.knex();
    const doctorList = (await knex.raw('SELECT * from get_doctor_list()')).rows;
    const rendered = renderTemplate('doctor-list', {doctors: doctorList});

    const fileBuffer = await HTMLtoDOCX(rendered, null);

    fs.writeFile('report-doctor-list.docx', fileBuffer, (error) => {
        if (error) {
            console.log('Docx file creation failed');
        }
        console.log('Docx file created successfully');
        const file = 'report-doctor-list.docx';
        res.download(file); 
    });

});

const conversion = conversionFactory({
    extract: async ({ html, ...restOptions }) => {
      const tmpHtmlPath = path.join(__dirname, 'input.html')
  
      await writeFileAsync(tmpHtmlPath, html)
  
      const result = await chromeEval({
        ...restOptions,
        html: tmpHtmlPath,
        scriptFn: conversionFactory.getScriptFn()
      })
  
      const tables = Array.isArray(result) ? result : [result]
  
      return tables.map((table) => ({
        name: table.name,
        getRows: async (rowCb) => {
          table.rows.forEach((row) => {
            rowCb(row)
          })
        },
        rowsCount: table.rows.length
      }))
    }
  })

// xlsx
app.get('/report-doctor-list-xlsx', async (req, res, next) => {
    const { Partner } = require('./models/Partner.js');
    const knex = Partner.knex();
    const doctorList = (await knex.raw('SELECT * from get_doctor_list()')).rows;
    const rendered = renderTemplate('doctor-list', {doctors: doctorList});

    
    const stream = await conversion(rendered);

    stream.pipe(fs.createWriteStream('output.xlsx'));

    setTimeout(() => {
        const file = 'output.xlsx';
        res.download(file); 
    }, 500);
    
});




export let PRIVATE_KEY;
export let PUBLIC_KEY;

let notify$ = new BehaviorSubject();

app.get('/notify', (req, res, next) => {
    const headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache"
      };
    res.writeHead(200, headers);
    notify$.subscribe((data) => {
        if(data) {
            try {
                res.write(`data:${data}\n\n`);
            } catch (er) {
                res.statusCode = 400;
                return res.end(`error: ${er.message}`);
            }
        }
        
    })
});


class Server {
    constructor() {
        this.app = app
        PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'keys/private-pkcs8.pem'));
        PUBLIC_KEY = fs.readFileSync(path.join(__dirname, 'keys/public.pem'));
    }

    init () {
        log.info('init');
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    registerRoute () {
        log.info('register route');
        registerRoute(this.app)
    }

    start () {
        const port = process.env.SERVER_PORT || 8080; 
        this.app.listen(port, () => log.info(`Server is running on port ${port}`));
    }
}

const notifyListener = async () => {
    try {
        const knex = getKnexInstance();
        const connection = await knex.client.acquireConnection();
        connection.query('LISTEN event_channel');
        connection.on('notification', (msg) => {
            const obj = JSONbigString.parse(msg.payload);
            obj.data = convertFieldsToCamelCase(obj.data);
            notify$.next(JSON.stringify(obj));
        });
        await knex.client.releaseConnection(connection);
    } catch (e) {
        console.log('Notify listener is reconnecting...')
        knex.destroy();
        setTimeout(() => {
            notifyListener();
        }, 1000);
    }
}


const main = () => {
    const server = new Server ();
    server.init();
    server.registerRoute();
    server.start();
    notifyListener();
}

main();

