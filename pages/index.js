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
        urlElements.push('\n  ' + urlXml);
      });
    }));

    const consolidatedXml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urlElements.join('') + '</urlset>';

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
    <div className='bg-amber-100 max-h-full min-h-screen mx-auto'>
      <div className='container mx-auto place-items-center bg-green-300 h-32 flex items-center'>
        <h1 className='bg-red-200 text-5xl mx-auto text-center'>Crawler</h1>
      </div>
      <div>
        <div className='mx-auto flex flex-col items-center h-96 w-3/4 justify-evenly'>
          <div>
            <form action="/upload" method="post" enctype="multipart/form-data">
              <input type="file" name="files[]" multiple />
              <button className='bg-sky-500 hover:bg-sky-700'>Clean up XML sitemap</button>
            </form>
          </div>
          <div>
            <input type="file" multiple onChange={handleFileSelect} />
            <button onClick={callConsolidate}>Consolidate Sitemaps</button>
          </div>
          <div>
            <form action="/upload" method="post" enctype="multipart/form-data">
              <input type="file" name="files[]" multiple />
              <input type="submit" value="Push to S3 file" />
            </form>
          </div>
        </div>
      </div>
      <div>
      <div class="progress">
      <div class="progress-bar"></div>
</div>

      </div>
    </div>
  )
};

export default Home