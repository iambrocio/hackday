import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import React, { useState } from 'react';

const Home = () => {

  const [selectedFiles, setSelectedFiles] = useState([]);

  function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    const xmlFiles = files.filter(file => file.type === 'text/xml');
    setSelectedFiles(xmlFiles);
  }

  async function consolidateXml(xmlData) {
    const urlElements = [];
  
    await Promise.all(xmlData.map(async (xml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const urls = xmlDoc.getElementsByTagName('url');
      Array.prototype.forEach.call(urls, url => {
        // Remove xmlns attribute from url tag
        const urlXml = url.outerHTML.replace(/ xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/g, '');
        urlElements.push(`\n\t${urlXml}`);
      });
    }));
  
    const consolidatedXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlElements.join('')}\n</urlset>`;
  
    return consolidatedXml;
  }

  async function callConsolidate() {
    const xmlData = [];
    await Promise.all(selectedFiles.map(async (file) => {
      const contents = await readFileAsync(file);
      xmlData.push(contents);
    }));
    const consolidatedXml = await consolidateXml(xmlData);
    downloadXml(consolidatedXml);
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  function downloadXml(consolidatedXml) {
    const element = document.createElement('a');
    const file = new Blob([consolidatedXml], {type: 'text/xml'});
    element.href = URL.createObjectURL(file);
    element.download = 'consolidated.xml';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className='max-h-full min-h-screen mx-auto'>
      <div className='container mx-auto place-items-center h-32 flex items-center'>
        <h1 className='text-5xl mx-auto text-center'>Crawler</h1>
      </div>
      <div>
        <div className='mx-auto flex flex-col items-center h-96 w-3/4 justify-evenly'>
          <div className='bg-amber-200 flex items-center content-center w-full justify-around'>
              <input type="file" name="files[]" multiple className='block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100'/>
              <button className='bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 py-2 px-4 rounded-full text-sm'>Clean up XML sitemap</button>
          </div>
          <div className='bg-amber-200 flex items-center content-center w-full justify-evenly'>
            <input type="file" multiple onChange={handleFileSelect} className='block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    '/>
            <button onClick={callConsolidate} className='bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 py-2 px-4 rounded-full text-sm'>Consolidate Sitemaps</button>
          </div>
          <div className='bg-amber-200 flex items-center content-center w-full justify-around'>
              <input type="file" name="files[]" multiple className='block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    '/>
              <button className='bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 py-2 px-4 rounded-full text-sm	'>Push Sitemap to S3</button>
          </div>
        </div>
      </div>
      <div>
      </div>
      <div>
      </div>
    </div>
  )
};

export default Home