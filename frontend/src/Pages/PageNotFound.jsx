import errorPage from '../assets/Images/errorPageIllustration.png'
import cone from '../assets/cone.svg'


const PageNotFound = () => {
  return (
    <div className="pages flex lg:flex-row lg:pl-32 items-center flex-col gap-10 my-28">
      <img src={errorPage}
           alt="Error page"
           className=' lg:w-[50%] w-[90%]' />
      <div className='flex flex-col gap-5'>
        <h1 className='font-black lg:text-6xl md:text-5xl text-3xl text-white'>404 Error</h1>
        <p className='flex gap-2 text-white lg:text-2xl md:text-xl text-lg'><img src={cone} alt="cone" /> Page not found <img src={cone} alt="cone" /></p>
      </div>
    </div>

  )
}

export default PageNotFound