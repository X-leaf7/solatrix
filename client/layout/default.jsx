import Header from '../component/Header.jsx'
import Footer from '../component/Footer'

export default function Layout({ children }) {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  )
}