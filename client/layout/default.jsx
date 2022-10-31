import Header from '../component/Header.jsx'
import Footer from '../component/Footer'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}