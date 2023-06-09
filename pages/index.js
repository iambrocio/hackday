import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import React, { useState } from "react";

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCsvFiles, setSelectedCsvFiles] = useState([]);

  function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    const xmlFiles = files.filter((file) => file.type === "text/xml");
    setSelectedFiles(xmlFiles);
  }

  function handleCleanFileSelect(event) {
    const files = Array.from(event.target.files);
    const csvFiles = files.filter((file) => file.type === "text/csv");

    setSelectedCsvFiles(csvFiles);
  }

  async function consolidateXml(xmlData) {
    const urlElements = [];

    await Promise.all(
      xmlData.map(async (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const urls = xmlDoc.getElementsByTagName("url");
        Array.prototype.forEach.call(urls, (url) => {
          // Remove xmlns attribute from url tag
          const urlXml = url.outerHTML.replace(
            / xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/g,
            ""
          );
          urlElements.push(`\n\t${urlXml}`);
        });
      })
    );

    const consolidatedXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlElements.join(
      ""
    )}\n</urlset>`;

    return consolidatedXml;
  }

  async function csvToXml(csvData) {
    return csvData.map((data) => {
      const rows = data.split("\n");
      const values = rows.slice(1).map((row) => row.split(","));

      const filteredValues = values.filter(
        (data) => data[3]?.includes("200") && data[5]?.includes("Indexable")
      );

      let xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (let i = 0; i < filteredValues.length; i++) {
        xml += "<url>\n";
        xml += `<loc>${filteredValues[i][0]}\n</loc>\n`;
        xml += "</url>\n";
      }
      xml += "</urlset>";

      return xml;
    });
  }

  async function callCleanUp() {
    const csvData = [];
    await Promise.all(
      selectedCsvFiles.map(async (file) => {
        const contents = await readFileAsync(file);
        csvData.push(contents);
      })
    );

    const filteredCsv = await csvToXml(csvData);
    downloadXml(filteredCsv, "filtered.xml");
  }

  async function callConsolidate() {
    const xmlData = [];
    await Promise.all(
      selectedFiles.map(async (file) => {
        const contents = await readFileAsync(file);
        xmlData.push(contents);
      })
    );
    const consolidatedXml = await consolidateXml(xmlData);
    downloadXml(consolidatedXml, "consolidated.xml");
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  function downloadXml(consolidatedXml, name) {
    const element = document.createElement("a");
    const file = new Blob([consolidatedXml], { type: "text/xml" });
    element.href = URL.createObjectURL(file);
    element.download = name;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className="max-h-full min-h-screen mx-auto">
      <div className="container mx-auto place-items-center h-32 flex items-center">
        <h1 className="text-5xl mx-auto text-center">Optimization outlaws</h1>
      </div>
      <div>
        <div className="mx-auto flex flex-col items-center h-96 w-3/4 justify-evenly">
          <div className="flex items-center content-center w-7/12 justify-around">
            <input
              type="file"
              name="files[]"
              multiple
              onChange={handleCleanFileSelect}
              className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100"
            />
            <button
              onClick={callCleanUp}
              className="bg-amber-200 hover:bg-yellow-400 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 py-2 px-4 rounded-full text-sm"
            >
              Clean up XML sitemap
            </button>
          </div>
          <div className="flex items-center content-center w-7/12 justify-evenly">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
            />
            <button
              onClick={callConsolidate}
              className="bg-amber-200 hover:bg-yellow-400 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 py-2 px-4 rounded-full text-sm"
            >
              Consolidate Sitemaps
            </button>
          </div>
          <div className="flex items-center content-center w-7/12 justify-around">
            <input
              type="file"
              name="files[]"
              multiple
              className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
            />
            <button className="bg-amber-200	 hover:bg-yellow-400 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 py-2 px-4 rounded-full text-sm	">
              Push Sitemap to S3
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <svg width="200" height="200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="#F7DC6F"
            stroke="#000000"
            stroke-width="4"
          />
          <circle
            cx="70"
            cy="70"
            r="20"
            fill="#FFFFFF"
            stroke="#000000"
            stroke-width="4"
          />
          <circle
            cx="130"
            cy="70"
            r="20"
            fill="#FFFFFF"
            stroke="#000000"
            stroke-width="4"
          />
          <path
            d="M 70 120 Q 100 140 130 120"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 80 160 Q 100 170 120 160"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 60 160 Q 80 180 100 170"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <circle
            cx="95"
            cy="85"
            r="5"
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
          />
          <circle
            cx="105"
            cy="85"
            r="5"
            fill="#000000"
            stroke="#000000"
            stroke-width="2"
          />
          <path
            d="M 90 100 Q 100 110 110 100"
            fill="none"
            stroke="#000000"
            stroke-width="4"
          />
          <path
            d="M 110 100 Q 120 110 130 100"
            fill="none"
            stroke="#000000"
            stroke-width="4"
          />
          <path
            d="M 50 120 Q 70 130 70 140"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 40 140 Q 60 150 70 160"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 30 160 Q 50 170 70 170"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 150 120 Q 130 130 130 140"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 160 140 Q 140 150 130 160"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
          <path
            d="M 170 160 Q 150 170 130 170"
            fill="none"
            stroke="#000000"
            stroke-width="8"
          />
        </svg>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Home;
