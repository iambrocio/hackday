import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const Home = () => {
  return (
    <div className='bg-amber-100 max-h-full min-h-screen mx-auto'>
      <div className='container mx-auto place-items-center bg-green-300 h-32 flex items-center'>
        <h1 className='bg-red-200 text-5xl mx-auto text-center'>Crawler</h1>
      </div>
      <div>
        <div className='bg-purple-400 mx-auto flex flex-col items-center h-96 w-3/4	 justify-evenly'>
          <div>
            <form action="/upload" method="post" enctype="multipart/form-data">
              <input type="file" name="files[]" multiple />
              <input type="submit" value="Clean up XML sitemap" />
            </form>
          </div>
          <div>
            <form action="/upload" method="post" enctype="multipart/form-data">
              <input type="file" name="files[]" multiple />
              <input type="submit" value="Consolidate Sitemaps" />
            </form>
          </div>
          <div>
            <form action="/upload" method="post" enctype="multipart/form-data">
              <input type="file" name="files[]" multiple />
              <input type="submit" value="Push to S3 file" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home